import './loader.css'
import React from 'react'
import Service from 'src/service'


export default class Loader extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isShow: false,
      loadCount: 0,
    }

    Service.instance.modules.Loader = this
  }

  render() {


    return <div className={
      N(['Loader-loading'].concat(this.state.isShow ? ['show'] : ['hide']))
    }>
      <div type="cover"></div>
      <div type="loading">
        <div className="loading">
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
    </div>


  }
}
