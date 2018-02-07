import React from 'react'
import PropTypes from 'prop-types'
// import Radium from 'radium'

import TextField from 'material-ui/TextField'
import { ListItem } from 'material-ui/List'
import { StaticListItem, VerificationButtons } from './'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import SocialPerson from 'material-ui/svg-icons/social/person'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import ActionDone from 'material-ui/svg-icons/action/done'
import ContentCreate from 'material-ui/svg-icons/content/create'
import {theme} from 'styles'

const STYLES = {
  addBtn: {
    position: 'absolute',
    top: '15x',
    right: '15px'
  },
  textStyle: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  icon: {
    top: '13px'
  }
}

export default class AttributeDisplay extends React.Component {
  static propTypes = {
    identity: PropTypes.object,
    id: PropTypes.string,
    toggleEditField: PropTypes.func.isRequired,
    enterField: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired
  }

  componentDidUpdate() {
    const {identity} = this.props
    if (identity.toggleEdit.bool && identity.toggleEdit.field === this.props.id) { // eslint-disable-line max-len
      this.refs[this.props.id].focus()
    }
  }

  getIcon(id) {
    if (id === 'phone') {
      return <CommunicationCall color={'grey'} style={STYLES.icon} />
    } else if (id === 'email') {
      return <CommunicationEmail color={'grey'} style={STYLES.icon} />
    } else if (id === 'name') {
      return <SocialPerson color={'grey'} style={STYLES.icon} />
    }
  }

  render() {
    const {identity} = this.props
    const toggle = identity.toggleEdit.bool && identity.toggleEdit.field === this.props.id // eslint-disable-line max-len
    let button

    if (toggle) {
      button = (<FloatingActionButton
        mini
        secondary
        onClick={() => this.props.saveAttribute({
          field: this.props.id
        })}
        style={STYLES.addBtn} >
        <ActionDone />
      </FloatingActionButton>)
    } else {
      button = (
        <FloatingActionButton
          mini
          iconStyle={{fill: theme.palette.accent1Color}}
          backgroundColor={'#fff'}
          onClick={() => this.props.toggleEditField({
            field: this.props.id,
            value: identity.toggleEdit.bool
          })}
          style={STYLES.addBtn}>
          <ContentCreate />
        </FloatingActionButton>
      )
    }

    return (
      <ListItem
        key={this.props.id}
        leftIcon={this.getIcon(this.props.id)}
        disabled>
        <div>
          <TextField
            ref={this.props.id}
            disabled={!toggle}
            underlineShow={toggle}
            value={identity.userData[this.props.id]}
            inputStyle={STYLES.textStyle}
            onChange={(e) =>
              this.props.enterField({
                value: e.target.value,
                field: this.props.id
              })}
            hintText={'Please enter your ' + this.props.id} />
          {button}
        </div>
      </ListItem>
    )
  }
}

// <StaticListItem
//   key={attrValue}
//   verified={verified}
//   textValue={attrValue}
//   textLabel={labelText}
//   icon={index === 0 ? icon : null}
//   secondaryTextValue={type} />
// <VerificationButtons
//   attrType={attrType}
//   index={index}
//   requestVerificationCode={requestVerificationCode}
//   resendVerificationCode={resendVerificationCode}
//   enterVerificationCode={enterVerificationCode}
//   smsCode={smsCode}
//   pinValue={pin}
//   setFocusedPin={(value) => { setFocusedPin(value, index) }}
//   changePinValue={(value, codeType) => {
//     changePinValue(attrTypeToKey(attrType), value, index, codeType)
//   }}
//   focused={pinFocused}
//   value={attrValue}
//   codeIsSent={codeIsSent}
//   verified={verified} />
