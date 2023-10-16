const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

// Function to get a timestamp in the [HH:mm DD/MM/YYYY] format in the Jakarta timezone
function getTimestamp() {
  const currentDate = moment().tz('Asia/Jakarta');
  const hours = currentDate.format('HH');
  const minutes = currentDate.format('mm');
  const day = currentDate.format('DD');
  const month = currentDate.format('MM');
  const year = currentDate.format('YYYY');

  return `[${hours}:${minutes} ${day}/${month}/${year}]`;
}

// Function to check if a user is currently live streaming
async function checkLiveStatus(username) {
  try {
    const profileUrl = `https://www.tiktok.com/@${username}`;
    const response = await axios.get(profileUrl);
    const html = response.data;

    // Using cheerio to parse HTML
    const $ = cheerio.load(html);
    const liveLink = $('a[target="tiktok_live_view_window"]').attr('href');

    // If there's a live link, the user is live streaming
    if (liveLink) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(`${getTimestamp()} Failed to check live streaming status: ${error.message}`);
  }
}

// Function to send notifications to Telegram
async function sendTelegramNotification(message) {
  try {
    const telegramApiUrl = 'https://api.telegram.org/xxxxxxx/sendMessage'; // Telegram Token
    const chatId = 'xxxxxxx'; // Chat ID

    const response = await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: message,
    });

    // Checking the notification sending status
    if (response.status === 200) {
      console.log(`${getTimestamp()} Notification sent to Telegram successfully.`);
    } else {
      throw new Error(`${getTimestamp()} Failed to send notification to Telegram.`);
    }
  } catch (error) {
    throw new Error(`${getTimestamp()} Failed to send notification to Telegram: ${error.message}`);
  }
}

// Variable to track the last notification time for each username
const lastNotificationTimes = {};

// Function to check live streaming status and send notifications to Telegram
async function checkLiveStatusAndSendNotification(username) {
  try {
    const isLive = await checkLiveStatus(username);

    if (isLive) {
      const currentTime = new Date();

      if (!lastNotificationTimes[username] || currentTime - lastNotificationTimes[username] >= 3 * 60 * 60 * 1000) {
        const message = `${username} is currently live streaming\n\nhttps://www.tiktok.com/@${username}/live`;
        await sendTelegramNotification(message);
        lastNotificationTimes[username] = currentTime;
      } else {
        console.log(`${getTimestamp()} User @${username} is live streaming, but notifications are only sent every 3 hours.`);
      }
    } else {
      console.log(`${getTimestamp()} User @${username} is not currently live streaming.`);
    }
  } catch (error) {
    console.error(`${getTimestamp()} Failed to check live streaming status and send notifications for user @${username}:`, error.message);
  }
}

// List of usernames to be checked
const usernames = ['jessijkt48', 'jkt48.official']; 

// Check live streaming status and send notifications right now for each username
usernames.forEach((username) => {
  checkLiveStatusAndSendNotification(username);
});

// Check live streaming status and send notifications every 3 minutes for each username
setInterval(() => {
  usernames.forEach((username) => {
    checkLiveStatusAndSendNotification(username);
  });
}, 3 * 60 * 1000);
