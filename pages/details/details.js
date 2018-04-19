// pages/details/details.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        readMain:'暂未阅读',
        readTitle:'开始阅读',
        see:'看到：',
        isBtn:false,
        tabData:[
                {
                  status:0,
                  title:'详情'
                },
                {
                  status:1,
                  title:'目录'
                }
        ],
        status:0,



    },

    //事件
    onReadClick: function (event) {
      var self = this;
      this.setData({
          readMain:self.data.see+'章节匆匆测试测试测试测试',
          readTitle:'继续阅读',
          isBtn:!self.data.isBtn
      })
    },
    onTabTap: function (event) {
      var status = event.currentTarget.dataset.status;
      console.log(status);
      var self = this;
      this.setData({
            status: status
      })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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