// pages/morelist/morelist.js
var wxApi = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      moreData:[],   //数据
      networkType:true,  //是否有网络
      isLoad:false,     //是否加载失败
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //console.log(options);
      var that = this;
      var location_en = options.location_en;
      var title = options.title;
      //判断网络类型
      wxApi.getNetworkType().then((res) =>{
          let networkType = res.networkType;
          if (networkType === 'none' || networkType === 'unknown') {
              //无网络不进行任何操作
              this.setData({
                  networkType: false
              })

          }else {
              //有网络
              wx.setNavigationBarTitle({//动态设置当前页面的标题
                  title: title
              });
              that.moreList(location_en);
          }
      })
  },
  moreList:function (location_en) {
    var that = this;
    wxApi.moreList({
        method:'GET',
        data:{location_en},
        header:'',
        success:function (data) {
            console.log(data);
            that.data.moreData = data.data.data;
            console.log(that.data.moreData);
            var extra = [];
            for (var i in that.data.moreData){
                var moreData = data.data.data[i];
                moreData.forEach((item,index) =>{
                  extra.push(item.extra);
                })
            }
            console.log(moreData);
            console.log(extra);
            that.setData({
                moreData:extra,
                networkType:true
            })
        },
        fail:function (data) {
            that.setData({
                isLoad:true
            })
        }

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

  }
})
