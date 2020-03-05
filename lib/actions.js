const request = require('request')
const { Friendship, FileBox, UrlLink } = require("wechaty")
const api_url = 'https://www.mxnzp.com/'
const api_goods_url = 'http://tk.xuankejia.cn/cat/list/0/0'

const news_type = [
    { "typeId": 509, "typeName": "财经" }
    , { "typeId": 510, "typeName": "科技" }
    , { "typeId": 511, "typeName": "军事" }
    , { "typeId": 512, "typeName": "时尚" }
    , { "typeId": 513, "typeName": "NBA" }
    , { "typeId": 514, "typeName": "股票" }
    , { "typeId": 515, "typeName": "游戏" }
    , { "typeId": 516, "typeName": "健康" }
    , { "typeId": 517, "typeName": "知否" }
    , { "typeId": 518, "typeName": "要闻" }
    , { "typeId": 519, "typeName": "体育" }
    , { "typeId": 520, "typeName": "娱乐" }
    , { "typeId": 521, "typeName": "头条" }
    , { "typeId": 522, "typeName": "视频" }
    , { "typeId": 525, "typeName": "热点" }
    , { "typeId": 526, "typeName": "小视频" }
]

let random = (min = 0, max = 10) => {
    return Math.floor((Math.random() * (max - min + 1)) + min)
}

let log = message => {
    console.log('wechatbot:actions:' + message)
}
/**
 * daily_word
 * @param {*} user 
 */
let daily_word = user => {
    return new Promise((resolve, reject) => {
        request(api_url + 'daily_word/recommend?count=1', (err, response, body) => {
            if (err) {
                resolve(null)
            } else {
                let data = JSON.parse(body)
                if (data && data.code == 1 && data.data.length > 0) {
                    resolve(data.data[0])
                } else {
                    resolve(null)
                }
            }
        })
    })
}
/**
 * random joke
 * @param {*} user 
 */
let joke = user => {
    return new Promise((resolve, reject) => {
        request(api_url + 'jokes/list/random', (err, response, body) => {
            if (err) {
                resolve(null)
            } else {
                let data = JSON.parse(body)
                if (data && data.code == 1 && data.data.length > 0) {
                    resolve(data.data[0].content)
                } else {
                    resolve(null)
                }
            }
        })
    })
}

/**
 * weather
 * @param {*} user 
 * @param {*} city 
 */
let weather = (user, city) => {
    return new Promise((resolve, reject) => {
        request(api_url + 'weather/current/' + encodeURI(city), (err, response, body) => {
            if (err) {
                log(err)
                resolve(null)
            } else {
                let data = JSON.parse(body)
                if (data && data.code == 1 && data.data) {
                    let report = data.data
                    resolve('' + report.address + ',' + report.temp + ',' + report.weather + ',' + report.windDirection + ',' + report.windPower)
                } else {
                    resolve(null)
                }
            }
        })
    })
}

/**
 * news detail
 * @param {*} newsId 
 */
let news_detail = newsId => {
    return new Promise((resolve, reject) => {
        request(api_url + 'news/details?newsId=' + newsId, (err, response, body) => {
            if (err) {
                resolve(null)
            } else {
                let data = JSON.parse(body)
                if (data && data.code == 1 && data.data) {
                    resolve(data.data)
                } else {
                    resolve(null)
                }
            }
        })
    })
}

/**
 * news
 * @param {*} user 
 * @param {*} type 
 */
let news = (user, type) => {
    return new Promise((resolve, reject) => {
        // news/list?typeId=509&page=1
        let typeId = 510
        news_type.forEach((val, idx) => {
            if (type.indexOf(val.typeName) > -1) {
                typeId = val.typeId
            }
        })
        request(api_url + 'news/list?typeId=' + typeId + '&page=1', async (err, response, body) => {
            if (err) {
                resolve(null)
            } else {
                let data = JSON.parse(body)
                if (data && data.code == 1 && data.data) {
                    let idx = random(0, 9)
                    let news = data.data[idx]
                    if (news) {
                        let detail = await news_detail(news.newsId)
                        if (detail) {
                            let redirect_url = 'http://news.xuankejia.cn/' + news.newsId
                            const urlLink = new UrlLink({
                                description: detail.source,
                                thumbnailUrl: detail.cover,
                                title: detail.title,
                                url: redirect_url,
                            })
                            resolve(urlLink)
                            return
                        }
                        resolve(null)
                    }
                    resolve(null)
                } else {
                    resolve(null)
                }
            }
        })
    })
}



/**
 * goods
 * @param {*} user 
 */
let goods = user => {
    return new Promise((resolve, reject) => {
        request(api_goods_url, (err, response, body) => {
            if (err) {
                resolve(null)
            } else {
                let data = JSON.parse(body);
                let item = null
                if (data && data.data.length > 0) {
                    let idx = random(0, data.data.length - 1)
                    item = data.data[idx]
                }
                if (!item) {
                    log('can not read item from:' + data)
                    resolve(null)
                    return
                }
                let goods_id = item.itemid
                let goods_title = '【选客家】' + item.itemtitle
                let goods_img = item.itempic
                let goods_desc = item.itemdesc || item.itemtitle

                let redirect_url = 'http://tk.xuankejia.cn/item/' + goods_id

                const urlLink = new UrlLink({
                    description: goods_desc,
                    thumbnailUrl: goods_img,
                    title: goods_title,
                    url: redirect_url,
                })
                resolve(urlLink)
            }
        })
    })
}

module.exports = {
    daily_word
    , goods
    , joke
    , weather
    , news
}