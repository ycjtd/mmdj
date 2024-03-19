import Service from "../../model/service";
import Category from "../../model/category";

const service = new Service()

Page({
  data: {
    tabs: ["全部服务", "在提供", "正在找"],
    currentTabIndex: 0,
    categoryList:[],
    serviceList:[]
  },

  onLoad:function(){
    this._getServiceList()
    this._getCategoryList()
  },
  
  // 获取分类列表
  async _getCategoryList(){
    const res = await Category.getCategoryListWithAll();
    this.setData({
      categoryList:res
    });
  },

  // 获取服务列表
  async _getServiceList(){
    const res = await service.getServiceList(1,10)
    this.setData({
      serviceList: res.data
    });
  },

  // 监听子组件点击事件
  handleTabChange:function(event){
  },

  // 点击滑块 
  handleCategoryChange:function(event){
    const id = event.currentTarget.dataset.id;
  }
});