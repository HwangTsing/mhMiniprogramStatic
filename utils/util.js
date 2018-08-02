const {
    baseUrl,
    isDev,
    version
} = require('../config/index.js')


class wxApi {

    formatTime(date, obj) {
        /*
        * obj.type:存在返回 年月日不补0  默认不补0
        * obj.y :年 是否截取 默认不截取
        * obj.h : 是否保留小时分 默认不保存
        * obj.s : 是否保留秒 默认不保存
        * */
        date = Number(date) * 1000;
        date = new Date(date);
        let year = date.getFullYear();
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()

        if (!obj) {
            return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
        } else {
            let m = month < 10 ? "0" + month : month;
            let d = day < 10 ? "0" + day : day;
            let h = hour < 10 ? "0" + hour : hour;
            let mi = minute < 10 ? "0" + minute : minute;
            let s = second < 10 ? "0" + second : second;

            year = obj.y ? year.toString ().substr ( 2 , 2 ) : year;

            if (obj.type){
                let S=obj.S? ":" + s:'';
                if(obj.h){
                    return year + "-" + m + "-" + d + " " + h + ":" + mi +  S ;
                }else {
                    return year + "-" + m + "-" + d;
                }

            }else {
                let S=obj.S?":" +second:'';
                if(obj.h){
                    return year + "-" + month + "-" + day + " " + h + ":" + mi + S;
                }else {
                    return year + "-" + month + "-" + day;
                }
            }
        }

    }

    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }

    getVersion () {
        return version
    }

    getPaths(url = '') {
        if (!/^(http[s]?:)/.test(url)) {
            const path = !isDev ? 'wap' : ''
            return baseUrl + path + url;
        }
        return url;
    }

    ajax(url, cfg = {data: {}}) {
        const {
            data,
            header = {
                'content-type': 'application/json'
            },
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
                success({data, statusCode, header}) {
                    resolve(data, statusCode, header)
                },
                fail({data, statusCode, header}) {
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

    get(url, cfg = {method: 'GET'}) {
        return this.ajax(url, cfg);
    }

    request(url, cfg = { method: 'GET', header: { 'content-type': 'application/json' }}) {
        return wx.request({
            url: this.getPaths(url),
            ...cfg,
        });
    }

    getSystemInfoSync() {
        var systemInfo = {};
        try {
            systemInfo = wx.getSystemInfoSync()
        } catch (e) {
        }

        return systemInfo
    }
    getNetworkType(){
        /*
        * ***getNetworkType
        * 返回 promise 对象
        * */
        //获取网络状态
        const promise = new Promise((resolve, reject) => {
            wx.getNetworkType({
                success(res){ //成功
                  resolve(res)
                },
                fail(err){ //失败
                  reject(err)
                }
            })
        });

        return promise
    }

    setStorage(key,value){
        /*
       * *** setStorage
       * @将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
       * **@ key 必须为字符串类型
       * **@ value必须为(字符串|对象)类型
       * 返回 promise 对象
       * */
        const promise = new Promise((resolve, reject) => {
            var keyType=typeof key;
            var valueType=typeof value;
            if(keyType!=='string'){ //key
                reject({message:'key is not a string'});
                return
            }

            if(valueType!=='string' && valueType!=='object'){//value
                reject({message:'value is not a string or an object'});
                return
            }

            wx.setStorage({ //将数据存储在本地
                key:key,
                data:value,
                success(res){ //成功
                    resolve(res)
                },
                fail(err){ //失败
                    reject(err)
                }
            })
        });

        return promise
    }
    getShowToast (title) {
        const promise = new Promise((resolve,reject) => {
            var titleType = typeof title;
            if(titleType!=='string'){
                reject({message:'title is not a string'});
                return
            }
            wx.showToast({
                title:title,
                icon:'none',
                duration:3000,
                mask:true,
                success(res) { //成功
                    resolve(res)
                },
                fail(err) { //失败
                    reject(err)
                }
            })
        });
        return promise;
    }

    getStorage(key){
        /*
        * *** getStorage 从本地缓存中异步获取指定 key 对应的内容。
        * **@ key 必须为字符串类型
        * 返回 promise 对象
        * */
        const promise = new Promise((resolve, reject) => {
            var keyType=typeof key;
            if(keyType!=='string'){ //key
                reject({message:'key is not a string'});
                return
            }
            wx.getStorage({ //从本地缓存中异步获取指定 key 对应的内容。
                key: key,
                success (res) {//成功
                    resolve(res)
                },
                fail(err){ //失败
                    reject(err)
                }
            })
        })

        return promise
    }

    getPageUrl(){
        /* 获取当前页带参数的url */
        var pages = getCurrentPages()    //获取加载的页面
        var currentPage = pages[pages.length-1]    //获取当前页面的对象
        var url = currentPage.route    //当前页面url
        var options = currentPage.options    //如果要获取url中所带的参数可以查看options
        var urlWithArgs = url
        if(JSON.stringify ( options ) !== "{}" ){
            //拼接url的参数
            urlWithArgs = urlWithArgs+ '?';
            for(var key in options){
                var value = options[key]
                urlWithArgs += key + '=' + value + '&'
            }
            urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)
        }
        return urlWithArgs
    }

    post(url, cfg = {method: 'POST'}) {
        return ajax(url, cfg)
    }

    /*以下是调用接口方法*/

    //推荐页
    recommendList(cfg) {
        return this.request('wbcomic/home/page_recommend_list?', cfg)
    }

    //搜索内容接口
    searchList(cfg) {
        return this.request('wbcomic/home/search?', cfg)
    }

    //查看更多接口
    moreList(cfg) {
        return this.request('wbcomic/home/recommend_list?', cfg)
    }
    //搜索热门推荐接口
    popRecList(cfg) {
        return this.request('wbcomic/home/hot_words?', cfg)
    }
    //分类标签接口
    classLabelList(cfg) {
        return this.request('wbcomic/comic/filter_list?',cfg)
    }
    //分类列表
    classList(cfg) {
        return this.request('wbcomic/comic/filter_result?',cfg)
    }
    //阅读榜
    readList(cfg) {
        return this.request('wbcomic/home/rank_read?',cfg);
    }
    //新作榜
    newList(cfg) {
        return this.request('wbcomic/home/rank_share?',cfg);
    }
    //综合榜
    rankList(cfg) {
        return this.request('wbcomic/home/rank?',cfg);
    }



  setNavigationBarTitle(title) {
    if (title) {
      title = decodeURIComponent(title)
      wx.setNavigationBarTitle({title})
    }
  }

  appendParams(route, params={}) {
    if (!route) return ''
    let param = [];
    const join = route.indexOf('?') != -1 ? '&' : '?'
    // console.log('params', params)
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        let value = params[key]
        if (!!value) param.push(key + '=' + encodeURIComponent(value))
      }
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
    return pages.length > 0 ? pages[pages.length-1] : {}
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

  pageScrollTo(options) {
    wx.pageScrollTo(options);
  }


  setMessageType(page, type) {
    if (page && page.setData) page.setData({type})
  }

  onNetworkStatusChange(callback) {
    if (typeof callback == 'function') {
      wx.onNetworkStatusChange(callback)
    }
  }

  /* 获取节点(元素信息) WXML节点信息*/
  getNodeInfo(node=null){
    const promise = new Promise((resolve, reject) => {
        if(!node||typeof node!="string"){
            reject('请传递(id或者class)节点信息')
            console.error('请传递(id或者class)节点信息')
            return;
        }
        const query = wx.createSelectorQuery()
        query.select(node).boundingClientRect(
            (res)=>{
                resolve(res)
            }
        ).exec()
    });

    return promise;
  }

}

const __wxApi = new wxApi()
const {globalData} = getApp()

if (!globalData.wxApi) {
    globalData.wxApi = __wxApi
}

module.exports = globalData.wxApi


