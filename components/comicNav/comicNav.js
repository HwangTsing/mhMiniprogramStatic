
Component({
  properties: {
    text: String,
    nav: Object,
    action: String,
    comic_id:Number,
    chapter_name:String,
    chapter_id:Number
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
    },
    btnLog(event) {
      let { comic_id, chapter_name ,chapter_id} = this.data;
      console.log(this.data)
         wx.redirectTo({
          url: `/pages/login/login?comic_id=${comic_id}&chapter_name=${chapter_name}&chapter_id=${chapter_id}`
       })
    }
  }
})