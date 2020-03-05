# wechat-bot
wechat bot with some [functions](#functions) depends on [wechaty](https://github.com/wechaty/wechaty) 

## run with local node_modules
- `git clone https://github.com/rench/wechat-bot `
- `npm i`
- put your own padplus token in `./lib/config.js`
- `node index.js`

## run with docker

```
#?nix
export WECHATY_PUPPET=wechaty-puppet-padplus
#windows
set WECHATY_PUPPET wechaty-puppet-padplus

docker run -ti --rm --volume="$(pwd)":/bot -e WECHATY_PUPPET=wechaty-puppet-padplus zixia/wechaty index.js

```
## functions
- reply a daily word with keyword:`每日语句`
- reply a joke with keyword: `笑话`
- reply a weather with keyword: `成都天气`
- reply a random taobao item with keyword: `购物`

## next year plan
- Personal reminder
- Music search
- Movie search
- News read
## other link
- [wechaty](https://github.com/wechaty/wechaty)
- [wechaty-puppet-padplus](https://github.com/wechaty/wechaty-puppet-padplus)
