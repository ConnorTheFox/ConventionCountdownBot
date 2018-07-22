const process = require('process')
const con = process.env.CON

const simpleLog = require('simple-node-logger')

opts = {
    logFilePath: `${con}/bot.log`,
    timestampFormat: 'MM-DD-YYYY'
}

const log = simpleLog.createSimpleLogger(opts)

module.exports = function (str) {
    log.info(`${str}`)
}