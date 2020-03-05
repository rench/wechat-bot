const qrterminal = require('qrcode-terminal')
const config = require('./config')
const actions = require('./actions')
const { Friendship, FileBox, UrlLink } = require("wechaty")


let log = (message) => {
    if (config.log) {
        console.log('wechatbot: ' + message)
    }
}
/**
 * scan event
 * @param {*} qrcode 
 * @param {*} status 
 */
let scan = async (url, status) => {
    log('scan url:' + url)
    //qrterminal.generate(url, { small: true })
    qrterminal.generate(url)
}

/**
 * login event
 * @param {*} user 
 */
let login = async (user) => {
    log(`${user} login success`)
}
/**
 * logout event
 * @param {*} user 
 */
let logout = async (user) => {
    log(`${user} logout success`)
}

/**
 * new message event
 * @param {*} message 
 */
let message2 = async (message) => {
    log(`receive a new message ${message}`)
}

/**
 * a friendship request
 * @param {*} friendship 
 */
let friendship = async (friendship) => {
    switch (friendship.type()) {
        case Friendship.Type.Receive:
            // new friend contact
            const contact = friendship.contact()
            const contact_name = contact.name
            log(`contact_name ${contact_name}`)
            // hello word
            const hello_word = friendship.hello()
            // accept the new firend request
            if (config.rule.personal.auto_verify.indexOf(hello_word) != -1) {
                let result = await friendship.accept()
                log(`accpet result: ${result}`)
                if (result) {
                    log(`Request from ${contact.name()} is accept succesfully!`)
                } else {
                    log(`Request from ${contact.name()} failed to accept`)
                }
            } else {
                log(`Request from ${contact.name()} can't verify hello word: ${hello_word}`)
            }
            break;
        case Friendship.Type.Confirm:
            log(`new friendship confirmed with ${contact.name()}`)
            break;
    }
}
/**
 * 
 * @param {*} bot 
 */
let message = bot => {

    return async msg => {
        const contact = msg.from()
        const to = msg.to()
        const room = msg.room()
        let text = msg.text()
        if (msg.self()) {
            //return
        }
        if (text) {
            log(`receive a message from:${contact.name()} , message:${text}`)
            // room message
            if (room) {
                // room title 
                const topic = await room.topic()
                log(`Room: ${topic} Contact: ${contact.name()} Send a Text: ${text}`)
                const mentionSelf = await msg.mentionSelf()
                if (mentionSelf) {
                    let self = await msg.to()
                    text = text.replace('@' + self.name, '')
                    let responseText = '你好,我是智能助理！'
                    room.say(responseText, msg.from())
                }
            } else {
                // one 2 one
                if ('购物' == text || '我要购物' == text) {
                    const urlLink = await actions.goods(contact)
                    if (urlLink) {
                        await contact.say(urlLink)
                    }
                } else if ('每日语句' == text) {
                    let word = await actions.daily_word(contact)
                    if (word) {
                        await contact.say(word)
                    }
                } else if ('笑话' == text) {
                    let joke = await actions.joke(contact)
                    if (joke) {
                        await contact.say(joke)
                    }
                } else if (text.indexOf('天气') > -1) {
                    text = text.replace('天气', '').replace('的', '')
                    if (text) {
                        let weather = await actions.weather(contact, text)
                        weather && await contact.say(weather)
                    }
                } else if (text.indexOf('新闻') > -1) {
                    text = text.replace('新闻', '').replace('的', '')
                    if (text) {
                        let news = await actions.news(contact, text)
                        if (news) {
                            await contact.say(news)
                        }
                    }
                } else {
                    await contact.say('你好，我是你的智能助理')
                }
            }
        } else {
            log('can not deal with none text message')
        }

    }
}

module.exports = {
    scan
    , login
    , logout
    , message
    , friendship
} 