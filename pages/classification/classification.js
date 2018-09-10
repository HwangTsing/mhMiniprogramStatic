// pages/classification/classification.js
var wxApi = require("../../utils/util.js")
var _timer = null, daley = 1000
Page({

  /**
   * 页面的初始数据
   */
  data: {

      comicCate: {},   //分类tab
      comicEnd: {},    //连载分类tab
      classListData:[],
      networkType:true,  //是否有网络
      isLoad:false,     //是否加载失败
      netTitle:'主人，您目前的网络好像不太好呢~～',  //无网络提示
      serverTitle:'主人，服务器开小差了～',        //加载失败
      page_num: 1,
      rows_num: 10,
      cate_id:0,
      last_click_id: 1,
      lowerState: 0,
      cur_click_id: 1,
      comic_pay_status:'',
      end_status:0,
      total: 0,    //总页码
      scrolType:'',
      message:'',    //提示语
      hasData:true,  //是否有内容
      cate_name:"全部",
      statisticsBaseurl:"https://apiv2.manhua.weibo.com/static/tongji/tu?s=", //统计用户行为url
    },
    getNow () {
        return +new Date()
    },
    classLabelList:function () {
      var that = this;
      wxApi.classLabelList({
          method:'GET',
          success:function (data) {
            //console.log(data.data.data);
            if (data.data.code == 1) {
                that.data.comicCate = data.data.data.cate_list;
                that.data.comicEnd = data.data.data.end_status_list;
                that.setData({
                    networkType:true,
                    type:null,
                    comicCate:that.data.comicCate,
                    comicEnd:that.data.comicEnd
                })

            }

          },
          fail:function (data) {
              that.setData({
                  networkType:true,
                  type:'server'
              })
          }
      })
    },
    classList:function (cur_click_id = 0, cateId = this.data.cate_id, endStatus = this.data.end_status, filter) {
        var that = this;
        var page_num = '',rows_num='',cate_id=cateId||0, end_status= endStatus || 0, comic_pay_status='';
        if (!!that.data.page_num) {
            page_num = +that.data.page_num;
        }
        if (!!that.data.rows_num){
            rows_num = that.data.rows_num;
        }
        // if (!!that.data.cate_id){
        //     cate_id = that.data.cate_id;
        // }
        // if (!!that.data.end_status){
        //     end_status = that.data.end_status;
        // }
        if (!!that.data.comic_pay_status){
            comic_pay_status = that.data.comic_pay_status;
        }

        wxApi.classList({
            method:'GET',
            data:{page_num,rows_num,cate_id,end_status,comic_pay_status},
            success:function (data) {
                //console.log(data.data.data.data);
                let res = data.data.data.data;
                that.setData({cur_click_id})
                let { type, last_click_id } = that.data
                type = cur_click_id == last_click_id ? null : type //'loading'
                if(filter) type = null;
                if (data.data.data.length !== 0) {
                    if (res.length !== 0){
                        if (that.data.scrolType !== ''){
                            var classListData =that.data.classListData.concat(res);
                            //console.log(classListData);
                        }else  {
                            that.data.classListData = res;
                            var classListData =that.data.classListData;
                        }

                        let page_total = data.data.data.page_total;
                        that.setData({
                            classListData:classListData,
                            total:page_total,
                            message: page_total > page_num ? '加载更多...' : '没有更多了',//提示语
                            type,
                            networkType:true,
                            hasData:true

                        })
                    }else if (res.length === 0) {  //分类没有数据
                        that.setData({
                            type:null,
                            classListData:[],
                            hasData:false
                        })
                    }

                }else if (data.data.data.length === 0) {
                    that.setData({
                        type,
                        classListData:[],
                        hasData:false
                    })
                }
            },
            fail:function (data) {
                that.setData({
                    networkType:true,
                    type:null,
                    cate_id
                })
                wxApi.getShowToast(that.data.serverTitle);
            }
        })
    },
    setLastClickId () {
        const last_click_id = this.getNow()
        const lowerState = 0
        this.setData({ last_click_id , lowerState})
        return last_click_id
    },
    onCate:function (event) {
        var that = this;
        //可能有多个cate_id和cate_name
        var cate_id = event.currentTarget.dataset.cateid;
        var cate_name = event.currentTarget.dataset.catename;
        let event_id = event.currentTarget.dataset.eventid;
        if (that.data.cate_id == cate_id) {
            return;
        }
        if(_timer) clearTimeout(_timer)
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                const { cate_id } = this.data
                this.setData({
                    networkType: false,
                    type: null,
                    cate_id,
                    cate_name
                })
                wxApi.getShowToast(that.data.netTitle);
                this.addStatistics(event_id,{
                  cate_name:cate_name,
                  cate_id:cate_id,
                  switch_type:"click"
                })
            }else {
                //有网络
                that.setData({
                    type:'loading',
                    classListData:[],
                    scrolType:'',
                    cate_id,
                    cate_name
                })
                that.data.scrolType = '';
                that.data.page_num = 1;
                _timer = setTimeout(() => {
                    const last_click_id = this.setLastClickId()
                    that.classList(last_click_id, cate_id)
                    this.addStatistics(event_id,{
                      cate_name:cate_name,
                      cate_id:cate_id,
                      switch_type:"click"
                    })
                }, daley)
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                type:null
            })
            wxApi.getShowToast(that.data.serverTitle);
        })

    },
    onEnd:function (event) {
        var that = this;
        let { cateid: cate_id, endid: end_status } = event.currentTarget.dataset
        if (that.data.end_status == end_status) {
            return;
        }
        if(_timer) clearTimeout(_timer)
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false,
                    type: null,
                    end_status:this.data.end_status
                })
                wxApi.getShowToast(that.data.netTitle);

            }else {
                //有网络
                that.setData({
                    classListData:[],
                    scrolType:'',
                    type: null,
                    end_status,
                })
                that.data.scrolType = '';
                that.data.page_num  = 1;
                _timer = setTimeout(() => {
                    const last_click_id = this.setLastClickId()
                    that.classList(last_click_id, cate_id, end_status, 1);
                }, daley);
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                type:null
            })
            wxApi.getShowToast(that.data.serverTitle);
        })

    },
    //滚动条滚到底部的时候触发
    lower: function(e) {
        var that = this;
        that.lower_timer = null
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false,
                    type: null,
                })
                wxApi.getShowToast(that.data.netTitle);
            }else {
                //有网络
                that.data.scrolType = e.type;
                let total = this.data.total;
                this.data.page_num++;
                if (total < this.data.page_num){
                    return
                }else {
                    if(that.lower_timer ) clearTimeout(that.lower_timer)
                    that.lower_timer  = setTimeout(() => {
                        this.setData({lowerState: 1})
                        this.classList();
                    }, 200);
                }
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                type:null
            })
            wxApi.getShowToast(that.data.serverTitle);
        })

    },
    sendStatistics:function(e){
        let comic_id = e.currentTarget.dataset.comicid;
        let index = e.currentTarget.dataset.comicindex;
        let event_id = e.currentTarget.dataset.eventid;
        let cate_id = this.data.cate_id;
        let cate_name = this.data.cate_name;
        let attach_info = {
            comic_id:comic_id,
            index:index,
            cate_id,
            cate_name,
        }
        this.addStatistics(event_id,attach_info);
    },
    addStatistics:function(event_id,attach_info = {}){
        this.selectComponent("#statistics").changePath(event_id,attach_info);
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      wx.getSystemInfo({
          success: function (res) {
              //console.info(res.windowHeight);
              wx.createSelectorQuery().selectAll('#top_view').boundingClientRect(function (rects) {
                  rects.forEach(function (rect) {
                      that.setData({
                          scrollHeight: res.windowHeight - rect.bottom
                      });
                  })
              }).exec();
          }
      })
      //判断网络类型
      wxApi.getNetworkType().then((res) =>{
          let networkType = res.networkType;
          if (networkType === 'none' || networkType === 'unknown') {
              //无网络不进行任何操作
              this.setData({
                  networkType: false,
                  type: 'net',
              });

          }else {
              //有网络
              this.setData({
                  type:'loading',
              })
              this.classLabelList();
              this.classList(1);
          }
      }).catch((err) =>{
          this.setData({
              networkType: true,
              type:'server'
          })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
        start_time : new Date().getTime(),
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let start_time = this.data.start_time;
    this.selectComponent("#statistics").pageStatistics(start_time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let start_time = this.data.start_time;
    this.selectComponent("#statistics").pageStatistics(start_time);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
          title: '各种有爱的动漫分享'
      }
  }
})
