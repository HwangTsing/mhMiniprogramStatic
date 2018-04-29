Component({
    properties: {
        thisData: {
            type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        },
        comicCommentData: {
            type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
        }
    },
    data: {
        //组件的内部数据，和 properties 一同用于组件的模版渲染
    },


    attached() {
        //组件生命周期函数，在组件实例进入页面节点树时执行
        //console.log(this.properties.thisData, this.data)
    },
    moved() {
        //组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
    },
    detached() {
        //组件生命周期函数，在组件实例被从页面节点树移除时执行
    },
    methods: {
        // 组件的事件

    }
})
