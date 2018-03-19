import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import IdentityScreenNew from './identity-new'
import Presentation from '../presentation/identity-new'

describe('(Component) IdentityScreenNew', () => {
  it('should call retrieveAttributes on componentDidMount', () => {
    const retrieveAttributes = stub()
    const getClaims = stub()
    const appHasStarted = stub()

    const wrapper = shallow(
      (<IdentityScreenNew.WrappedComponent {
        ...IdentityScreenNew.mapStateToProps(Immutable.fromJS({
          wallet: {
            identityNew: {
              appStarted: false,
              toggleEdit: {
                field: '',
                bool: false
              },
              userData: {
                phone: '',
                name: '',
                email: ''
              },
              qrscan: false,
              errorMsg: ''
            }
          }
        }))
      }
        enterField={() => {}}
        saveAttribute={() => {}}
        toggleEditField={() => {}}
        toggleQRScan={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmPhone={() => {}}
        confirmEmail={() => {}}
        openConfirmDialog={() => {}}
        retrieveAttributes={retrieveAttributes}
        getClaims={getClaims}
        appHasStarted={appHasStarted}
        />),
      { context: { muiTheme: { } } }
    )
    wrapper.instance().componentDidMount()
    // eslint-disable-next-line
    expect(retrieveAttributes.called).to.be.true
    expect(retrieveAttributes.calls).to.deep.equal([{args: [{
      claims: [
        'phone', 'name', 'email'
      ]
    }]}])
  })

  it('should call enterField with proper params', () => {
    const enterField = stub()
    const wrapper = shallow((<IdentityScreenNew.WrappedComponent {
      ...IdentityScreenNew.mapStateToProps(Immutable.fromJS({
        wallet: {
          identityNew: {
            toggleEdit: {
              field: '',
              bool: false
            },
            userData: {
              phone: '',
              name: '',
              email: ''
            },
            qrscan: false,
            errorMsg: ''
          }
        }
      }))
    }
      enterField={enterField}
      saveAttribute={() => {}}
      toggleEditField={() => {}}
      toggleQRScan={() => {}}
      retrieveAttributes={() => {}}
      getClaims={() => {}}
      appHasStarted={() => {}}
      startPhoneVerification={() => {}}
      startEmailVerification={() => {}}
      confirmPhone={() => {}}
      confirmEmail={() => {}}
      openConfirmDialog={() => {}}
      />),
    { context: { muiTheme: { } } })

    wrapper.find(Presentation).props().enterField({
      field: 'name',
      value: 'Edward'
    })
    // eslint-disable-next-line
    expect(enterField.called).to.be.true
    expect(enterField.calls).to.deep.equal([{
      args: [{
        field: 'name',
        value: 'Edward'
      }]
    }])
  })

  it('should call toggleEditField with proper params', () => {
    const toggleEditField = stub()
    const wrapper = shallow((<IdentityScreenNew.WrappedComponent {
      ...IdentityScreenNew.mapStateToProps(Immutable.fromJS({
        wallet: {
          identityNew: {
            toggleEdit: {
              field: '',
              bool: false
            },
            userData: {
              phone: '',
              name: '',
              email: ''
            },
            qrscan: false,
            errorMsg: ''
          }
        }
      }))
    }
      enterField={() => {}}
      saveAttribute={() => {}}
      toggleEditField={toggleEditField}
      toggleQRScan={() => {}}
      retrieveAttributes={() => {}}
      getClaims={() => {}}
      appHasStarted={() => {}}
      startPhoneVerification={() => {}}
      startEmailVerification={() => {}}
      confirmPhone={() => {}}
      confirmEmail={() => {}}
      openConfirmDialog={() => {}}
      />),
    { context: { muiTheme: { } } })

    wrapper.find(Presentation).props().toggleEditField({
      field: 'name',
      value: 'false'
    })
    // eslint-disable-next-line
    expect(toggleEditField.called).to.be.true
    expect(toggleEditField.calls).to.deep.equal([{
      args: [{
        field: 'name',
        value: 'false'
      }]
    }])
  })

  it('should call saveAttribute with proper params', () => {
    const saveAttribute = stub()
    const wrapper = shallow((<IdentityScreenNew.WrappedComponent {
      ...IdentityScreenNew.mapStateToProps(Immutable.fromJS({
        wallet: {
          identityNew: {
            toggleEdit: {
              field: '',
              bool: false
            },
            userData: {
              phone: '',
              name: '',
              email: ''
            },
            qrscan: false,
            errorMsg: ''
          }
        }
      }))
    }
      enterField={() => {}}
      saveAttribute={saveAttribute}
      toggleEditField={() => {}}
      toggleQRScan={() => {}}
      retrieveAttributes={() => {}}
      getClaims={() => {}}
      appHasStarted={() => {}}
      startPhoneVerification={() => {}}
      startEmailVerification={() => {}}
      confirmPhone={() => {}}
      confirmEmail={() => {}}
      openConfirmDialog={() => {}}
      />),
    { context: { muiTheme: { } } })

    wrapper.find(Presentation).props().saveAttribute({
      field: 'name'
    })
    // eslint-disable-next-line
    expect(saveAttribute.called).to.be.true
    expect(saveAttribute.calls).to.deep.equal([{
      args: [{
        field: 'name'
      }]
    }])
  })
})