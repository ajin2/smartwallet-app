import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import accepts from 'attr-accept'
import {proxy} from 'settings'

import Dialog from 'components/common/dialog.jsx'
import AccountStore from 'stores/account'
import {Layout, Content} from 'components/layout'
import {
  AppBar,
  IconButton,
  TextField,
  Card,
  CardMedia,
  CardActions,
  FlatButton,
  RaisedButton,
  List, ListItem,
  Divider, Subheader
} from 'material-ui'

import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import ActionCreditCard from 'material-ui/svg-icons/action/credit-card'
import LinearProgress from 'material-ui/LinearProgress'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import SocialPublic from 'material-ui/svg-icons/social/public'
import SocialPersonOutline from 'material-ui/svg-icons/social/person-outline'
import CommunicationPhone from 'material-ui/svg-icons/communication/phone'
import ActionCompany from 'material-ui/svg-icons/action/account-balance'
import AvWeb from 'material-ui/svg-icons/av/web'
import ActionStar from 'material-ui/svg-icons/toggle/star'
import CommunicationLocation
  from 'material-ui/svg-icons/communication/location-on'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'
import JolocomTheme from 'styles/jolocom-theme'
import BitcoinIcon from 'components/icons/bitcoin-icon.jsx'
import PassportIcon from 'components/icons/passport-icon.jsx'

import Util from 'lib/util'
import GraphAgent from '../../lib/agents/graph.js'

const theme = getMuiTheme(JolocomTheme)

let Profile = React.createClass({
  mixins: [
    Reflux.listenTo(ProfileStore, 'onProfileChange')
  ],

  contextTypes: {
    router: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },

  // TODO ?
  getInitialState() {
    return {
      bitcoinErrorText: ''
    }
  },

  onProfileChange(state) {
    this.setState(state)
  },

  componentDidMount() {
    this.loadingPassportPhoto = false
    this.loadingDisplayPhoto = false
    this.bitcoinErrorText = '9'
    this.refs.dialog.show()
  },

  /*
  componentDidUpdate(props, state) {
    if (state.show !== this.state.show) {
      if (this.state.show) {
        this.refs.dialog.show()
      } else {
        this.refs.dialog.hide()
      }
    }
  },
  */

  downloadPK() {
    window.location.href = `${proxy}/exportkey`
  },

  uploadPK() {
    return fetch(`${proxy}/importkey`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'text/turtle'
      }
    })
  },

  show() {
    ProfileActions.show()
  },

  hide() {
    console.log('hllo!')
    this.context.router.goBack()
  },

  getStyles() {
    const {muiTheme} = this.context
    let styles = {
      image: {
        height: '176px'
      },
      bar: {
        backgroundColor: muiTheme.palette.primary1Color
      },
      content: {
        overflowY: 'auto'
      },
      main: {
        padding: '8px 0'
      },
      file: {
        display: 'none'
      },
      input: {
        width: '100%'
      },
      passportContainer: {
        paddingTop: '28px',
        boxSizing: 'border-box',
        minHeight: '72px'
      },
      passportIcon: {
        width: '24px'
      },
      passportPreview: {
        width: '40px',
        marginRight: '10px'
      },
      uploadPassportButton: {
        margin: '0 10px 0 0',
        position: 'relative',
        top: '-11px',
        verticalAlign: 'top'
      },
      removePassportButton: {
        verticalAlign: 'top'
      },
      bitcoinIcon: {
        width: '24px'
      },
      form: {},
      formRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      },
      label: {
        display: 'inline-block',
        textAlign: 'right',
        paddingLeft: '16px',
        paddingRight: '32px'
      },
      field: {
        flex: 1,
        marginRight: '16px'
      },
      labelPassport: {},
      labelBitcoinAddress: {},
      progBar: {},
      privateKeyButtonRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '15px',
        marginLeft: '10px'
      },
      divider: {
        width: '5px',
        height: 'auto',
        display: 'inline-block'
      },
      subheader: {
        marginTop: '40px',
        paddingLeft: '24px',
        lineHeight: '20px'
      },
      titleDivider: {
        marginTop: '10px'
      },
      title: {
        padding: '0 24px',
        color: '#4b132b',
        fontWeight: '100',
        fontSize: '1.5em'
      },
      sectionHeader: {
        padding: '0 8px',
        margin: '0'
      },
      sectionDivider: {
        marginLeft: '24px'
      }
    }
    return styles
  },

  render() {
    console.log(this.state)
    let img
    let styles = this.getStyles()
    let {file, imgUri} = this.state

    if (file) {
      img = URL.createObjectURL(file)
    } else if (imgUri) {
      img = Util.uriToProxied(imgUri)
    }

    let bgImg = img || '/img/person-placeholder.png'
    return (
      <Dialog ref="dialog" fullscreen>
        <Layout fixedHeader>
          <AppBar
            title="Edit profile"
            titleStyle={{color: '#fff'}}
            style={styles.bar}
            iconElementLeft={
              <IconButton
                iconStyle={{color: '#fff'}}
                color="#fff"
                onClick={this.hide}
                iconClassName="material-icons">arrow_back</IconButton>
            }
            iconElementRight={!this.state.loadingPassportPhoto &&
              !this.state.loadingDisplayPhoto
              ? <IconButton
                iconStyle={{color: '#fff'}}
                onClick={this._handleUpdate}
                iconClassName="material-icons">check</IconButton>
              : <IconButton iconClassName="material-icons">
                  hourglass_empty
              </IconButton>
            }
          />
          <Content style={styles.content}>
            <Card rounded={false}>
              <CardMedia
                style={Object.assign({},
                  styles.image,
                  {background: `url(${bgImg}) center / cover`}
                )} />
              <CardActions>
                {this.state.loadingDisplayPhoto
                  ? <LinearProgress
                    mode="indeterminate"
                    style="progBar" />
                  : img
                      ? <FlatButton
                        label="Remove"
                        onClick={this._handleRemove} />
                      : <FlatButton
                        label="Select or take picture"
                        onClick={this._handleSelect} />}

              </CardActions>
            </Card>
            <input
              ref={this._setFileInputRef}
              type="file"
              name="file"
              style={styles.file}
              multiple={false}
              onChange={this._handleSelectFile} />
            <input
              ref={this._setPassportInputRef}
              type="file"
              name="passportfile"
              style={styles.file}
              multiple={false}
              onChange={this._handleSelectPassportFile} />
            <main style={styles.main}>
              <section>
                <Subheader style={styles.subheader}>Name</Subheader>
                <TextField
                  name="givenName"
                  style={styles.title}
                  onChange={Util.linkToState(this, 'givenName')}
                  value={this.state.givenName} />
                {/** <Divider style={styles.titleDivider} /> **/}
                <div style={styles.form}>
                  <List style={styles.sectionHeader}>
                    <ListItem primaryText="General" disabled />
                  </List>
                  <Divider style={styles.sectionDivider} />
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <SocialPersonOutline color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        name="username"
                        floatingLabelText="Username"
                        floatingLabelFixed
                        onChange={Util.linkToState(this, 'username')}
                        value={AccountStore.state.username}
                        style={styles.input}
                        disabled />
                    </div>
                  </div>
                  <List style={styles.sectionHeader}>
                    <ListItem primaryText="Contact" disabled />
                  </List>
                  <Divider style={styles.sectionDivider} />
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <CommunicationPhone color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Mobile"
                        floatingLabelFixed
                        name="mobile"
                        onChange={Util.linkToState(this, 'mobilePhone')}
                        value={this.state.mobilePhone}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <CommunicationEmail color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Email"
                        floatingLabelFixed
                        name="email"
                        onChange={Util.linkToState(this, 'email')}
                        value={this.state.email}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <CommunicationLocation color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Address"
                        floatingLabelFixed
                        name="address"
                        onChange={Util.linkToState(this, 'address')}
                        value={this.state.address}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <SocialPublic color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Social Media"
                        floatingLabelFixed
                        name="socialMedia"
                        onChange={Util.linkToState(this, 'socialMedia')}
                        value={this.state.socialMedia}
                        style={styles.input} />
                    </div>
                  </div>
                  <List style={styles.sectionHeader}>
                    <ListItem primaryText="Work" disabled />
                  </List>
                  <Divider style={styles.sectionDivider} />
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <ActionStar color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Profession"
                        floatingLabelFixed
                        name="profession"
                        onChange={Util.linkToState(this, 'profession')}
                        value={this.state.profession}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <ActionCompany color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Company"
                        floatingLabelFixed
                        name="company"
                        onChange={Util.linkToState(this, 'company')}
                        value={this.state.company}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <AvWeb color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Url"
                        floatingLabelFixed
                        name="url"
                        onChange={Util.linkToState(this, 'url')}
                        value={this.state.url}
                        style={styles.input} />
                    </div>
                  </div>
                  <List style={styles.sectionHeader}>
                    <ListItem primaryText="Wallet" disabled />
                  </List>
                  <Divider style={styles.sectionDivider} />
                  <div style={styles.formRow}>
                    <div style={Object.assign({},
                      styles.label, styles.labelPassport)}>
                      <PassportIcon style={styles.passportIcon} />
                    </div>
                    <div style={styles.field}>
                      <div style={styles.passportContainer}>
                      {this.state.passportImgUri
                        ? <div>
                          <img
                            src={Util.uriToProxied(this.state.passportImgUri)}
                            style={styles.passportPreview} />
                          <FlatButton
                            label="Remove passport"
                            onClick={this._handleRemovePassport}
                            style={styles.removePassportButton} />
                        </div>
                      : <div>
                      {this.state.loadingPassportPhoto
                        ? <LinearProgress
                          mode="indeterminate"
                          style="progBar" />
                        : <FlatButton
                          label="Upload passport"
                          onClick={this._handleSelectPassport}
                          style={styles.uploadPassportButton} />}
                      </div>}
                      </div>
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={Object.assign({},
                      styles.label, styles.labelBitcoinAddress)}>
                      <BitcoinIcon style={styles.bitcoinIcon} />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Bitcoin Address"
                        floatingLabelFixed
                        name="bitcoinAddress"
                        onChange={Util.linkToState(this, 'bitcoinAddress')}
                        errorText={this.state.bitcoinErrorText}
                        onBlur={this._handleBitcoinValidation}
                        onKeyDown={this._handleBitcoinKeyDown}
                        value={this.state.bitcoinAddress}
                        style={styles.input}
                        multiLine
                        rowsMax={2} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <ActionCreditCard color={theme.jolocom.gray1} />
                    </div>
                    <div style={styles.field}>
                      {/* TODO: back-end implementation */}
                      <TextField
                        floatingLabelText="Credit Card"
                        floatingLabelFixed
                        name="creditcard"
                        onChange={Util.linkToState(this, 'creditCard')}
                        style={styles.input}
                        value={this.state.creditCard} />
                    </div>
                  </div>
                  <div style={styles.privateKeyButtonRow}>
                    <RaisedButton
                      type="submit"
                      secondary
                      label="Download Private Key"
                      onClick={this.downloadPK}
                    />
                    <div style={styles.divider}></div>
                    { /* <RaisedButton
                      type="submit"
                      secondary
                      label="Upload Private Key"
                    /> */ }
                  </div>
                </div>
              </section>
            </main>
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _setFileInputRef(el) {
    this.fileInputEl = el
  },

  _setPassportInputRef(el) {
    this.passportInputEl = el
  },

  _handleUpdate() {
    if (!this.loadingPassportPhoto || !this.loadingDisplayPhoto) {
      this.hide()
      ProfileActions.update(Object.assign({}, this.state, { show: false }))
    }
  },

  // Front-end validation for bitcoin address - used as reference:
  // https://en.bitcoin.it/wiki/Address
  _handleBitcoinValidation({target}) {
    if ((target.value.length < 26 || target.value.length > 35) ||
      (!(target.value[0] === '1' || target.value[0] === '3')) ||
      (!target.value.match(/^[0-9A-Z]+$/i))) {
      this.setState({
        bitcoinErrorText: 'Please enter a valid bitcoin address'
      })
    } else {
      this.setState({
        bitcoinErrorText: ''
      })
    }
  },

  _handleSetPrivacy(event, index, value) {
    this.setState({
      privacy: value
    })
  },

  _handleBitcoinKeyDown(e) {
    if (e.keyCode === 13) e.preventDefault()
  },

  _handleSelect() {
    this.fileInputEl.value = null
    this.fileInputEl.click()
  },

  _handleSelectPassport() {
    this.passportInputEl.value = null
    this.passportInputEl.click()
  },

  _handleRemove() {
    this.fileInputEl.value = null

    if (this.state.file) {
      this.setState({
        imgUri: null,
        file: null
      })
    } else {
      this.setState({
        imgUri: null
      })
    }
  },

  _handleRemovePassport() {
    this.passportInputEl.value = null

    this.setState({
      passportImgUri: ''
    })
  },

  _handleSelectFile({target}) {
    let gAgent = new GraphAgent()
    let file = target.files[0]
    if (!accepts(file, 'image/*')) {
      this.setState({
        error: 'Invalid file type'
      })
    } else {
      this.setState({
        loadingDisplayPhoto: true
      })
      this.setState({
        error: null,
        file: file
      })

      gAgent.storeFile(null, this.state.storage, file).then((res) => {
        this.setState({
          loadingDisplayPhoto: false
        })
        this.setState({imgUri: res})
      }).catch((e) => {
        // console.log(e)
      })
    }
  },

  // User can only enter non-space, numerical values and splits card number
  // into 4's for better readability
  _handleCreditCardValidation({target}) {
    let val = target.value.replace(/[^0-9]|\s/g, '')
    let digitGroups = val.match(/\d{4,16}/g)
    let dGroup = digitGroups && digitGroups[0] || ''
    let parts = []
    for (let i = 0, len = dGroup.length; i < len; i += 4) {
      parts.push(dGroup.substring(i, i + 4))
    }
    if (parts.length) {
      target.value = parts.join(' ')
    } else {
      target.value = target.value.replace(/[^0-9]|\s/g, '')
    }
    // Util.linkToState(this, 'creditCard')
  },

  _handleSelectPassportFile({target}) {
    let gAgent = new GraphAgent()
    let file = target.files[0]
    if (!accepts(file, 'image/*')) {
      this.setState({
        error: 'Invalid file type'
      })
    } else {
      this.setState({
        loadingPassportPhoto: true
      })
      this.setState({
        error: null,
        passportFile: file
      })

      gAgent.storeFile(null, this.state.storage, file, true).then((res) => {
        this.setState({
          loadingPassportPhoto: false
        })
        this.setState({passportImgUri: res})
      }).catch((e) => {
        // console.log(e)
      })
    }
  }

})

export default Radium(Profile)
