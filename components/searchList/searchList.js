// components/searchList/searchList.js
var wxApi = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      src:{
        type:null,
        value:null
      },
      name:{
        type:null,
        value:null
      },
      artists:{
          type:null,
          value:null
      },
      cates:{
         type:null,
         value:null
      },
      idx:{
        type:null,
        value:null
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
