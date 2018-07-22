const process = require('process')
const con = process.env.CON

module.exports = {
   owner: [], //Your chat ID goes here, if there is mor than one just add it on.
   date: '', //Date for convention goes here. EX: 2018, 11, 29
   font: '', //Font for picture goes here. Just the name including extension.
   'ThreeDayPos': 4, //Each of these is for the picture. Adjust these if your font is not centered in the picture. Bigger number moves it to the left and vise versa.
   'TwoDayPos': 3.1,
   'OneDayPos': 2.4,

   info: '', //Text for info command
   start: '', //Text for start command
   countdown: {
      start: 'Subscribed, thank you!', //Text when someone subscribes to countdown
      stop: 'Removed from daily countdown.', //Text for stopping countdown
      else: {
          start: 'Im sorry, you are already subscribed', //Text for if a user is already subscribed
          stop: 'Im sorry, you are not found in the database.' //Text for is a user is not subscribed
      }
   },

   help: { //DO NOT EDIT
      'Subscribe To Countdown': 'startcountdown',
      'Unsubscribe From Countdown': 'stopcountdown',
      Info: 'info',
      'Days Left': 'daysleft'
   },
   con: con
}