const COVER_CLASS = 'vcover';
const HCOVER_CLASS = 'hcover'
const UCOVER_CLASS = 'ucover'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
        type:String,
        value:''
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    clamm:{
        'vcover':COVER_CLASS,
        'hcover':HCOVER_CLASS,
        'ucover':UCOVER_CLASS
    }
  },
  attached (){
      const { type } = this.properties
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
