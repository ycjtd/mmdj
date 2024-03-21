import {throttle} from '../../utils/util'

// components/tabs/tabs.js
Component({
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTabIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 1.传入一个数组，按数组元素内容渲染我们的标签页选项
    // 2.能够监听点击事件，并且通知使用组件的页面或者父组件，通过事件通知我们选择了什么
    // 点击标签页
    handleTabChange: throttle(function (event) {
      const index = event.currentTarget.dataset.index;
      if(index === this.data.currentTabIndex) return
      this.setData({
        currentTabIndex: index,
      });

      this.triggerEvent("change", { index });
    }),

    // 触摸移动屏幕
    handleTouchMove:function (event) {
      const currentTabIndex = this.data.currentTabIndex
      const direction = event.direction
      const targetTabIndex = currentTabIndex + direction

      if(targetTabIndex < 0 || targetTabIndex > this.data.tabs.length - 1) {
        return
      }

      const customEvent = {
        currentTarget:{
          dataset:{
            index:targetTabIndex
          }
        }
      }

      this.handleTabChange(customEvent);
    }
  },
});
