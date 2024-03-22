/**
 * @Created by WebStorm
 * @Author: 沁塵
 * @Desc:
 */
const timConfig = {
    options: {
        SDKAppID: 0// 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    },
    // 0 普通级别，日志量较多，接入时建议使用
    // 1 release 级别，SDK 输出关键信息，生产环境时建议使用
    logLevel: 1
}

export default timConfig
