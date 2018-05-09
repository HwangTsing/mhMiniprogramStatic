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

  getSystemInfoSync() {
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
  recommendBoy(cfg){
    return this.request('wbcomic/home/page_recommend_list?mca=h5_recommend_male',cfg)
  }
  
  recommendGirl(cfg) {
    return this.get('wbcomic/home/page_recommend_list?mca=h5_recommend_female',cfg)
  }

  setNavigationBarTitle(title) {
    if (title) wx.setNavigationBarTitle({title})
  }

  appendParams(route, params={}) {
    if (!route) return ''
    let param = [];
    const join = route.indexOf('?') != -1 ? '&' : '?'
    for (let [key, value] of Object.entries(params)) {
      if (!!value) param.push(key + '=' + value);
    }
    return route + (param.length > 0 ? join + param.join('&') : '');
  }

  getParam(url='', name='') {
    var reg = new RegExp( name + '=([^=&]*)', 'i')
    var matchers = url.match(reg)
    return matchers && matchers[1] || ''
  }

  getCurrentPageParams() {
    const { options } = this.getCurrentPage()
    return options || {}
  }

  getApp() {
    return getApp()
  }

  getCurrentPage() {
    const pages = getCurrentPages()
    return pages.length > 0 ? pages[0] : {}
  }

  getCurrentRoute() {
    let { route } = this.getCurrentPage()
    route = route ? '/' + route : route
    
    return route
  }

  getCurrentPageUrl() {
    const route = this.getCurrentRoute()
    const options = this.getCurrentPageParams()
    const url = this.appendParams(route, options)

    return url
  }

  
}

const __wxApi = new wxApi()
const {globalData} = getApp()

if (!globalData.wxApi) {
  globalData.wxApi = __wxApi
} 

module.exports = globalData.wxApi