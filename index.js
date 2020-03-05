const { Wechaty } = require('wechaty')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const config = require('./lib/config')
const events = require('./lib/events')

const name = config.wechat_name
const token = config.token
const puppet = new PuppetPadplus({
    token
})

const bot = new Wechaty({
    puppet,
    name
})

bot.on('scan', events.scan)
    .on('login', events.login)
    .on('logout', events.logout)
    .on('message', events.message(bot))
    .on('friendship', events.friendship)

bot.start()