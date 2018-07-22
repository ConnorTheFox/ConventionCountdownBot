const process = require('process')
const con = process.env.CON
const path = require('path')
const conInfo = require(path.join(`../${con}/convention.js`))

const until = function() {
   let con = new Date(conInfo.date).getTime() //Edit the date here for your con
   let now = Date.now()
   let until = con - now
   return Math.ceil(until / 86400000)
}

exports.until = until
