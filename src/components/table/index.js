
import style from '!style-loader!css-loader?modules!./table.css'
import React from 'react'
import Service from 'src/service'
import Tappable from 'react-tappable/lib/Tappable'
import Data from 'components/data'


export default class Table extends React.Component {
  constructor(props) {
    super()

    if (!window.curView) window.curView = 'categories'

    this.state = {
      list: [],
      myList: [],
      class: {
        desk: [],
        categories: []
      },
      categories: {
        default: 6,
        list: []
      },
      cateHeight: 0,
      deskHeight: 0,
      translateX: window.curView === 'categories' ? -100 : 0,
    }

    this.state.class[window.curView] = [style.on]

    this.tappableProps = {
      component: 'div',
      moveThreshold: 30,
      onTap: (event) => {
        event.persist()
        switch (this.getOption(event.target)) {
          case 'desk':
            this.state.class.desk = [style.on]
            this.state.class.categories = []
            this.state.translateX = 0
            window.curView = 'desk'
            this.setState(this.state)
            break;
          case 'list':
            break;
          case 'categories':
            this.state.class.desk = []
            this.state.class.categories = [style.on]
            this.state.translateX = -100
            window.curView = 'categories'
            this.setState(this.state)
            break;
          case 'categoriesItem':
            this.state.categories.default = event.target.dataset.index * 1
            this.searchCate(this.state.categories.default)
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

    Service.instance.getCategory().then(data => {
      console.log('getCategory', data)
      var map = ['female', 'male', 'picture', 'press']
      this.state.categories.list = []
      var i = 0
      map.forEach(gender => {
        data[gender].forEach(item => {
          var major = item.name
          i++
          if (i > 7) return
          this.state.list.push([])
          this.state.categories.list.push({
            gender,
            major
          })
        })
      })

      this.setState(this.state)
      this.searchCate(this.state.categories.default)
    })
  }

  searchCate(i) {
    Service.instance.getListByCategory(this.state.categories.list[i]).then(data => {
      this.state.list[i] = data.books
      data.books.forEach((item, i) => {
        // if (item._id === '594d25e36d4c9a9059341a4a' || item._id === '586f52b9c976277422698271') {
        i < 5 && this.state.myList.push(item)
        // }
      })
      this.setState(this.state)
      setTimeout(() => {
        this.state.deskHeight = this.refs.myDeskList.clientHeight
        this.state.cateHeight = this.refs.myCateList.clientHeight
        this.setState(this.state)
      })
    })
  }

  getDomHeader() {
    return <div className={style.header}>
      <div className={style.user}></div>
      <Tappable className={style.switch} {...this.tappableProps}>
        <div data-option="desk" className={N([style.switchItem].concat(this.state.class.desk))}>
          书架
        </div>
        <div data-option="categories" className={N([style.switchItem].concat(this.state.class.categories))}>
          分类
        </div>
      </Tappable>
      <div className={style.search}></div>
    </div>
  }

  getTableBodyHeight() {
    switch (window.curView) {
      case 'desk':
        return {
          height: this.state.deskHeight + 'px'
        }
        break;
      default:
        return {
          height: this.state.cateHeight + 'px'
        }
        break;
    }
  }

  getDomTable() {
    return <div className={style.tableBody} style={this.getTableBodyHeight()}>
      <div className={style.scroll} style={{transform: `translateX(${this.state.translateX}vw)`}}>
        <div className={style.myItem} style={{ height: this.state.deskHeight + 'px' }}>
          <div className={style.myDesk} ref="myDeskList">
            {this.getMyDeskDom()}
          </div>
        </div>
        <div className={N([style.myItem, style.myCate])} style={{ height: this.state.cateHeight + 'px' }}>
          {this.getCategoriesDom()}
        </div>
      </div>
      {this.getSide()}
    </div>
  }

  getMyDeskDom() {
    if (this.state.myList.length) {
      return this.state.myList.map((item, index) => {
        return <Tappable data-option="see" {...this.tappableProps} className={style.list} data-title={item.title} data-id={item._id} key={item._id}>
          <img className={style.cover} src={Service.instance.staticUrl + item.cover} />
          <div className={style.nr}>
            <div className={style.title}>{item.title}</div>
            <div className={style.author}>作者：{item.author}</div>
            <div data-index={index} className={style.shortIntro}>{this.limitCheck(item.shortIntro)}</div>
          </div>
        </Tappable>
      })
    } else {
      return <div></div>
    }
  }

  categoriesMainHandler(list) {
    if (list && list.length) {
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
    return ''
  }

  getCategoriesDom() {
    return <div className={style.container} ref="myCateList">
      <div className={style.main}>
        {this.categoriesMainHandler(this.state.list[this.state.categories.default])}
      </div>
    </div>
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

  getSide() {
    if (this.state.categories.list.length) {
      return <div className={style.side} style={{left: `${this.state.translateX + 100}vw`}}>
        {this.state.categories.list.map((k, i) => {
          return <Tappable key={i} data-option="categoriesItem" data-index={i} {...this.tappableProps} className={i === this.state.categories.default ? N([style.sideItem].concat([style.on])) : style.sideItem} >{k.major}</Tappable>
        })}
      </div>
    }
  }

  render() {
    return <div>
      {this.getDomHeader()}
      {this.getDomTable()}
    </div>
  }
}