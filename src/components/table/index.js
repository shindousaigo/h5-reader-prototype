
import './table.css'
// import style from '!style-loader!css-loader?modules!./table.css'
import React from 'react'
import Service from 'src/service'

export default class Table extends React.Component {
  constructor() {
    super()

    this.state = {
      list: []
    }

    Service.instance.getListByCategory().then(data => {
      console.log(data.books)
      this.state = {
        list: data.books
      }
      this.setState(this.state)
    })
  }

  table() {
    return this.state.list.map(item => {
      return <div className={'wrap'} key={item._id}>
        <img className={'cover'} src={Service.instance.staticUrl + item.cover} />
        <div className={'title'}>{item.title}</div>
        <div className={'author'}>{item.author}</div>
        <div className={'shortIntro'}>{item.shortIntro}</div>
      </div>
    })
  }

  render() {
    return <div>
      {this.table()}
    </div>
  }
}