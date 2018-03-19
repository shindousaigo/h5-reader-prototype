
import Service from 'src/service'

export default class Data {

  static ins;
  static get instance() {
    return this.ins || new Data
  }
  constructor() {
    Data.ins = this
  }

  prefix = "tF7ypSs!U1"

  getItem(key) {
    return localStorage.getItem(this.prefix + key);
  }

  setItem(key, val) {
    return localStorage.setItem(this.prefix + key, val);
  }

  hasItem(key) {
    return localStorage.hasOwnProperty(key)
  }

  getbook1(bookId) {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(this.getItem(bookId)))
    })
  }

  getbook2(bookId) {
    return Service.instance.getBookYuan(bookId)
  }

  getbook3(bookId) {
    return Service.instance.getBookChapter(bookId)
  }

  async getBook({ id, title }) {
    var bookId = id
    var bookName = title

    if (false && this.hasItem(bookId)) {
      await this.getbook1(bookId).then(bookInfo => {
        return bookInfo
      })
    } else {
      var bookName = bookName
      var bookId = bookId
      var yaunId
      var chaptersCount
      var lastChapter
      var chapters


      await this.getbook2(bookId).then(yuan => {
        yuan = yuan[0]
        console.log('getBookYuan', yuan)
        chaptersCount = yuan.chaptersCount
        lastChapter = yuan.lastChapter
        yaunId = yuan._id
      })

      await this.getbook3(yaunId).then(data => {
        console.log('getBookChapter', data.chapters)
        chapters = data.chapters


      })

      var bookInfo = {
        bookId,
        yaunId,
        bookName,
        chapters,
        chaptersCount,
        lastChapter
      }
      this.setBook(bookId, bookInfo)
      return bookInfo
    }

  }

  setBook(bookId, bookInfo) {
    bookInfo.storageTimestamp = new Date().getTime()
    bookInfo = JSON.stringify(bookInfo)
    this.setItem(bookId, bookInfo)
  }

}
