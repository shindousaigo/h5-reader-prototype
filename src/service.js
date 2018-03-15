
import queryString from 'query-string'

export default class Service {

  static ins = null
  constructor() {
    Service.ins = this
  }
  static get instance() {
    return this.ins || new Service
  }


  apiUrl = 'http://api.zhuishushenqi.com'
  staticUrl = 'http://statics.zhuishushenqi.com'
  contetnUrl = 'http://chapterup.zhuishushenqi.com/chapter/'




  request(url, debug = false) {
    return new Promise((resolve, reject) => {
      fetch("//localhost:3001/?url=" + url)
        .then(response => {
          response.json().then(json => {
            json = JSON.parse(json)
            resolve(json)
          })
        }).catch(ex => {
          console.log(ex)
        })
    })
  }

  /**
   * 获取所有分类
   */
  getCategory() {
    var url = encodeURIComponent(this.apiUrl + '/cats/lv2/statistics')
    this.request().then(json => {
      console.log('获取所有分类', json)
    })
  }

  /**
   * 根据分类获取小说列表
   */
  getListByCategory() {
    // gender: 男生:mael 女生:female 出版:press
    // type: 热门:hot 新书:new 好评:repulation 完结: over 包月: month
    // major: 大类别 从接口1获取
    // minor: 小类别 从接口4获取 (非必填)
    // start: 分页开始页
    // limit: 分页条数
    var url = encodeURIComponent(
      this.apiUrl + '/book/by-categories?' + queryString.stringify({
        gender: 'male',
        type: 'hot',
        major: '游戏',
        minor: '',
        start: 0,
        limit: 20
      })
    )
    return this.request(url)
  }

  /**
   * 获取小说信息
   */
  getBookInfo(bookId) {
    var url = encodeURIComponent(this.apiUrl + '/book/' + bookId)
    this.request(url).then(json => {
      console.log('获取小说信息', json)
    })
  }

  /**
   * 获取小说正版源
   */
  getBookYuan(bookId) {
    var url = encodeURIComponent(this.apiUrl + '/btoc?view=summary&book=' + bookId)
    this.request(url).then(json => {
      console.log('获取小说正版源', json)

      var bookId = json[0]._id
      this.getBookChapter(bookId)
    })
  }

  /**
   * 获取小说章节(根据小说源id)
   */
  getBookChapter(bookId) {
    var url = encodeURIComponent(this.apiUrl + '/atoc/' + bookId + '?view=chapters')
    this.request(url).then(json => {
      console.log('获取小说章节', json)

      this.getContentByChapter(json.chapters[0].link)
    })
  }

  /**
   * 获取章节内容
   */
  getContentByChapter(chapterLink) {
    var url = encodeURIComponent(this.contetnUrl + chapterLink)
    this.request(url).then(json => {
      console.log('获取章节内容', json)
    })
  }

} 