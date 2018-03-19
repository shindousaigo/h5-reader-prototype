
// import './table.css'
// !style-loader!css-loader?modules!
import style from '!style-loader!css-loader?modules!./table.css'
import React from 'react'
import Service from 'src/service'
import Tappable from 'react-tappable/lib/Tappable'
import Data from 'components/data'


export default class Table extends React.Component {
  constructor(props) {
    super()

    this.state = {
      list: [],
      myList: [],
      class: {
        desk: [style.on],
        tableList: []
      },
      myBooks: null
    }

    setTimeout(() => {
      this.state.myBooks = [
        '5a77b07ade809329a670c934',
        '5a97c96ac85c0e3bef1435bc'
      ]
      this.setState(this.state)
    }, 750);


    this.tappableProps = {
      component: 'div',
      onTap: (event) => {
        event.persist()
        switch (this.getOption(event.target)) {
          case 'desk':
            this.state.class.desk = [style.on]
            this.state.class.tableList = []
            this.setState(this.state)
            break;
          case 'list':
            this.state.class.desk = []
            this.state.class.tableList = [style.on]
            this.setState(this.state)
            break;
          case 'see':
            Data.instance.getBook(
              this.getOptionData(event.target)
            ).then(bookInfo => {
              var link = bookInfo.chapters[0].link
              Service.instance.getContentByChapter(link).then(data => {
                console.log('getContentByChapter', data)
                this.props.history.push('/reader/' + bookInfo.bookId)
              })
            })
            break;
        }


      }
    }

    Service.instance.getListByCategory().then(data => {
      console.log('getListByCategory', data.books)
      this.state.list = data.books
      data.books.forEach(item => {
        if (item._id === '5a77b07ade809329a670c934' || item._id === '5a97c96ac85c0e3bef1435bc') {
          this.state.myList.push(item)
        }
      })
      this.setState(this.state)
    })

  }

  getDomHeader() {
    return <div className={style.header}>
      <div className={style.user}></div>
      <Tappable className={style.switch} {...this.tappableProps}>
        <div data-option="desk" className={N([style.switchItem].concat(this.state.class.desk))}>
          书架
        </div>
        <div data-option="list" className={N([style.switchItem].concat(this.state.class.tableList))}>
          列表
        </div>
      </Tappable>
      <div className={style.search}></div>
    </div>
  }

  getDomTable() {
    var list
    if (this.state.class.desk.length) {
      list = this.state.myList

    } else {
      list = this.state.list
    }
    if (list.length) {
      return list.map((item, index) => {
        return <Tappable data-option="see" {...this.tappableProps} className={style.list} data-title={item.title} data-id={item._id} key={item._id}>
          <img className={style.cover} src={Service.instance.staticUrl + item.cover} />
          <div className={style.nr}>
            <div className={style.title}>{item.title}</div>
            <div className={style.author}>作者：{item.author}</div>
            <div data-index={index} className={style.shortIntro}>{this.limitCheck(item.shortIntro)}</div>
          </div>
        </Tappable>
      })
    }

  }

  limitCheck(text) {
    if (text.length > 100) {
      return text.substring(0, 100) + '...'
    } else {
      return text
    }
  }

  getOptionData(target) {
    if (target.dataset.hasOwnProperty('id')) {
      return {
        id: target.dataset.id,
        title: target.dataset.title
      }
    } else {
      return this.getOptionData(target.parentElement)
    }
  }

  getOption(target) {
    if (target.dataset.hasOwnProperty('option')) {
      return target.dataset.option
    } else {
      return this.getOption(target.parentElement)
    }
  }

  render() {
    return <div className={style.wrap} >
      {this.getDomHeader()}
      {this.getDomTable()}
    </div>
  }
}