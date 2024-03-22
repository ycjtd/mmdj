import Service from "../../model/service";
import User from "../../model/user";
import Rating from "../../model/rating";
import serviceType from "../../enum/service-type";
import serviceStatus from "../../enum/service-status";
import { getEventParam } from "../../utils/utils";
import serviceAction from "../../enum/service-action";
import cache from "../../enum/cache";

const rating = new Rating()

Page({
    data: {
        service: null,
        serviceId: null,
        isPublisher: false,
        ratingList: [],
        serviceTypeEnum: serviceType,
        serviceStatusEnum: serviceStatus,
        loading: true
    },
    onLoad: async function (options) {
        this.data.serviceId = options.service_id
        await this._getService()
        await this._getServiceRatingList()
        this._checkRole()
        this.setData({
            loading: false
        })
    },

    async _getService() {
        const service = await Service.getServiceById(this.data.serviceId)
        this.setData({
            service
        })
    },

    async _getServiceRatingList() {
        if (this.data.service.type === serviceType.SEEK) {
            return
        }

        const ratingList = await rating.reset().getServiceRatingList(this.data.serviceId);

        this.setData({
            ratingList
        })
    },

    handleUpdateStatus: async function (event) {
        const action = getEventParam(event, 'action')
        const content = this._generateModalContent(action)
        const res = await wx.showModal({
            title: '注意',
            content,
            showCancel: true
        })
        if (!res.confirm) {
            return
        }
        await Service.updateServiceStatus(this.data.serviceId, action)
        await this._getService()
    },

    handleEditService: function () {
        const service = JSON.stringify(this.data.service)
        wx.navigateTo({
            url: `/pages/service-edit/service-edit?service=${service}`
        })
    },

    handleChat: function () {
        const targetUserId = this.data.service.publisher.id
        const service = JSON.stringify(this.data.service)
        wx.navigateTo({
            url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${service}`
        })
    },

    handleOrder: function () {
        if (!wx.getStorageSync(cache.TOKEN)) {
            wx.navigateTo({
                url: '/pages/login/login',
                events: {
                    // 箭头函数
                    login: () => {
                        this._checkRole()
                    }
                }
            })
            return
        }
        const service = JSON.stringify(this.data.service)
        wx.navigateTo({
            url: `/pages/order/order?service=${service}`
        })
    },

    _generateModalContent(action) {
        let content

        switch (action) {
            case serviceAction.PAUSE:
                content = '暂停后服务状态变为“待发布”，' +
                    '可在个人中心操作重新发布上线，' +
                    '是否确认暂停发布该服务？'
                break;
            case serviceAction.PUBLISH:
                content = '发布后即可在广场页面中被浏览到，是否确认发布？'
                break;
            case serviceAction.CANCEL:
                content = '取消后不可恢复，需要重新发布并提交审核；' +
                    '已关联该服务的订单且订单状态正在进行中的，仍需正常履约；' +
                    '是否确认取消该服务？'
                break;
        }

        return content
    },

    _checkRole() {
        const userInfo = User.getUserInfoByLocal();
        if (userInfo && userInfo.id === this.data.service.publisher.id) {
            this.setData({
                isPublisher: true
            })
        }
    },

    async onReachBottom() {
        if (!rating.hasMoreData) {
            return
        }

        const ratingList = await rating.getServiceRatingList(this.data.serviceId)
        this.setData({
            ratingList
        })
    }
});
