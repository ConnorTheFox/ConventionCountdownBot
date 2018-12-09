const online = require('is-reachable')
const process = require('process')
const debug = require('debug')('cron')
const db = require('./src/dbcontroller')
const pic = require('./src/pic.js')
const returns = require('./src/returns.js')
const days = require('./src/days.js')
const bot = require('./src/bots.js').bot
const Twitter = require('twit')
const gm = require('gm')
const isTwitter = process.env.TWITTER

let twitter
if (isTwitter) {
	twitter = new Twitter({
		consumer_key: process.env.TWITTER_KEY,
		consumer_secret: process.env.TWITTER_SECRET,
		access_token: process.env.ACCESS_KEY,
		access_token_secret: process.env.ACCESS_SECRET
	})
}

async function sendDaily() {
	let day = days.until()
	let returned
	try {
		returned = await pic.genImage()
	} catch (e) {
		console.log(e)
	}
	debug('Got photo')
	let captionString = `${returns.createCaption(day)} \n\n📸: [${returned.name}](${returned.url})`

	if (returned.buffer.toString().length / 1000000 > 5) {
		try {
			let resizeImg = await resizeImage(returned.buffer, 0.10)
			let scale = 0.10
			do {
				resizeImg = await resizeImage(img, scale)
				scale += 0.10
			} while (resizeImage.size > 5)
			returned.buffer = resizeImg.img
		} catch (e) {
			console.error(e)
		}
	}
	function resizeImage(imgBuffer, scale) {
		return new Promise((res, rej) => {
			gm(imgBuffer)
				.size((err, size) => {
					if (!err) {
						let resizeWidth = size.width - (size.width * scale)
						let resizeHeight = size.height - (size.height * scale)
						gm(imgBuffer)
							.resizeExact(resizeWidth, resizeHeight)
							.toBuffer('JPEG', (err, buffer) => {
								if (!err) {
									imgSize = buffer.toString().length / 1000000
									res({ img: buffer, size: imgSize })
								} else {
									console.error(err)
								}
							})
					} else {
						console.error(err)
					}
				})
		})
	}
	if (isTwitter) {
		let twitterCaptionString = `${returns.createCaption(day)} \n\n📸: ${returned.url}, ${returned.name}`
		try {
			let mediaID = (await twitter.post('media/upload', { media_data: returned.buffer.toString('base64') })).data.media_id_string
			debug('Media ID ' + mediaID)
			await twitter.post('statuses/update', { status: twitterCaptionString, media_ids: mediaID })
			debug('Sent Tweet')
		} catch (e) {
			console.error(e)
		}
	}
	let users = await db.find({}, 'users')
	let photoId
	for (let x in users) {
		try {
			let sent = await bot.sendPhoto(users[x].chatId, (photoId || returned.buffer), { caption: captionString, parse_mode: 'Markdown' }, { contentType: 'image/jpeg' })
			photoId = sent.photo[(sent.photo.length - 1)].file_id
			returns.generateLog((sent.chat.first_name || sent.chat.title), null, 'daily')
			debug('Sent image')
		} catch (e) {
			if (e.response.body.error_code === 403) {
				db.remove(users[x], 'users')
			}
		}
	}
	process.exit(0)
}


let day = days.until()
if (day >= 1) {
	online('https://api.telegram.org').then(status => {
		if (status) {
			sendDaily()
		} else {
			let waitForOnline = setInterval(async () => {
				if (await online('https://api.telegram.org')) {
					clearInterval(waitForOnline)
					sendDaily()
				}
			}, 60000)
		}
	})
} else {
	process.exit(0)
}