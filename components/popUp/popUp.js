Component({
  properties: {
    btnSure:{
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value:true, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    btnLog:{
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value:false, // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },
  preventTouchMove:function() {},
  data: {
    "visible": false
  },
  methods:{
    open () {
      this.setData({"visible": true})
    },
    btnSure () {
      this.setData({"visible": false})
      //this.triggerEvent('myevent', { floorstatus:false});    
    },
    btnLog(){
      this.triggerEvent('btnLog');    

      //  wx.navigateTo({
      //   url: '/pages/login/login'
      //  })
    }
  }
  
    
 
})