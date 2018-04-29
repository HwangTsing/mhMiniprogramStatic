const {
    baseUrl,
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

    getPaths(url = '') {
        if (!/^(http[s]?:)/.test(url)) {
            return baseUrl + url;
        }
        return url;
    }

    ajax(url, cfg = {data: {}}) {
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

    request(url, cfg = {method: 'GET'}) {
        return wx.request({
            url: this.getPaths(url),
            ...cfg,
        });
<<<<<<< HEAD
    }

    systemInfo() {
        var systemInfo = {};
        try {
            systemInfo = wx.getSystemInfoSync()
        } catch (e) {
        }

        return systemInfo
    }

    post(url, cfg = {method: 'POST'}) {
        return ajax(url, cfg)
    }

    /*以下是调用接口方法*/

    //推荐页
    recommendBoy(cfg) {
        return this.request('wbcomic/home/page_recommend_list?mca=h5_recommend_male', cfg)
    }

    recommendGirl(cfg) {
        return this.get('wbcomic/home/page_recommend_list?mca=h5_recommend_female', cfg)
    }
=======
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
  //搜索内容接口
  searchList(cfg) {
     return this.request('wbcomic/home/search?',cfg)
  }
  //查看更多接口
  moreList(cfg){
    return this.request('wbcomic/home/recommend_list?',cfg)
  }
>>>>>>> feature_1.0.0


}

const __wxApi = new wxApi()
const {globalData} = getApp()

if (!globalData.wxApi) {
    globalData.wxApi = __wxApi
}

module.exports = globalData.wxApi
