Component({
  properties: {
    thisData: {
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    ok_follow:{
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    follow:{
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },
  data: {
    mode:'scaleToFill',
    imagewidth:0,
    imageheight: 0
    //组件的内部数据，和 properties 一同用于组件的模版渲染
  },
  attached() {
    //组件生命周期函数，在组件实例进入页面节点树时执行
    //console.log(this.properties.thisData)
  },
  moved () {
    //组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  },
  detached () {
    //组件生命周期函数，在组件实例被从页面节点树移除时执行
  },
  methods: {
    imageUtil(e) {
      var imageSize = {};
      var originalWidth = e.detail.width;//图片原始宽  
      var originalHeight = e.detail.height;//图片原始高  
      var originalScale = originalHeight / originalWidth;//图片高宽比
      //获取屏幕宽高  
      wx.getSystemInfo({
        success: function (res) {
          var windowWidth = res.windowWidth;
          var windowHeight = res.windowHeight;
          var windowscale = windowHeight / windowWidth;//屏幕高宽比  

          if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比  
            //图片缩放后的宽为屏幕宽  
            imageSize.imageWidth = windowWidth;
            imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
          } else {//图片高宽比大于屏幕高宽比  
            //图片缩放后的高为屏幕高  
            imageSize.imageHeight = windowHeight;
            imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
          }

        }
      })
      //console.log('缩放后的宽: ' + imageSize.imageWidth)
      //console.log('缩放后的高: ' + imageSize.imageHeight)
      return imageSize;
    }, 
    imageLoad: function (e) {
      
      var imageSize = this.imageUtil(e)
      this.setData({
        imagewidth: imageSize.imageWidth,
        imageheight: imageSize.imageHeight
      })
    },
    follow:function(e){
      this.triggerEvent('myevent')
    }
  }
})