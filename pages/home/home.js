import Service from "../../model/service";
import Category from "../../model/category";
import { debounce, throttle } from "../../utils/utils";
import cache from "../../enum/cache";
import { setTabBarBadge } from "../../utils/wx";

const service = new Service();

Page({
    data: {
        tabs: ['全部服务', '在提供', '正在找'],
        categoryList: [],
        tabIndex: 0,
        categoryId: 0,
        loading: true
    },

    onLoad: async function () {
        await this._getServiceList()
        //   执行函数 1
        //   执行函数 2
        await this._getCategoryList()
        this.setData({
            loading: false
        })
        //    。。。。。
    },

    onShow() {
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
        setTabBarBadge(unreadCount)
    },

    async _getServiceList() {
        const serviceList = await service.reset().getServiceList(this.data.categoryId,
            this.data.tabIndex)
        this.setData({
            serviceList: serviceList
        })
    },

    async _getCategoryList() {
        const categoryList = await Category.getCategoryListWithAll();
        this.setData({
            categoryList
        })
    },

    handleTabChange: debounce(function (event) {
        this.data.tabIndex = event.detail.index
        this._getServiceList()
    }),

    handleCategoryChange: throttle(function (event) {
        if (this.data.categoryId === event.currentTarget.dataset.id) {
            return
        }
        this.data.categoryId = event.currentTarget.dataset.id
        this._getServiceList()
    }),

    handleSelectService: function (event) {
        const service = event.currentTarget.dataset.service
        //     1. 缓存。存在数据不一致
        // 2. 只传递一个 id .然后跳转的目标页面根据这个 id 发起一个请求获取数据
        wx.navigateTo({
            url: '/pages/service-detail/service-detail?service_id=' + service.id
        })
    },

    handleScrollToTop: function () {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },

    /**
     * 下拉刷新
     */
    async onPullDownRefresh() {
        this._getServiceList()
        wx.stopPullDownRefresh()
    },

    /**
     * 上拉触底加载更多
     */
    async onReachBottom() {
        // 获取下一页的数据并且和当前的数据合并
        if (!service.hasMoreData) {
            return
        }
        const serviceList = await service.getServiceList(this.data.categoryId, this.data.tabIndex)
        this.setData({
            serviceList
        })
    }
});
