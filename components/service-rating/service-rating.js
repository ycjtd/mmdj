// components/service-rating/service-rating.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rating: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handlePreview:function(event){
      const index = event.currentTarget.dataset.index
      wx.previewImage({
        urls: this.data.rating.illustration,
        current: this.data.rating.illustration[index],
      });
    }
  },
});
