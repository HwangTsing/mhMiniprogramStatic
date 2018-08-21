Component({
  preventTouchMove:function() {},
  data: {
    "visible": false
  },
  methods:{
    btnLog () {
      wx.navigateTo({
        url: '/pages/login/login'
       })
     this.setData({"visible": false})
    },
    btnswitch(){
      this.setData({"visible": false})
    },
    open () {
       this.setData({"visible": true})
    },
  }
  
    
 
})