Component({
  properties: {
    order: {
      type: String,
      value: '1',
    },
    src: {
      type: String,
      value: '',
    },
    image_id: String,
    scale: Number,
    width: Number,
  },
  data: {
    
  },
  attached() {
    const {width, scale} = this.properties;
    this.setData({
      width: width,
      height: width/scale,
    });
  },
  methods: {
    load(e) {
      // console.log('load')
      const { detail = {}, detail: {width, height} } = e
      const scale = width / height
      const { width: _width, scale: _scale} = this.properties
      if (_scale != scale)  {
        this.setData({
          height: _width / scale,
        })
      }
    },
    error(e) {
      // console.log(e)
    },
  }
})