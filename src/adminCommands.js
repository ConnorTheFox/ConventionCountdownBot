const Promise = require('bluebird')
const db = require('./dbcontroller.js')
const bot = require('./bots.js').bot
const fs = Promise.promisifyAll(require('fs-extra'))
const process = require('process')
const con = process.env.CON
const path = require('path')
const conInfo = require(path.join(`../${con}/convention.js`))

exports.getUsers = async function (msg) {
    if (conInfo.owner.includes(msg.chat.id)) {
        let tempStr = ''
        let users = await db.find({}, 'users')
        users.forEach(user => {
            tempStr += `${user.name}\n`
        })
        tempStr += users.length
        bot.sendMessage(msg.chat.id, tempStr)
    }
}

exports.getLogs = async function (msg) {
    if (conInfo.owner.includes(msg.chat.id)) {
        let tempStr = ''
        let log = await fs.readFileAsync(`${con}/bot.log`, 'utf8')
        let split = log.split('\n').reverse()
        for (let x = 1; x <= 6; x++) {
            tempStr += `${split[x]}\n`
        }
        bot.sendMessage(msg.chat.id, tempStr)
    }
}

exports.broadcast = async function (msg, match) {
    if (conInfo.owner.includes(msg.chat.id)) {
        let users = await db.lookup({})
        users.forEach(id => {
            bot.sendMessage(id.chatId, match[1], { parse_mode: 'Markdown' })
        })
    }
}

exports.test = function (msg, match) {
    if (conInfo.owner.includes(msg.chat.id)) {
        bot.sendMessage(msg.chat.id, match[1], { parse_mode: 'Markdown' })
    }
}
