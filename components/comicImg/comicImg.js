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
    const {width, scale, src} = this.properties;
    console.log('src', src)
    this.setData({
      width: width,
      height: width/scale,
      src: src.replace(/http:\/\//i, 'https://')
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