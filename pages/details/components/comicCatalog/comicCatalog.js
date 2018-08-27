var wxApi = require("../../../../utils/util.js");//导入wxApi

Component({
  properties: {
    directoryDisplay: { //判断是目录展示方式 1表示9宫格，2表示横板
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    chapterList: {
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    comic_id: {
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    history: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    comic_id_page:{
      type:Number,
      value:null,
    },
    title:{
      type:String,
      value:null,
    }
  },
  data: {
    //组件的内部数据，和 properties 一同用于组件的模版渲染
    chapter: { id: null },
    floorstatus: false,//是否显示弹出框
    btnSure: true,
    btnLog: false,
  },


  attached() {
    //组件生命周期函数，在组件实例进入页面节点树时执行
  },

  moved() {
    //组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  },
  detached() {
    //组件生命周期函数，在组件实例被从页面节点树移除时执行
  },
  methods: {
    // 组件的事件
    /*
    * 点击目录的事件
    * */
    ClickCatalog(event) {
      //console.log(event);
      // let chapter_id = event.currentTarget.id;
      let data = event.currentTarget.dataset;//元素对象信息
      let chapter_id = data.chapter_id;
      let chapter_name = data.chapter_name;
      let comic_id = data.comic_id;
      let item = data.item;
      this.setData({ //存储 点击章节信息,到组件对象中
        chapter: data,
      })

      if (item.isLocked) {
        let Cookie = wx.getStorageSync("Set-Cookie");
        const pop = this.selectComponent('#popup');
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
        if (pop) pop.open();
   

      }
      else if (comic_id && chapter_id) {
        wx.navigateTo({
          url: `/pages/read/read?chapter_id=${chapter_id}&chapter_name=${encodeURIComponent(chapter_name)}`//&comic_id=${comic_id}
        })
      }
    },
    btnLog(event) {
      let { comic_id_page, title } = this.data;
         wx.redirectTo({
          url: `/pages/login/login?comic_id=${comic_id_page}&chapter_name=${title}&btnLog=1`
       })
    }
  }
})
