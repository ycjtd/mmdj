import Service from "../../model/service";
import Category from "../../model/category";
import {throttle} from '../../utils/util';

const service = new Service()

Page({
  data: {
    tabs: ["全部服务", "在提供", "正在找"],
    categoryList: [],
    serviceList: [],
    tabIndex: 0,
    categoryId: 0,
    loading: true,
  },

  onLoad: async function () {
    await this._getServiceList();
    await this._getCategoryList();
    this.setData({
      loading: false,
    });
  },

  // 获取分类列表
  async _getCategoryList() {
    const res = await Category.getCategoryListWithAll();
    this.setData({
      categoryList: res,
    });
  },

  // 获取服务列表
  async _getServiceList() {
    const res = await service
      .reset()
      .getServiceList(this.data.categoryId, this.data.tabIndex);
    this.setData({
      serviceList: res,
    });
  },

  // 监听子组件点击事件
  handleTabChange: function (event) {
    this.data.tabIndex = event.detail.index;
    this._getServiceList();
  },

  // 点击滑块
  handleCategoryChange: throttle(function (event) {
    if (this.data.categoryId === event.currentTarget.dataset.id) {
      return;
    }
    this.data.categoryId = event.currentTarget.dataset.id;
    this._getServiceList();
  }),

  handleSelectService: function (event) {
    const service = event.currentTarget.dataset.service;
    wx.navigateTo({
      url: "/pages/service-detail/service-detail?service_id=" + service.id,
    });
  },

  // 下拉刷新
  async onPullDownRefresh() {
    this._getCategoryList(this.data.categoryId, this.data.tabIndex);
    wx.stopPullDownRefresh();
  },

  // 上拉触底 加载更多
  async onReachBottom() {
    // 获取下一页的数据并且和当前数据合并
    if (!service.hasMoreData) {
      return;
    }
    const serviceList = await service.getServiceList(
      this.data.categoryId,
      this.data.tabIndex
    );
    this.setData({ serviceList });
  },
});