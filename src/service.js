import { md5 } from 'md5js'

export default class Service {

  static ins = null
  constructor() {
    Service.ins = this
    window.Service = this
  }
  static get instance() {
    return this.ins || new Service
  }

  token = null
  _token = null

  modules = {
    Collection: {}
  }
  apiUrl = 'http://api.zhuishushenqi.com'
  staticUrl = 'http://statics.zhuishushenqi.com'
  contetnUrl = 'http://chapterup.zhuishushenqi.com/chapter/'
  serverUrl = 'http://www.pbani.com/tao/?r=tao/book&authorization='


  authUrl = 'http://www.pbani.com/tao/?r=tao/auth&'

  // serverUrl = 'http://localhost:3001/?url='

  queryStringfy(obj) {
    var h = ''
    var f = false
    for (var name in obj) {
      if (!f) {
        f = true
        h += `${name}=${obj[name]}`
      } else {
        h += `&${name}=${obj[name]}`
      }
    }
    return h
  }



  request(url, noLoader) {
    var loader = this.modules.Loader
    if (!noLoader) {
      loader.setState({
        isShow: true
      })
    }

    return Promise.race([
      new Promise((resolve, reject) => {
        fetch(this.serverUrl + this._token + '&url=' + url)
          .then(response => {
            response.text().then(json => {
              json = JSON.parse(json)
              resolve(json)
              loader.setState({
                isShow: false
              })
            })
          }).catch(ex => {
            reject(ex)
            loader.setState({
              isShow: false
            })
          })
      }),
      new Promise((resolve, reject) => {
        var timeout = 3000
        setTimeout(() => {
          reject('timeout')
          loader.setState({
            isShow: false
          })
        }, timeout)
      })
    ])
  }

  setToken(token) {
    this.token = token
  }

  getToken(deviceId, time) {
    window.DeviceId = deviceId
    var str = this.queryStringfy({
      deviceId: deviceId,
      time: time,
      sign: md5('tao' + time, 32),
    })
    return new Promise((resolve, reject) => {
      fetch(this.authUrl + str)
        .then(response => {
          response.text().then(json => {
            json = JSON.parse(json)
            resolve(json)
          })
        }).catch(ex => {
          reject(ex)
        })
    })


  }

  getCollectionList() {
    return this.request(
      encodeURIComponent(this.apiUrl + '/myBook?action=get')
    )
  }

  setCollection(subscribe, book_id) {
    return this.request(
      encodeURIComponent(this.apiUrl + `/myBook?action=set&subscribe=${subscribe}&book_id=${book_id}`),
      true
    )
  }


  /**
   * 获取所有分类
   */
  getCategory() {
    var url = encodeURIComponent(this.apiUrl + '/cats/lv2/statistics')
    return this.request(url)
  }

  /**
   * 根据分类获取小说列表
   */
  getListByCategory({
    gender,
    major
  }, start, noLoader) {
    // gender: 男生:mael 女生:female 出版:press
    // type: 热门:hot 新书:new 好评:repulation 完结: over 包月: month
    // major: 大类别 从接口1获取
    // minor: 小类别 从接口4获取 (非必填)
    // start: 分页开始页
    // limit: 分页条数
    var url = encodeURIComponent(
      this.apiUrl + '/book/by-categories?' + this.queryStringfy({
        gender: gender,
        type: 'hot',
        major: major,
        minor: '',
        start: start,
        limit: '20'
      })
    )
    return this.request(url, noLoader)
  }

  /**
   * 获取小说信息
   */
  getBookInfo(bookId) {
    var url = encodeURIComponent(this.apiUrl + '/book/' + bookId)
    return this.request(url)
  }

  /**
   * 获取小说正版源
   */
  getBookYuan(bookId) {
    var url = encodeURIComponent(this.apiUrl + '/btoc?view=summary&book=' + bookId)
    return this.request(url)
  }

  /**
   * 获取小说章节(根据小说源id)
   */
  getBookChapter(bookId) {
    var url = encodeURIComponent(this.apiUrl + '/atoc/' + bookId + '?view=chapters')
    return this.request(url)
  }

  /**
   * 获取章节内容
   */
  getContentByChapter(chapterLink) {
    var url = encodeURIComponent(this.contetnUrl + chapterLink)
    return this.request(url)
  }

}
