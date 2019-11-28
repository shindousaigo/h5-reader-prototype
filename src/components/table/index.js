
import style from '!style-loader!css-loader?modules!sass-loader!./table.scss'
import React from 'react'
import Service from 'src/service'
import Tappable from 'react-tappable/lib/Tappable'
import Data from 'components/data'
import TWEEN from 'tween.js'
import { WSAEADDRINUSE } from 'constants';
import { Button } from 'element-react';

var animating = false
function animate(time) {
  if (animating) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
  }
}

export default class Table extends React.Component {
  constructor(props) {
    super()

    if (!window.curView) window.curView = 'desk'
    if (!window.defaultCate) window.defaultCate = 0

    this.state = {
      list: [],
      class: {
        desk: [],
        categories: [],
        icons: []
      },
      categories: {
        default: window.defaultCate,
        list: [],
        start: [],
        end: []
      },
      cateHeight: 0,
      deskHeight: 0,
      translateX: window.curView === 'categories' ? -100 : 0,
      collection: {}
    }

    window.Collection = this.state.collection

    this.state.class[window.curView] = [style.on]

    this.tappableProps = {
      component: 'div',
      moveThreshold: 30,
      onTap: (event) => {
        event.persist()
        var dataset = this.getDataset(event.target)
        switch (dataset.option) {
          case 'desk':
            if (!animating && window.curView !== 'desk') {
              animating = true

              requestAnimationFrame(animate);
              var x = { scroll1: -100, scroll2: 0 }
              new TWEEN.Tween(x)
                .to({ scroll1: 0, scroll2: 100 }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                  this.refs.scroll1.style.transform = `translateX(${x.scroll1}vw)`
                  this.refs.scroll2.style.left = `${x.scroll2}vw`
                })
                .onComplete(() => {
                  this.state.translateX = 0
                  this.state.cateDisplay = 'none'


                  this.state.deskHeight = this.refs.myDeskList.clientHeight

                  this.setState(this.state)
                  animating = false
                })
                .start();
              window.curView = 'desk'
              this.state.class.desk = [style.on]
              this.state.class.categories = []
              this.state.deskDisplay = 'block'
              this.state.cateDisplay = 'block'
              this.setState(this.state)
            }
            break;
          case 'categories':
            if (!animating && window.curView !== 'categories') {
              animating = true

              requestAnimationFrame(animate);
              var x = { scroll1: 0, scroll2: 100 }
              new TWEEN.Tween(x)
                .to({ scroll1: -100, scroll2: 0 }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                  this.refs.scroll1.style.transform = `translateX(${x.scroll1}vw)`
                  this.refs.scroll2.style.left = `${x.scroll2}vw`
                })
                .onComplete(() => {
                  this.state.translateX = -100
                  this.state.deskDisplay = 'none'
                  this.setState(this.state)
                  animating = false
                })
                .start();
              window.curView = 'categories'
              this.state.class.desk = []
              this.state.class.categories = [style.on]
              this.state.deskDisplay = 'block'
              this.state.cateDisplay = 'block'
              this.setState(this.state)
            }
            break;
          case 'categoriesItem':


            this.state.categories.default = event.target.dataset.index * 1


            this.searchCate(this.state.categories.default)

            break;
          case 'see':
            Data.instance.getBook(
              this.getOptionData(event.target)
            ).then(bookInfo => {
              Service.instance.modules.Reader = {
                chapters: bookInfo.chapters,
                curChapter: bookInfo.chapters[0]
              }
              window.defaultCate = this.state.categories.default
              this.props.history.push('/reader/' + bookInfo.bookId)
            })
            break;
          case 'star':

            if (!this.staring) {
              this.staring = true


              var index = dataset.index
              var item = this.state.list[this.state.categories.default][index]

              if (this.state.collection.hasOwnProperty(item._id)) {
                Service.instance.setCollection(0, item._id).then(data => {
                  if (data.err === 0) {
                    delete this.state.collection[item._id]
                  }
                  this.staring = false
                  this.setState(this.state)

                })
              } else {
                Service.instance.setCollection(1, item._id).then(data => {
                  if (data.err === 0) {
                    this.state.collection[item._id] = item
                  }
                  this.staring = false
                  this.setState(this.state)

                })
              }
            }
            console.log('staring')
            break;
          case 'cancelStar':
            if (!this.staring2) {
              this.staring2 = true
              var id = dataset.id
              Service.instance.setCollection(0, id).then(data => {
                if (data.err === 0) {
                  delete this.state.collection[id]
                }
                this.staring2 = false
                this.setState(this.state)
                setTimeout(() => {
                  this.state.deskHeight = this.refs.myDeskList.clientHeight
                  this.setState(this.state)
                })
              })
            }
            console.log('staring2')
            break;

        }
      }
    }

    Service.instance.getCategory().then(data => {
      console.log('getCategory', data)
      var map = ['female']
      this.state.list = []
      this.state.categories.list = []
      this.state.categories.start = []
      this.state.categories.end = []
      var i = 0
      map.forEach(gender => {
        data[gender].forEach(item => {
          var major = item.name
          i++
          if (i > 7) return

          this.state.categories.list.push({
            gender,
            major
          })
          this.state.list.push([])
          this.state.categories.start.push(0)
          this.state.categories.end.push(false)
        })
      })

      this.setState(this.state)
      this.searchCate(this.state.categories.default)
    })

    Service.instance.getCollectionList().then(data => {
      data.books.forEach(item => {
        this.state.collection[item._id] = item
      })
      this.setState(this.state)
    })

  }

  searchCate(i) {
    if (this.state.list[i].length === 0) {


      Service.instance.getListByCategory(this.state.categories.list[i], this.state.categories.start[i]).then(data => {
        console.log('getListByCategory', data)
        this.state.list[i] = data.books
        this.setState(this.state)
        setTimeout(() => {
          this.state.deskHeight = this.refs.myDeskList.clientHeight
          this.state.cateHeight = this.refs.myCateList.clientHeight
          if (window.curView === 'desk') {
            this.state.deskDisplay = 'block'
            this.state.cateDisplay = 'none'
          } else {
            this.state.deskDisplay = 'none'
            this.state.cateDisplay = 'block'
          }
          document.body.scrollTop = 0
          this.setState(this.state)
        })
      })


    } else {
      this.setState(this.state)
      setTimeout(() => {
        this.state.cateHeight = this.refs.myCateList.clientHeight

        document.body.scrollTop = 0
        this.setState(this.state)
      })
    }


  }



  getDomHeader() {
    return <div ref="header" className={style.header}>
      {/* <div className={style.user}></div> */}
      <Tappable className={style.switch} {...this.tappableProps}>
        <div data-option="desk" className={N([style.switchItem].concat(this.state.class.desk))}>
          书架
        </div>
        <div data-option="categories" className={N([style.switchItem].concat(this.state.class.categories))}>
          分类
        </div>
      </Tappable>
      {/* <div className={style.search}></div> */}
    </div>
  }

  getTableBodyHeight() {
    switch (window.curView) {
      case 'desk':
        return {
          height: !isNaN(this.state.deskHeight) ? this.state.deskHeight + 'px' : this.state.deskHeight
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
      <div ref="scroll1" className={style.scroll} style={{ transform: `translateX(${this.state.translateX}vw)` }}>
        <div className={style.myItem} style={{ display: this.state.deskDisplay }} ref="myDeskList">
          <div className={style.myDesk}>
            {this.getMyDeskDom()}
          </div>
        </div>
        <div className={N([style.myItem, style.myCate])} style={{ display: this.state.cateDisplay }}>
          {this.getCategoriesDom()}
        </div>
      </div>
      {this.getSide()}
    </div >
  }

  getMyDeskDom() {
    var list = Object.keys(this.state.collection)
    if (list.length) {
      return list.map((name, index) => {
        var item = this.state.collection[name]
        return <Tappable data-option="see" {...this.tappableProps} className={style.list} data-title={item.title} data-id={item._id} key={item._id + '_desk'}>
          <img className={style.cover} src={item.cover_me} />
          <div className={style.nr}>
            <div className={style.title}>{item.title}</div>
            <div className={style.author}>作者：{item.author}</div>
            <div data-index={index} className={style.shortIntro}>{this.limitCheck(item.shortIntro)}</div>
          </div>
          <Tappable data-id={item._id} className={N([style.cancelStar].concat([style.icon]))} data-option="cancelStar" {...this.tappableProps}>
            <i className="el-icon-star-on"></i>
          </Tappable>
        </Tappable>
      })
    } else {
      return <div className={style.kong}>
        <div className={style.kongImg}></div>
        <div>当前无收藏图书~</div>
      </div>
    }
  }

  componentDidUpdate() {
    if (window.curView !== "desk") {
      window.addEventListener('scroll', this.onScrolling.bind(this))
    }

  }

  componentDidMount() {
    this.offset = window.innerHeight - this.refs.header.clientHeight
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrolling)
  }


  onScrolling() {

    var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
    if (this.state.cateHeight - (scrollTop + this.offset) < 50) {
      if (!this.isSearching) {
        this.isSearching = true
        var i = this.state.categories.default

        var end = this.state.categories.end[i]
        if (!end) {
          this.state.categories.start[i] += 20

          Service.instance.getListByCategory(this.state.categories.list[i], this.state.categories.start[i], true).then(data => {
            console.log('getListByCategory', data)
            if (data.books.length) {
              this.state.list[i] = this.state.list[i].concat(data.books)
              this.setState(this.state)
              setTimeout(() => {
                this.state.cateHeight = this.refs.myCateList.clientHeight
                this.setState(this.state)
                this.isSearching = false
              })
            } else {
              this.state.categories.end[i] = true
            }
          })
        } else {
          this.isSearching = false
        }

      }

    }
  }

  categoriesMainHandler(list) {
    if (list && list.length) {
      return list.map((item, index) => {
        var id = item._id
        return <Tappable data-option="see" {...this.tappableProps} className={style.list} data-title={item.title} data-id={item._id} key={item._id + '_cate'}>
          <img className={style.cover} src={item.cover_me} />
          <div className={style.nr}>
            <div className={style.title}>{item.title}</div>
            <div className={style.author}>作者：{item.author}</div>
            <div data-index={index} className={style.shortIntro}>{this.limitCheck(item.shortIntro)}</div>
          </div>
          <Tappable data-option="star" data-index={index} className={N(this.state.collection.hasOwnProperty(id) ? ['el-icon-star-on'].concat([style.icon]) : ['el-icon-star-off'].concat([style.icon]))} {...this.tappableProps}></Tappable>
        </Tappable>
      })
    }
    return ''
  }

  getCategoriesDom() {
    return <div className={style.container} ref="myCateList">
      <div className={style.main} ref="myCateList2">
        {this.categoriesMainHandler(this.state.list[this.state.categories.default])}
      </div>
    </div>
  }

  limitCheck(text) {
    if (text.length > 50) {
      return text.substring(0, 50) + '...'
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

  getDataset(target) {
    if (!target) return null
    if (target.dataset.hasOwnProperty('option')) {
      return target.dataset
    } else {
      return this.getDataset(target.parentElement)
    }
  }

  getSide() {
    if (this.state.categories.list.length) {
      return <div ref="scroll2" className={style.side} style={{ left: `${this.state.translateX + 100}vw` }}>
        {this.state.categories.list.map((k, i) => {
          return <Tappable key={i + '_side'} data-option="categoriesItem" data-index={i} {...this.tappableProps} className={i === this.state.categories.default ? N([style.sideItem].concat([style.on])) : style.sideItem} >{k.major}</Tappable>
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