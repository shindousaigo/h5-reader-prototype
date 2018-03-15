'use strict'

import './reader.css'

import React from 'react'
import fetchJsonp from 'fetch-jsonp'
import Tappable from 'react-tappable/lib/Tappable'
import Util from './util'

export default class Reader extends React.Component {

  constructor() {
    super()
    HTMLElement.prototype.show = function () {
      this.style.display = 'block'
    }
    HTMLElement.prototype.hide = function () {
      this.style.display = 'none'
    }
    this.tappableProps = {
      component: 'div',
      moveThreshold: 30,
      onTap: (event) => {
        event.persist()
        switch (event.target.dataset.option) {
          case 'prev':
            break;
          case 'next':
            break;
          case 'bigger':
            if (fontSize >= 21) {
              return;
            }
            fontSize++;
            Util.StorageSetter('font-size', fontSize);
            this.Dom.read_content.style.fontSize = fontSize;
            break;
          case 'smaller':
            if (fontSize <= 14) {
              return;
            }
            fontSize--;
            Util.StorageSetter('font-size', fontSize);
            this.Dom.read_content.style.fontSize = fontSize;
            break;
          case 'actionmid':
            if (this.Dom.top_nav.style.display == 'none') {
              this.Dom.top_nav.show();
              this.Dom.bottom_nav.show();
            } else {
              this.Dom.top_nav.hide();
              this.Dom.bottom_nav.hide();
              this.Dom.icon_font.classList.remove('icon-font-current');
              this.Dom.nav_pannel.hide();
            }
            break;
          case 'fontbutton':
            if (this.Dom.nav_pannel.style.display == 'none') {
              Dom.icon_font.classList.add('icon-font-current')
              Dom.nav_pannel.show();
            } else {
              Dom.icon_font.classList.remove('icon-font-current')
              Dom.nav_pannel.hide();
            }
            break;
        }
      }
    }
    this.state = {
      toggle: {
        uTab: {
          display: 'none'
        }
      }

    }

    this.promise = new Promise((resolve, reject) => {
      fetch("http://127.0.0.1:3001/?url=" + encodeURIComponent('http://chapterup.zhuishushenqi.com/chapter/http://vip.zhuishushenqi.com/chapter/5817f1161bb2ca566b0a5973?cv=1481275033588'))
        .then((response) => {
          response.json().then(json => {
            json = JSON.parse(json)
            this.promise.chapter = json.chapter
            resolve()
          })
        }).catch((ex) => { });
    })
  }

  ReaderBaseFrame(chapter) {
    var tmp = chapter.cpContent.replace(/\n/g, '#$%')
    tmp = tmp.split('#$%')
    var html = '<h4>' + chapter.title + '</h4>';
    tmp.forEach(item => {
      html += '<p>' + item.trim() + '</p>'
    })
    this.Dom.read_content.innerHTML = html;
    this.state.toggle.uTab = null
    this.setState(this.state)
  }

  getChapter() {
    if (this.promise.chapter) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    } else {
      return this.promise
    }
  }

  getDomElements() {
    this.Dom = {
      read_content: document.querySelector('.m-read-content'),
      top_nav: document.querySelector('.top-nav'),
      bottom_nav: document.querySelector('.bottom-nav'),
      nav_pannel: document.querySelector('.nav_pannel'),
      icon_font: document.querySelector('.icon-font'),
      color_box: document.querySelectorAll('.color-box'),
      icon_night: document.querySelector('.icon-night'),
    }
  }

  async componentDidMount() {
    this.getDomElements()
    await this.getChapter();

    var readerModel;
    var readerUI;
    var fontSize = parseInt(Util.StorageGetter('font-size')) || '5vw';
    var bgColor = Util.StorageGetter('bgColor');
    var color = Util.StorageGetter('color');
    function main() {
      document.body.style.backgroundColor = bgColor
      this.Dom.read_content.style.fontSize = fontSize + 'px'
      this.Dom.read_content.style.color = color

      var className = 'color-box-current'
      this.Dom.color_box.forEach(item => {
        var isContain = item.classList.contains(className)
        if (item.dataset.color == bgColor) {
          !isContain && item.classList.add(className)
        } else {
          isContain && item.classList.remove(className)
        }
      })

      className = 'icon-night-current'
      if (bgColor == '#0f1410') {
        this.Dom.icon_night.classList.add(className)
        this.Dom.icon_night.nextSibling.innerText = '白天'
      } else {
        this.Dom.icon_night.classList.remove(className);
        this.Dom.icon_night.nextSibling.innerText = '夜间';
      }

      readerModel = ReaderModel();
      readerUI = this.ReaderBaseFrame(this.promise.chapter);
      // readerModel.init().then(function (data) { });
      // EventHanlder();
    }
    function ReaderModel() {
      // 实现和阅读器相关的数据交互方法
      var Chapter_id = Util.StorageGetter('Chapter_id');
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
      // $('#night_button').click(function () {
      //   if ($('.icon-night').next().html() == '夜间') {
      //     $('.icon-night').addClass('icon-night-current');
      //     $('.icon-night').next().html('白天');
      //     $('body').css('background-color', '#0f1410');
      //     Dom.read_content.css('color', '#4e534f');
      //     Util.StorageSetter('bgColor', '#0f1410');
      //     Util.StorageSetter('color', '#4e534f');
      //     $('#font_night').addClass('color-box-current').siblings().removeClass('color-box-current');
      //   } else {
      //     $('.icon-night').removeClass('icon-night-current');
      //     $('.icon-night').next().html('夜间');
      //     $('body').css('background-color', '#e9dfc7');
      //     Dom.read_content.css('color', '#000');
      //     Util.StorageSetter('bgColor', '#e9dfc7');
      //     Util.StorageSetter('color', '#000');
      //     $('#font_normal').addClass('color-box-current').siblings().removeClass('color-box-current');
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
      if (this.Dom.top_nav.style.display != 'none') {
        this.Dom.top_nav.hide();
        this.Dom.bottom_nav.hide();
        this.Dom.icon_font.classList.remove('icon-font-current');
        this.Dom.nav_pannel.hide();
      }
    }
  }

  render() {
    return <div>
      {/* 顶部导航栏 */}
      <div className="top-nav" style={{ display: 'none' }}>
        <div className="top-nav-box">
          <div className="icon-back"></div>
          <div className="nav-title">返回书架</div>
        </div>
      </div>
      {/* 顶部导航栏 */}
      {/* 文本内容 */}
      <div className="m-read-content"></div>
      {/* 文本内容 */}
      {/* 章节切换 */}
      <ul className="u-tab" style={this.state.toggle.uTab}>
        <Tappable data-option="prev" {...this.tappableProps}>上一章</Tappable>
        <Tappable data-option="next" {...this.tappableProps}>下一章</Tappable>
      </ul>
      {/* 章节切换 */}
      <div className="nav-pannel-bg nav_pannel" style={{ display: 'none' }}></div>
      <div className="nav-pannel nav_pannel" style={{ display: 'none' }}>
        <div className="nav-pannel-item">
          <span>字号</span>
          <Tappable data-option="bigger" {...this.tappableProps}>大</Tappable>
          <Tappable data-option="smaller" {...this.tappableProps}>小</Tappable>
        </div>
        <div className="nav-pannel-item">
          <span>背景</span>
          <div className="color-box" data-color="#f7eee5">
            <div className="color"></div>
          </div>
          <div className="color-box" id="font_normal" data-color="#e9dfc7">
            <div className="color"></div>
          </div>
          <div className="color-box" data-color="#a4a4a4">
            <div className="color"></div>
          </div>
          <div className="color-box" data-color="#cdefce">
            <div className="color"></div>
          </div>
          <div className="color-box" data-color="#283548" data-font="#7685a2">
            <div className="color"></div>
          </div>
          <div className="color-box" id="font_night" data-color="#0f1410" data-font="#4e534f">
            <div className="color"></div>
          </div>
        </div>
      </div>
      <div className="bottom-nav" style={{ display: 'none' }}>
        <div className="bottom-nav-box">
          <div className="bottom-nav-item" id="menu_button">
            <div className="icon icon-menu"></div>
            <div className="icon-text">目录</div>
          </div>
          <Tappable className="bottom-nav-item" id="font_button" data-option="fontbutton" {...this.tappableProps}>
            <div className="icon icon-font"></div>
            <div className="icon-text">字体</div>
          </Tappable>
          <div className="bottom-nav-item" id="night_button">
            <div className="icon icon-night"></div>
            <div className="icon-text">夜间</div>
          </div>
        </div>
      </div>
      <Tappable className="action-mid" data-option="actionmid" {...this.tappableProps}></Tappable>
    </div>;
  }
}
