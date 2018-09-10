var wxApi = require("../../../../utils/util.js");//导入wxApi

Component({
    properties: {
        tabList:{ //日期列表
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        },
        pubDay:{ //当前日期
            type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        }
    },
    data: {
        //组件的内部数据，和 properties 一同用于组件的模版渲染
    },


    attached() {
        
        //console.log(this.data.tabList)
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
        ClickPubDay(event){ //必须是bind:事件  不能阻止事件冒泡
            //console.log(event);
            // let chapter_id = event.currentTarget.id;
            let data=event.currentTarget.dataset;//元素对象信息
            let index = data.item+1;
            data.event_id=`\{l1_id:'02',l2_id:'017',l3_id:'00${index}\}`
            //console.log(data,this.properties.pubDay)
            let propsPubDay=this.properties.pubDay; //存储父级传递的 当前日期
            if(propsPubDay==data.pub_day){ //如果点击的日期和当前日期相等什么都不做
                return;
            }else{
                /**
                 * ClickPubDay:父组件接受的方法名字
                 * data :发送父组件的数据
                 * {bubbles: true, composed: true} 会依次触发 父辈上的事件
                */
                this.triggerEvent('ClickPubDay', data, { bubbles: true, composed: true }) // 会依次触发 父辈上的事件
            }
        }
    }
})
