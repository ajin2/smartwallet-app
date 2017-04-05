import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/contact'

@connect({
  props: ['wallet'],
  actions: ['wallet/contact:saveChanges',
    'wallet/contact:getAccountInformation',
    'wallet/contact:setInformation',
    'wallet/contact:deleteInformation',
    'wallet/contact:updateInformation']
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    saveChanges: React.PropTypes.func.isRequired,
    getAccountInformation: React.PropTypes.func.isRequired,
    setInformation: React.PropTypes.func.isRequired,
    deleteInformation: React.PropTypes.func.isRequired,
    updateInformation: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      onSubmit={this.props.saveChanges}
      getAccountInformation={this.props.getAccountInformation}
      setInformation={this.props.setInformation}
      deleteInformation={this.props.deleteInformation}
      updateInformation={this.props.updateInformation}
    />
  }
}
