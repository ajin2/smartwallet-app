import { Dispatch, AnyAction } from 'redux'
import { JolocomLib } from 'jolocom-lib'
import { StateCredentialRequestSummary, StateVerificationSummary } from 'src/reducers/sso'
import { BackendMiddleware } from 'src/backendMiddleware'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { showErrorScreen } from 'src/actions/generic'
import { getUiCredentialTypeByType } from 'src/lib/util'
import { JSONWebToken } from 'jolocom-lib/js/interactionFlows/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionFlows/types'

export const setCredentialRequest = (request: StateCredentialRequestSummary) => {
  return {
    type: 'SET_CREDENTIAL_REQUEST',
    value: request
  }
}

export const clearCredentialRequest = () => {
  return {
    type: 'CLEAR_CREDENTIAL_REQUEST'
  }
}

interface AttributeSummary {
  type: string[]
  results: Array<{
    verification: string
    fieldName: string
    values: string[]
  }>
}

export const consumeCredentialRequest = (jwtEncodedCR: string) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { storageLib } = backendMiddleware
    const { did } = getState().account.did.toJS()

    const credentialRequest = await JSONWebToken.decode(jwtEncodedCR)
    const requestedTypes = credentialRequest.getRequestedCredentialTypes()
    const attributesForType = await Promise.all<AttributeSummary>(requestedTypes.map(storageLib.get.attributesByType))

    const populatedWithCredentials = await Promise.all(
      attributesForType.map(async entry =>
        Promise.all(
          entry.results.map(async result => ({
            type: getUiCredentialTypeByType(entry.type),
            values: result.values,
            verifications: await storageLib.get.verifiableCredential({ id: result.verification })
          }))
        )
      )
    )

    const abbreviated = populatedWithCredentials.map(attribute =>
      attribute.map(entry => ({
        ...entry,
        verifications: entry.verifications.map((vCred: SignedCredential) => ({
          id: vCred.getId(),
          issuer: vCred.getIssuer(),
          selfSigned: vCred.getSigner().did === did,
          expires: vCred.getExpiryDate()
        }))
      }))
    )

    const flattened = abbreviated.reduce((acc, val) => acc.concat(val))

    // TODO requestere shouldn't be optional
    const summary = {
      callbackURL: credentialRequest.getCallbackURL(),
      requester: credentialRequest.iss as string,
      availableCredentials: flattened
    }

    dispatch(setCredentialRequest(summary))
    dispatch(navigationActions.navigate({ routeName: routeList.Consent }))
  }
}

// TODO Decrypt when fetching from storage
export const sendCredentialResponse = (selectedCredentials: StateVerificationSummary[]) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { storageLib, keyChainLib, encryptionLib, ethereumLib } = backendMiddleware

    const encryptionPass = await keyChainLib.getPassword()
    const { did } = getState().account.did.toJS()
    const { callbackURL } = getState().sso.activeCredentialRequest

    const personaData = await storageLib.get.persona({ did })

    const { encryptedWif } = personaData[0].controllingKey
    const decryptedWif = encryptionLib.decryptWithPass({
      cipher: encryptedWif,
      pass: encryptionPass
    })

    const { privateKey } = ethereumLib.wifToEthereumKey(decryptedWif)

    const registry = JolocomLib.registry.jolocom.create()
    const wallet = await registry.authenticate(Buffer.from(privateKey, 'hex'))

    const credentials = await Promise.all(
      selectedCredentials.map(async cred => (await storageLib.get.verifiableCredential({ id: cred.id }))[0])
    )

    const jsonCredentials = credentials.map(cred => cred.toJSON())
    const credentialResponse = await wallet.create.credentialResponseJSONWebToken({
      typ: InteractionType.CredentialResponse,
      credentialResponse: {
        suppliedCredentials: jsonCredentials
      }
    })

    try {
      await fetch(callbackURL, {
        method: 'POST',
        body: JSON.stringify({ token: credentialResponse.encode() }),
        headers: { 'Content-Type': 'application/json' }
      })

      dispatch(clearCredentialRequest())
      dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
    } catch (err) {
      // TODO better handling
      dispatch(showErrorScreen(err))
    }
  }
}

export const cancelSSO = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(clearCredentialRequest())
    dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
  }
}
