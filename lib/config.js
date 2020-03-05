const WECHAT_TOKEN = 'your own padplus token'


const config = {
    token: WECHAT_TOKEN,
    wechat_name: 'your wechat bot name',
    rule: {
        personal: {
            auto_reply: '你好，欢迎使用个人助理!',
            auto_verify: ['添加个人助理']
        },
        room: {
            manage_room: [{
                name: '',
                id: '',
                auto_reply: '你好，欢迎你的加入，请自觉遵守群规则，文明交流!'
            }]
        }
    },
    log: true

}

module.exports = config