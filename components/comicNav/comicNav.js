Component({
  properties: {
    text: String,
    nav: Object,
    action: String
  },
  data: {
    navClass: '',
    floorstatus: false,
    btnSure: true,
    btnLog: false,
    
  },
  attached () {
    this.popup = this.selectComponent('#popup')
  },
  methods: {
    chargePop () {
      let Cookie = wx.getStorageSync("Set-Cookie");
      if (Cookie) {
        this.setData({
          btnSure: true,
          btnLog: false,
        })
      } else {
        this.setData({
          btnSure: false,
          btnLog: true,
        })
      }
      this.popup.open()
    }
  }
})