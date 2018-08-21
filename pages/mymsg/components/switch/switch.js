Component({
  preventTouchMove:function() {},
  data: {
    "visible": false
  },
  methods:{
    btnLog () {
      wx.navigateTo({
        url: '/pages/details/details'
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