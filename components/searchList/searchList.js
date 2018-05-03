// components/searchList/searchList.js
var wxApi = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      src:{
        type:String,
        value:''
      },
      name:{
        type:String,
        value:''
      },
      artists:{
        type:String,
        value:''
      },
      cates:{
         type:Array,
         value:''
      },
      idx:{
        type:Number,
        value:''
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached(){
    const  {src,name,artists,cates,idx} =this.properties;
    this.setData({
        src:src,
        name:name,
        artists:artists,
        cates:cates,
        idx:idx
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
