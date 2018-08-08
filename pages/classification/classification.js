// pages/classification/classification.js
var wxApi = require("../../utils/util.js");
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
      comic_pay_status:'',
      end_status:0,
      total: 0,    //总页码
      scrolType:'',
      message:'',    //提示语
      hasData:true,  //是否有内容
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
    classList:function () {
        var that = this;
        var page_num = '',rows_num='',cate_id=0,end_status=0,comic_pay_status='';
        if (!!that.data.page_num) {
            page_num = +that.data.page_num;
        }
        if (!!that.data.rows_num){
            rows_num = that.data.rows_num;
        }
        if (!!that.data.cate_id){
            cate_id = that.data.cate_id;
        }
        if (!!that.data.end_status){
            end_status = that.data.end_status;
        }
        if (!!that.data.comic_pay_status){
            comic_pay_status = that.data.comic_pay_status;
        }
        //console.log(cate_id);
        //console.log(that.data.cate_id);

        wxApi.classList({
            method:'GET',
            data:{page_num,rows_num,cate_id,end_status,comic_pay_status},
            success:function (data) {
                //console.log(data.data.data.data);
                let res = data.data.data.data;
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
                            type:null,
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
                        type:null,
                        classListData:[],
                        hasData:false
                    })
                }
            },
            fail:function (data) {
                that.setData({
                    networkType:true,
                    type:null
                })
                wxApi.getShowToast(that.data.serverTitle);
            }
        })
    },
    onCate:function (event) {
        var that = this;
        var cate_id = event.currentTarget.dataset.cateid;
        //console.log(cate_id);
        if (that.data.cate_id == cate_id) {
            return;
        }else  {
            //判断网络类型
            wxApi.getNetworkType().then((res) =>{
                let networkType = res.networkType;
                if (networkType === 'none' || networkType === 'unknown') {
                    //无网络不进行任何操作
                    this.setData({
                        networkType: false,
                        type: null,
                        cate_id:this.data.cate_id
                    })
                    wxApi.getShowToast(that.data.netTitle);

                }else {
                    //有网络
                    that.setData({
                        type:'loading',
                        classListData:[],
                        scrolType:'',
                        cate_id:event.currentTarget.dataset.cateid,
                    })
                    that.data.scrolType = '';
                    console.log(that.data.scrolType);
                    that.data.page_num = 1;
                    this.classList();
                }
            }).catch((err) =>{
                this.setData({
                    networkType: true,
                    type:null
                })
                wxApi.getShowToast(that.data.serverTitle);
            })
        }
    },
    onEnd:function (event) {
        var that = this;
        var end_status = event.currentTarget.dataset.endid;
        //console.log(end_status);
        if (that.data.end_status == end_status) {
            return;
        }else {
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
                        end_status:event.currentTarget.dataset.endid
                    })
                    that.data.scrolType = '';
                    that.data.page_num  = 1;
                    this.classList();

                }
            }).catch((err) =>{
                this.setData({
                    networkType: true,
                    type:null
                })
                wxApi.getShowToast(that.data.serverTitle);
            })
        }
    },
    //滚动条滚到底部的时候触发
    lower: function(e) {
        var that = this;
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
                console.log(that.data.scrolType);
                let total = this.data.total;
                this.data.page_num++;
                if (total < this.data.page_num){
                    return
                }else {
                    this.classList();
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
                      //console.log(rect);
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
              this.classList();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
