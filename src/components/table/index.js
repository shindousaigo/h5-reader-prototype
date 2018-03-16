
// import './table.css'
import style from '!style-loader!css-loader?modules!./table.css'
import React from 'react'
import Service from 'src/service'
import Tappable from 'react-tappable/lib/Tappable'
import Data from 'components/data'


export default class Table extends React.Component {
  constructor(props) {
    super()

    this.state = {
      list: []
    }

    this.tableListProps = {
      component: 'div',
      onTap: (event) => {
        event.persist()
        var dom;
        if (event.target.dataset.hasOwnProperty('id')) {
          dom = event.target
        } else {
          dom = event.target.parentElement
        }
        Data.instance.getBook(dom).then(bookInfo => {
          var link = bookInfo.chapters[0].link
          Service.instance.getContentByChapter(link).then(data => {
            console.log('getContentByChapter', data)
            this.props.history.push('/reader/' + bookInfo.bookId)
          })
        })
      }
    }

    Service.instance.getListByCategory().then(data => {
      console.log('getListByCategory', data.books)
      this.state = {
        list: data.books
      }
      this.setState(this.state)
    })
  }

  table() {
    return this.state.list.map(item => {
      return <Tappable className={style.wrap} data-title={item.title} data-id={item._id} key={item._id} {...this.tableListProps}>
        <img className={style.cover} src={Service.instance.staticUrl + item.cover} />
        <div className={style.title}>{item.title}</div>
        <div className={style.author}>{item.author}</div>
        <div className={style.shortIntro}>{item.shortIntro}</div>
      </Tappable>
    })
  }

  render() {
    return <div>
      {this.table()}
    </div>
  }
}