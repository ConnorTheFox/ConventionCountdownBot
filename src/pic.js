const Promise = require('bluebird')
const path = require('path')
const gm = require('gm')
const fs = Promise.promisifyAll(require('fs-extra'))
const color = require('node-vibrant')
const debug = require('debug')('pic')
const days = require('./days.js')
const log = require('./logController.js')
const db = require('./dbcontroller.js')
const process = require('process')
const con = process.env.CON
const conInfo = require(path.join(`../${con}/convention.js`))


const genImage = function () {
	return new Promise(async (res, rej) => {
		let photoCredit = await db.distinct('name', { used: false }, 'credit')
		let photoName = photoCredit[Math.floor(Math.random() * photoCredit.length)]
		let photoArr = await db.find({ used: false, name: photoName }, 'credit')
		let photo = photoArr[Math.floor(Math.random() * photoArr.length)]
		await db.update(photo, { used: true }, 'credit')
		if (path.parse(photo.photo).ext === '.jpg') {
			gm(path.join(`${con}/pics/` + photo.photo)).size((err, num) => {
				if (!err) {
					color.from(path.join(`${con}/pics/` + photo.photo)).getPalette((err, palette) => {
						if (!err) {
							debug('Got photo colors.')
							writeImage(num.width, num.height, palette.Vibrant._rgb, photo.photo)
						} else {
							rej(err)
						}
					})
				} else {
					rej(err)
				}
			})
		}

		function writeImage(width, height, palette, photo) {
			const day = days.until()
			const landscapeHeight = 300 //Constant for landscape height
			const portraitHeight = 300 //Constant for portrait height
			let textW
			let textH
			//Larger Number moves it to the left, Smaller moves it down
			const daypos = {
				3: {
					landscape: [conInfo.ThreeDayPos, landscapeHeight],
					portrait: [conInfo.ThreeDayPos, portraitHeight]
				},
				2: {
					landscape: [conInfo.TwoDayPos, landscapeHeight],
					portrait: [conInfo.TwoDayPos, portraitHeight]
				},
				1: {
					landscape: [conInfo.OneDayPos, landscapeHeight],
					portrait: [conInfo.OneDayPos, portraitHeight]
				}
			}
			let determinePosition = day.toString().length
			if (width > height) {
				textW = width / daypos[determinePosition].landscape[0]
				textH = height - daypos[determinePosition].landscape[1]
			} else {
				textW = width / daypos[determinePosition].portrait[0]
				textH = height - daypos[determinePosition].portrait[1]
			}
			let textColor = `rgb(${palette[0]}, ${palette[1]}, ${palette[2]})`
			debug('Preparing to generate photo.')
			gm(path.join(`${con}/pics/` + photo))
				.fill(textColor)
				.drawText(textW, textH, day)
				.font(path.join(`${con}/${conInfo.font}`))
				.fontSize(width / conInfo.fontSize) //Smaller number makes it larger
				.write(path.join(`${con}/countdown/` + day.toString() + '.jpg'), (err) => {
					if (!err) {
						let file = fs.readFile(path.join(`${con}/countdown/` + day + '.jpg'), (err, data) => {
							if (!err) {
								debug('Photo gen complete writing file.')
								db.find({ photo: photo }, 'credit').then(credit => {
									res({
										buffer: data,
										name: credit[0].name,
										url: credit[0].url
									})
								})
							} else {
								rej(err)
							}
						})
					}
				})
		}
	})
}

exports.genImage = genImage
