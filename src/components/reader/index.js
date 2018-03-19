'use strict'

import './reader.css'
import React from 'react'
import Tappable from 'react-tappable/lib/Tappable'
import Data from 'components/data'
import Service from 'src/service'

export default class Reader extends React.Component {

  constructor({ match, history }) {
    super()
    // HTMLElement.prototype.show = function () {
    //   this.style.display = 'block'
    // }
    // HTMLElement.prototype.hide = function () {
    //   this.style.display = 'none'
    // }
    this.tappableProps = {
      component: 'div',
      moveThreshold: 30,
      onTap: (event) => {
        event.persist()
        switch (this.getOption(event.target)) {
          case 'prev':
            break;
          case 'next':
            break;
          case 'bigger':
            if (this.state.fontSize > 1.3) {
              return;
            }
            this.state.fontSize += .05;
            this.setState(this.state);
            Data.instance.setItem('fontsize', this.state.fontSize)
            break;
          case 'smaller':
            if (this.state.fontSize < 0.9) {
              return;
            }
            this.state.fontSize -= .05;
            this.setState(this.state);
            Data.instance.setItem('fontsize', this.state.fontSize)
            break;
          case 'actionmid':
            if (!this.state.isMenu) {
              this.state.class.topNav = []
              this.state.class.botNav = []
            } else {
              this.state.class.topNav = ['hide']
              this.state.class.botNav = ['hide']
              this.state.class.iconFont = []
              this.state.class.navPannel = ['hide']
            }
            this.state.isMenu = !this.state.isMenu
            this.setState(this.state)
            break;
          case 'fontbutton':
            if (this.state.class.navPannel.length) {
              this.state.class.iconFont = ['icon-font-current']
              this.state.class.navPannel = []
            } else {
              this.state.class.iconFont = []
              this.state.class.navPannel = ['hide']
            }
            this.setState(this.state);
            break;
          case 'back':
            history.goBack()
            break;
          case 'bgcolor':
            this.state.colorCfg.defaultColor = event.target.dataset.index
            this.setState(this.state);
            break;
          case 'dayNight':
            if (this.state.dayNight.text === '夜间') {
              this.state.dayNight.text = '白天'
              this.state.colorCfg.defaultColor = 5
              this.state.dayNight.class = ['icon-night-current']
            } else {
              this.state.dayNight.text = '夜间'
              this.state.colorCfg.defaultColor = 1
              this.state.dayNight.class = ['icon-night']
            }
            this.setState(this.state);
            break;
        }
      }
    }

    var fz = Data.instance.getItem('fontsize') * 1
    this.state = {
      class: {
        iconFont: [],
        uTab: ['hide'],
        navPannel: ['hide'],
        topNav: ['hide'],
        botNav: ['hide']
      },
      chapterData: null,
      colorCfg: {
        list: [
          '#f7eee5',
          '#e9dfc7',
          '#a4a4a4',
          '#cdefce',
          '#283548',
          '#0f1410'
        ],
        fontColor: [
          '#000',
          '#000',
          '#000',
          '#000',
          '#7685a2',
          '#4e534f',
        ],
        defaultColor: 1,
      },
      isMenu: false,
      fontSize: isNaN(fz) ? 1.1 : fz || 1.1,
      dayNight: {
        text: '夜间',
        class: ['icon-night']
      }
    }

    var chapterInfo = JSON.parse(Data.instance.getItem(match.params.bookId)).chapters[0]
    this.getChapterData(chapterInfo)
  }

  getChapterData(chapterInfo) {
    Service.instance.getContentByChapter(chapterInfo.link).then(data => {
      data.chapter.cpContent = data.chapter.cpContent.split(/\n/g)
      this.state.chapterData = data.chapter
      this.state.class.uTab = []
      this.setState(this.state)
    })
  }

  getOption(target) {
    if (target.dataset.hasOwnProperty('option')) {
      return target.dataset.option
    } else {
      return this.getOption(target.parentElement)
    }
  }

  mReadContent() {
    if (this.state.chapterData) {
      return <div style={{
        fontSize: this.state.fontSize + 'em',
        color: this.state.colorCfg.fontColor[this.state.colorCfg.defaultColor]
      }} className="m-read-content" dangerouslySetInnerHTML={{
        __html: this.state.chapterData.cpContent.map((item, i) => {
          if (i) {
            return `<p>${item.trim()}</p>`
          } else {
            return `<h4>${this.state.chapterData.title}</h4><p>${item.trim()}</p>`
          }
        }).join('')
      }}></div>
    } else {
      return null
    }
  }

  componentDidMount() {
    var readerModel;
    var readerUI;
    var bgColor
    var color
    // var fontSize = '5vw' // parseInt(Util.StorageGetter('font-size')) || '5vw';
    // var bgColor = Util.StorageGetter('bgColor');
    // var color = Util.StorageGetter('color');
    function main() {
      // document.body.style.backgroundColor = bgColor
      // this.Dom.read_content.style.fontSize = fontSize + 'px'
      // this.Dom.read_content.style.color = color

      // var className = 'color-box-current'
      // this.Dom.color_box.forEach(item => {
      //   var isContain = item.classList.contains(className)
      //   if (item.dataset.color == bgColor) {
      //     !isContain && item.classList.add(className)
      //   } else {
      //     isContain && item.classList.remove(className)
      //   }
      // })

      // className = 'icon-night-current'
      // if (bgColor == '#0f1410') {
      //   this.Dom.icon_night.classList.add(className)
      //   this.Dom.icon_night.nextSibling.innerText = '白天'
      // } else {
      //   this.Dom.icon_night.classList.remove(className);
      //   this.Dom.icon_night.nextSibling.innerText = '夜间';
      // }

      readerModel = ReaderModel();
      // readerModel.init().then(function (data) { });
      // EventHanlder();
    }
    function ReaderModel() {
      // 实现和阅读器相关的数据交互方法
      // var Chapter_id = Util.StorageGetter('Chapter_id');
      var Chapter_count;
      //初始化
      var init = function () {
        // getChapter(function () {
        //   getChapterContent(Chapter_id, function (data) {
        //     //todo 将数据渲染到UI
        //     UIcallback && UIcallback(data);
        //   });
        // });
        // return new Promise(function (resolve, reject) {
        //   getChapterPromise().then(function () {
        //     return getChapterContentPromise();
        //   }).then(function (data) {
        //     resolve(data);
        //   })
        // });
      };
      // var getChapter = function (callback) {
      //   $.get('data/chapter.json', function (data) {
      //     //todo 获取章节信息
      //     if (data.result == 0) {
      //       Chapter_id = Chapter_id || data.chapters[1].chapter_id;
      //       Chapter_count = data.chapters.length;
      //       callback && callback();
      //     }
      //   }, 'json');
      // };
      // var getChapterPromise = function () {
      //   // 获取章节信息
      //   return new Promise(function (resolve, reject) {
      //     $.get('data/chapter.json', function (data) {
      //       if (data.result == 0) {
      //         Chapter_id = Chapter_id || data.chapters[1].chapter_id;
      //         Chapter_count = data.chapters.length;
      //         resolve();
      //       } else {
      //         reject();
      //       }
      //     }, 'json');
      //   });
      // };
      // var getChapterContent = function (chapter_id, callback) {
      //   $.get('data/data' + chapter_id + '.json', function (data) {
      //     //todo 获取章节内容
      //     if (data.result == 0) {
      //       var url = data.jsonp;
      //       Util.getJSONP(url, function (data) {
      //         callback && callback(data);
      //       });
      //     }
      //   }, 'json');
      // };
      // var getChapterContentPromise = function () {
      //   //todo 获取章节内容
      //   return new Promise(function (resolve, reject) {
      //     $.get('data/data' + Chapter_id + '.json', function (data) {
      //       if (data.result == 0) {
      //         var url = data.jsonp;
      //         Util.getJSONP(url, function (data) {
      //           resolve(data);
      //         });
      //       } else {
      //         reject();
      //       }
      //     }, 'json');
      //   });
      // }
      // var prevChapter = function (UIcallback) {
      //   //todo 获取章节数据-》把数据进行渲染(上一章
      //   if (Chapter_id == 0) {
      //     return;
      //   }
      //   Chapter_id--;
      //   Util.StorageSetter('Chapter_id', Chapter_id);
      //   //                getChapterContent(Chapter_id, UIcallback);
      //   getChapterContentPromise().then(function (data) {
      //     UIcallback && UIcallback(data);
      //   })
      // };
      // var nextChapter = function (UIcallback) {
      //   //todo 获取章节数据-》把数据进行渲染(下一章
      //   if (Chapter_id == Chapter_count) {
      //     return;
      //   }
      //   Chapter_id++;
      //   Util.StorageSetter('Chapter_id', Chapter_id);
      //   //                getChapterContent(Chapter_id, UIcallback);
      //   getChapterContentPromise().then(function (data) {
      //     UIcallback && UIcallback(data);
      //   })
      // };
      return {
        init: init,
        // prevChapter: prevChapter,
        // nextChapter: nextChapter
      }
    }

    function EventHanlder() {
      // Dom.color_box.click(function () {
      //   bgColor = $(this).data('color');
      //   color = $(this).data('font')
      //   Util.StorageSetter('bgColor', bgColor);
      //   Util.StorageSetter('color', color);
      //   $(this).addClass('color-box-current').siblings().removeClass('color-box-current');
      //   $('body').css('background-color', bgColor);
      //   if (color) {
      //     Dom.read_content.css('color', color);
      //   } else {
      //     Dom.read_content.css('color', '#000');
      //   }
      //   if ($(this).attr('id') == 'font_night') {
      //     $('.icon-night').addClass('icon-night-current');
      //     $('.icon-night').next().html('白天');
      //   } else {
      //     $('.icon-night').removeClass('icon-night-current');
      //     $('.icon-night').next().html('夜间');
      //   }
      // });
      // $('#prev_chapter').click(function () {
      //   readerModel.prevChapter(function (data) {
      //     readerUI(data);
      //   });
      // });
      // $('#next_chapter').click(function () {
      //   readerModel.nextChapter(function (data) {
      //     readerUI(data);
      //   });
      // });
    }
    main.call(this);
    document.onscroll = () => {

      // if (this.Dom.top_nav.style.display != 'none') {
      //   this.Dom.top_nav.hide();
      //   this.Dom.bottom_nav.hide();
      //   this.Dom.icon_font.classList.remove('icon-font-current');
      //   this.Dom.nav_pannel.hide();
      // }
    }
  }

  // componentDidUpdate(prevProps, prevState) { }

  render() {
    return <div style={{ background: this.state.colorCfg.list[this.state.colorCfg.defaultColor] }}>
      {/* 顶部导航栏 */}
      <div className={N(['top-nav'].concat(this.state.class.topNav))}>
        <div className="top-nav-box">
          <Tappable className="icon-back" data-option="back" {...this.tappableProps} />
          <div className="nav-title">返回书架</div>
        </div>
      </div>
      {/* 顶部导航栏 */}
      {/* 文本内容 */}
      {this.mReadContent()}
      {/* 文本内容 */}
      {/* 章节切换 */}
      <ul className={N(['u-tab'].concat(this.state.class.uTab))}>
        <Tappable data-option="prev" {...this.tappableProps}>上一章</Tappable>
        <Tappable data-option="next" {...this.tappableProps}>下一章</Tappable>
      </ul>
      {/* 章节切换 */}
      <div className={N(['nav-pannel-bg', 'nav_pannel'].concat(this.state.class.navPannel))}></div>
      <div className={N(['nav-pannel', 'nav_pannel'].concat(this.state.class.navPannel))}>
        <div className="nav-pannel-item">
          <div className="item">字号</div>
          <Tappable className="item" data-option="bigger" {...this.tappableProps}>大</Tappable>
          <Tappable className="item" data-option="smaller" {...this.tappableProps}>小</Tappable>
        </div>
        <div className="nav-pannel-item">
          <div className="item">背景</div>
          {this.state.colorCfg.list.map((item, i) => {
            var className = i == this.state.colorCfg.defaultColor ? 'color-box color-box-current' : 'color-box'
            return <div className={className} data-color={item} key={item}>
              <Tappable data-option="bgcolor" data-index={i} className="color" {...this.tappableProps} style={{ background: item }}></Tappable>
            </div>
          })}
        </div>
      </div>
      <div className={N(['bottom-nav'].concat(this.state.class.botNav))}>
        <div className="bottom-nav-box">
          <div className="bottom-nav-item" id="menu_button">
            <div className="icon icon-menu"></div>
            <div className="icon-text">目录</div>
          </div>
          <Tappable className="bottom-nav-item" id="font_button" data-option="fontbutton" {...this.tappableProps}>
            <div className={N(['icon', 'icon-font'].concat(this.state.class.iconFont))}></div>
            <div className="icon-text">字体</div>
          </Tappable>
          <Tappable data-option="dayNight" className="bottom-nav-item" {...this.tappableProps}>
            <div className={N(['icon'].concat(this.state.dayNight.class))}></div>
            <div className="icon-text">{this.state.dayNight.text}</div>
          </Tappable>
        </div>
      </div>
      <Tappable className="action-mid" data-option="actionmid" {...this.tappableProps}></Tappable>
    </div>;
  }
}
