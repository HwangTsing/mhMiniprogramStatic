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
      console.log(e)
    },
    error(e) {
      console.log(e)
    },
  }
})