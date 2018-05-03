// pages/morelist/morelist.js
var wxApi = require("../../utils/util.js");
//var { _ } = require("../../utils/underscore.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      moreData:[],   //数据
      networkType:''  //网络
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      var location_en = options.location_en;
      var title = options.title;
      wx.setNavigationBarTitle({//动态设置当前页面的标题
          title: title
      });
      this.moreList(location_en);
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
                /*_.each(moreData,function (item,index) {
                    console.log(item.extra);
                });*/

                moreData.forEach((item,index) =>{
                  console.log(item.extra);
                  extra.push(item.extra);
                })
            }
            console.log(moreData);
            console.log(extra);
            that.setData({
                moreData:extra,

            })
        },
        fail:function (data) {
            console.log(data);
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
      wx.getNetworkType({  //判断网络类型
          success: function(res) {
              console.log(res);
              /* that.setData({
                   netWorkType:res.networkType
               })*/
              if (res.networkType === 'none') {

              }
          }
      });
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
