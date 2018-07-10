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
      page_num: 1,
      rows_num: 20,
      cate_id:0,
      comic_pay_status:'',
      end_status:0,
      total:0,    //总页码
      scrolType:'',
      message:'',    //提示语

  },

    classLabelList:function () {
      var that = this;
      wxApi.classLabelList({
          method:'GET',
          success:function (data) {
            console.log(data.data.data);
            if (data.data.code == 1) {
                that.data.comicCate = data.data.data.cate_list;
                console.log(that.data.comicCate);
                that.data.comicEnd = data.data.data.end_status_list;
                console.log(that.data.comicEnd);
                that.setData({
                    comicCate:that.data.comicCate,
                    comicEnd:that.data.comicEnd
                })

            }

          },
          fail:function (data) {

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
            console.log(cate_id)
        }
        if (!!that.data.end_status){
            end_status = that.data.end_status;
        }
        if (!!that.data.comic_pay_status){
            comic_pay_status = that.data.comic_pay_status;
        }
        wxApi.classList({
            method:'GET',
            data:{page_num,rows_num,cate_id,end_status,comic_pay_status},
            success:function (data) {
                console.log(data.data.data.data);
                if (data.data.code == 1){
                    if (that.data.scrolType !== ''){
                        var classListData =that.data.classListData.concat(data.data.data.data);
                        console.log(classListData);
                    }else  {
                        that.data.classListData = data.data.data.data;
                        var classListData =that.data.classListData;
                    }

                    let page_total = data.data.data.page_total;
                    console.log(page_total);
                    that.setData({
                        classListData:classListData,
                        total:page_total,
                        message: page_total > page_num ? '加载更多...' : '没有更多了',//提示语

                    })
                }else if (data.data.data.data.length === 0) {  //分类没有数据
                    that.setData({
                        classListData:[]
                    })
                }
            },
            fail:function (data) {

            }
        })
    },
    //滚动条滚到底部的时候触发
    lower: function(e) {
        var that = this;
        that.data.scrolType = e.type;
        console.log(that.data.scrolType)
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false,
                    classListData:[]
                })

            }else {
                //有网络
                let total = that.data.total;
                console.log(total);
                that.data.page_num++;
                if (total < that.data.page_num){
                    return;
                }else {
                    that.setData({
                        scrolType:that.data.scrolType
                    })
                    that.classList();
                }

            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })

    },
    onCate:function (event) {
        var that = this;
        that.data.cate_id = event.currentTarget.dataset.cateid;
        console.log(that.data.cate_id);
        that.setData({
            cate_id:event.currentTarget.dataset.cateid
        })
        this.classList();
    },
    onEnd:function (event) {
        var that = this;
        that.data.end_status = event.currentTarget.dataset.endid;
        console.log(that.data.end_status);
        that.setData({
            end_status:event.currentTarget.dataset.endid
        })
        this.classList();
    },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.classLabelList();
    this.classList();
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

  }
})
