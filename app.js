//app.js
App({
  onLaunch: function (options) {
      console.log(options);
      let q = decodeURIComponent(options.query.q);
      console.log(q);
  },
  globalData: {
    wxApi: null,
    isConnected:true,//是否有网络
  }
})
