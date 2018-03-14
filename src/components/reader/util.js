
const prefix = "tF7ypSs!U1";

var Util = (function () {
  var StorageGetter = function (key) {
    return localStorage.getItem(prefix + key);
  };
  var StorageSetter = function (key, val) {
    return localStorage.setItem(prefix + key, val);
  };
  var getJSONP = function (url, callback) {
    // return $.jsonp({
    //   url: url,
    //   cache: true,
    //   callback: 'duokan_fiction_chapter',
    //   success: function (result) {
    //     var data = $.base64.decode(result);
    //     var json = decodeURIComponent(escape(data));
    //     callback && callback(json);
    //   }
    // })
  };
  return {
    StorageGetter: StorageGetter,
    StorageSetter: StorageSetter,
    getJSONP: getJSONP
  }
})();

module.exports = Util