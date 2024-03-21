import Http from "../utils/http";


class Service {

  page = 1
  count = 4
  data = []
  hasMoreData = true
  /**
   * 分页获取服务列表
   * @param {*} page 页码
   * @param {*} count 每页数量
   * @param {*} category_id 分类id
   * @param {*} type 服务类型
   */
  async getServiceList(category_id=null,type=null){
    if(!this.hasMoreData){
      return this.data
    }
    // 发起网络请求，获取数据
    const serviceList = await Http.request({
      url: "v1/service/list",
      data: {
        page: this.page,
        count: this.count,
        category_id: category_id || "",
        type: type || '',
      },
    });
    this.data = this.data.concat(serviceList.data)
    this.hasMoreData = !(this.page === serviceList.last_page)
    this.page++
    return this.data
  }

  reset(){
    this.page = 1
    this.count = 4
    this.data = []
    this.hasMoreData = true
    return this
  }
}

export default Service