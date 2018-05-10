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
        comic_id:{
            type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        }
    },
    data: {
        //组件的内部数据，和 properties 一同用于组件的模版渲染
        chapter:{id:null}
    },


    attached() {
        //组件生命周期函数，在组件实例进入页面节点树时执行
       /* console.log(this.properties.chapterList) */
        let key="comic_id_"+this.properties.comic_id;
        //console.log(key)
        wx.getStorage({//从本地缓存中异步获取指定 key 对应的内容。
            key: key,
            success: (res)=> {
                //console.log(res.data)
                this.setData({
                    chapter:res.data
                })

            },
            fail:(err)=>{ //没有获取本地缓存数据的时候
                console.log(err)
            }
        })
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
        ClickCatalog(event){
            //console.log(event);
            // let chapter_id = event.currentTarget.id;
            let data=event.currentTarget.dataset;//元素对象信息
            let chapter_id = data.chapter_id;
            let comic_id = data.comic_id;
            if(comic_id && chapter_id){
                wx.navigateTo({
                    url: `/pages/read/read?chapter_id=${chapter_id}`//&comic_id=${comic_id}
                })
                return //什么都不做
                /*wx.setStorage({ //将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
                    key:"comic_id_"+comic_id,
                    data:data,
                    success:()=>{
                        //存储成功后的回调
                        console.log('存储成功');
                        this.setData({ //存储 点击章节信息,到组件对象中
                            chapter:data
                        })
                        this.triggerEvent('ClickCatalog', data, { bubbles: true, composed: true })

                        wx.navigateTo({
                            url: `/pages/read/read?chapter_id=${chapter_id}&comic_id=${comic_id}`
                        })
                    },
                    fail:()=>{
                        //接口调用(存储)失败的回调函数
                        console.log('存储失败')

                    }
                })*/
            }
        }
    }
})
