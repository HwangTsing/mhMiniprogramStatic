
const infoData=function ({
        data=[],
        itemObj={}
    }={},
){
    let authorData=data;
    let authorAry=[]; //初始化存储对象
    let len=authorData.length;
    
    if(len>0){
        //判断数据是否存在
        authorData.forEach((item,index) => {
            //初始化一个默认对象
            let obj={
                sina_nickname:item.sina_nickname,
                sina_user_id:item.sina_user_id,
                user_avatar:item.user_avatar
            }

            if(len===1){
                //如果length是1的情况下
                if(item.sina_nickname){
                    authorAry.push(obj)
                }else{
                    authorAry.push(itemObj)
                }

            }else{
                //如果length大于1的情况下
                if(item.sina_nickname){
                    authorAry.push(obj)
                }

            }

        }); 

        //循环完成后再次判断
        if( authorAry.length==0 ){
            authorAry.push(itemObj);
        }

    }else{
        if(authorData.length==0){
            authorAry.push(itemObj);
        }
    }

    return authorAry
}

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
        authorAry:null
    },


    attached() {
        
        //组件生命周期函数，在组件实例进入页面节点树时执行
        //console.log(this.properties.thisData, this.data)
        let thisData=this.properties.thisData;
        let { comic={} } = thisData;
        let authorAry; //初始化存储对象
        let itemObj={//初始化全局默认对象
            sina_nickname:comic.sina_nickname,
            sina_user_id:comic.sina_user_id,
            user_avatar:comic.user_avatar
        }   
        let data;
        /*  如果不是KOL作者  */
        if(comic.comic_type==1){
            let {author=[]}=thisData;
            data=author;
        }else if(comic.comic_type==2){ /*  如果是KOL作者  */
            let { new_author:newAuthor=[] }=thisData;
            data=newAuthor;
        }else{ /*  如果是未知作者  */
            data;
        }
        
        authorAry = infoData({ data , itemObj });

        this.setData({
            authorAry
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
        
        
    },
    
})
