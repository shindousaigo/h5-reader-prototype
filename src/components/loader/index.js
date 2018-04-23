import './loader.css'
import React from 'react'
import Service from 'src/service'


export default class Loader extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isShow: false
    }

    Service.instance.modules['Loader'] = this
  }

  render() {
    return <div className={
      N(['Loader-loading'].concat(this.state.isShow ? ['show'] : ['hide']))
    }>

    </div>
  }
}
