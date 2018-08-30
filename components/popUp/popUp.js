Component({
  properties: {
    btnSure:{
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value:true, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    btnLog:{
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value:false, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    callback:{
      type:String,
      value:null
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
    close () {
      this.setData({"visible": false})
    },
    btnSure () {
      this.setData({"visible": false})
    },
    btnLog(){
     let callback=this.data.callback;
     console.log(callback)
    //  callback=JSON.parse(callback)
    //  let url=callback.url;
    //  let comic_id=callback.comic_id;
    //  let chapter_name=callback.chapter_name;
    //  let callbackUrl=url+"/"+"comic_id="+comic_id+"&chapter_name="+chapter_name
    // let obj={
    //   callback:callback
    // }
    // callback=JSON.stringify(callback)
    // console.log( callbackUrl)
    // let callbackUrl={
    //   url:callback.url,
    //   comic_id:callback.comic_id,
    //   chapter_name:callback.comic_name
    // }
    // callbackUrl=JSON.stringify(callbackUrl)
       wx.navigateTo({
        url: `/pages/login/login?callback=${callback}`
       })
      //  console.log(callbackUrl)
    }
  }
  
    
 
})