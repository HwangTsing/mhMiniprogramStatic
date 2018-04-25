const {
    baseUrl,
} = require('../config/index.js')



class wxApi {

  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }

  getPaths(url = '') {
    if (!/^(http[s]?:)/.test(url)) {
      return baseUrl + url;
    }
    return url;
  }

  ajax(url, cfg = {data:{}}) {
    const {
      data,
      header,
      method,
      dataType,
      complete,
      responseType,
    } = cfg;

    const promise = new Promise((resolve, reject) => {

        wx.request({
            url: this.getPaths(url),
            data,
            header,
            method,
            dataType,
            responseType,
            success({ data, statusCode, header }) {
                resolve(data, statusCode, header)
            },
            fail({ data, statusCode, header }) {
                resolve(data, statusCode, header)
            },
            complete,
        });
    })

    return promise;

  }

  post(url, cfg = {method: 'POST'}) {
    return this.ajax(url, cfg)
  }

  get(url, cfg = {method: 'GET' }) {
    return this.ajax(url, cfg);
  }

  request(url, cfg = {method: 'GET'}) {
    return wx.request({
      url: this.getPaths(url),
      ...cfg,
    });
  }

  systemInfo() {
    var systemInfo = {};
    try {
      systemInfo = wx.getSystemInfoSync()
    } catch (e) {}

    return systemInfo
  }
  
  post(url, cfg = { method: 'POST' }) {
    return ajax(url, cfg)
  }
  
  /*以下是调用接口方法*/
  //推荐页
  recommendList(cfg){
    return this.request('wbcomic/home/page_recommend_list?',cfg)
  }


}

const __wxApi = new wxApi()
const {globalData} = getApp()

if (!globalData.wxApi) {
  globalData.wxApi = __wxApi
} 

module.exports = globalData.wxApi