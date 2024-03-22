/**
 * @Created by WebStorm
 * @Author: 沁塵
 * @Desc:
 */
import Http from "../utils/http";
import Base from "./base";

class Service extends Base {
    // 继承，子类，父类
    // 一个实例对象，它是有状态的
    // 调用静态方法本质上就是调用类方法
    // 实例化调用，本质上是在调用对象的方法


    /**
     * 分页获取服务列表
     * @param category_id 分类 id
     * @param type 服务类型
     */
    async getServiceList(category_id = null, type = null) {

        if (!this.hasMoreData) {
            return this.data
        }

        // 发起网络请求，获取数据
        const serviceList = await Http.request({
            url: 'v1/service/list',
            data: {
                page: this.page,
                count: this.count,
                category_id: category_id || '',
                type: type || ''
            }
        },)
        this.data = this.data.concat(serviceList.data)
        this.hasMoreData = !(this.page === serviceList.last_page)
        this.page++
        return this.data
    }

    static getServiceById(serviceId) {
        return Http.request({
            url: `v1/service/${serviceId}`
        })
    }

    static updateServiceStatus(serviceId, action) {
        return Http.request({
            url: `v1/service/${serviceId}`,
            data: {
                action
            },
            method: 'POST'
        })
    }

    static publishService(formData) {
        return Http.request({
            url: '/v1/service',
            data: formData,
            method: 'POST'
        })
    }

    static editService(serviceId, formData) {
        return Http.request({
            url: `v1/service/${serviceId}`,
            data: formData,
            method: 'PUT'
        })
    }

    static getServiceStatus(type) {
        return Http.request({
            url: `v1/service/count?type=${type}`
        })
    }

    async getMyService(type, status) {
        if (!this.hasMoreData) {
            return
        }

        const serviceList = await Http.request({
            url: 'v1/service/my',
            data: {
                page: this.page,
                count: this.count,
                type,
                status
            }
        })

        this.data = this.data.concat(serviceList.data)
        this.hasMoreData = this.page !== serviceList.last_page
        this.page++
        return this.data
    }
}

export default Service
