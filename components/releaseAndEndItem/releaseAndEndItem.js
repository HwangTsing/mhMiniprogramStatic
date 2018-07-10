Component({
    properties: {
      /**
       *  data:漫画id {comic_id:1},
       *  cate:漫画分类(标签) {cate_cn_name:少年,cate_id:7}
       *  lastChapter: 漫画最新章节{chapter_name:xxx,comic_id:xxx,chapter_id:xxx}
       *  comic:漫画信息 {comic_id:1,name:xxx,cover:xxx,...}
       *  siteImage 背景前缀(域名)
      */
        data: {
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        },
        cate:{
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        },
        lastChapter: {
          type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
          value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        },
        comic : {
          type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
          value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        },
        siteImage:{
            type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
        }
    },
    data: {
        myCate:null
        //组件的内部数据，和 properties 一同用于组件的模版渲染
    },
    attached() {
        //组件生命周期函数，在组件实例进入页面节点树时执行
        /* 
            #353535	悬疑、灵异
            #FF87E8	日韩、恋爱、总裁
            #4DC6FF	少年、校园
            #AE6AFF	都市、剧情
            #463CFF	科幻、玄幻、奇幻
            #AC5626	搞笑、古风、日常
            #FF696B	完结、动作、其它、备用
        */
        let cate=this.properties.cate;
        
        if(cate){
            let  cate_cn_name = cate.cate_cn_name?cate.cate_cn_name:null;
            let  cate_en_name = cate.cate_en_name?cate.cate_en_name:null;
            let  cate_id = cate.cate_id?cate.cate_id:null;
            let  color;

            //处理标签名字  只保存前三个字符
            if(cate_cn_name.length>3){
                cate_cn_name=cate_cn_name.slice(0,3)
            }

            //获取标签的背景颜色
            if(cate_cn_name=='悬疑'||cate_cn_name=='灵异'){
                color="#353535";
            }else if(cate_cn_name=='日韩'||cate_cn_name=='恋爱'||cate_cn_name=='总裁'){
                color="#FF87E8";
            }else if(cate_cn_name=='少年'||cate_cn_name=='校园'){
                color="#4DC6FF";
            }else if(cate_cn_name=='都市'||cate_cn_name=='剧情'){
                color="#AE6AFF";
            }else if(cate_cn_name=='科幻'||cate_cn_name=='玄幻'||cate_cn_name=='奇幻'){
                color="#463CFF";
            }else if(cate_cn_name=='搞笑'||cate_cn_name=='古风'||cate_cn_name=='日常'){
                color="#AC5626";
            }else if(cate_cn_name=='完结'||cate_cn_name=='动作'){
                color="#FF696B";
            }else{
                color="#FF696B";
            }

            let myCate={ //存储格式化数据
              cate_cn_name,
              cate_id,
              cate_en_name,
              color
            };
            this.setData({
                myCate
            })
        }
    },
    moved () {
      //组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
    },
    detached () {
      //组件生命周期函数，在组件实例被从页面节点树移除时执行
    },
    methods: {
        goShow(e){
            console.log(e)
            let comic_id=e.currentTarget.dataset.comic_id
            if(comic_id){
                wx.navigateTo({
                    url: `/pages/details/details?comic_id=${comic_id}`
                })
            }
        }
    }
})