const puppeteer = require('puppeteer');
const axios = require('axios');
const moment = require('moment-timezone');

let browser; 

// Function to get a timestamp in the [HH:mm DD/MM/YYYY] format in the Jakarta timezone
function getTimestamp() {
  const currentDate = moment().tz('Asia/Jakarta');
  return `[${currentDate.format('HH:mm DD/MM/YYYY')}]`;
}

// Function to check if a user is currently live streaming
async function checkLiveStatus(username) {
  try {
    const page = await browser.newPage();

    const profileUrl = `https://www.tiktok.com/@${username}`;
    await page.goto(profileUrl);

    await page.waitForSelector('a[target="tiktok_live_view_window"]', { timeout: 60000 });

    const liveLink = await page.$eval('a[target="tiktok_live_view_window"]', (link) => link.href);

    await page.close(); 

    return !!liveLink;
  } catch (error) {
    return false;
  }
}

// Function to send notifications to Telegram
async function sendTelegramNotification(username) {
  try {
    const telegramApiUrl = 'https://api.telegram.org/xxxxxxx/sendMessage'; // Telegram Token
    const chatId = 'xxxxxxx'; // Chat ID

    const response = await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: `${username} is currently live streaming\n\nhttps://www.tiktok.com/@${username}/live`,
    });

    if (response.status === 200) {
      console.log(`${getTimestamp()} User @${username} is live, notification sent to Telegram.`);
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
        await sendTelegramNotification(username);
        lastNotificationTimes[username] = currentTime;
      } else {
        console.log(`${getTimestamp()} User @${username} is live streaming, but notifications are only sent every 3 hours.`);
      }
    } else {
      console.log(`${getTimestamp()} User @${username} is not currently live streaming.`);
    }
  } catch (error) {
    console.error(`${getTimestamp()} Failed to check live streaming status and send notifications for @${username}: ${error.message}`);
  }
}

// List of usernames to be checked
const usernames = ['jessijkt48', 'jkt48.official'];

// Set a maximum of 15 listeners (or as needed)
process.setMaxListeners(15);

// Close the browser when the program is stopped
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

// Open browser
(async () => {
  browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications'],
  });

  // Check live streaming status and send notifications right now for each username
  for (const username of usernames) {
    await checkLiveStatusAndSendNotification(username);
  }

  // Check live streaming status and send notifications every 3 minutes for each username
  setInterval(async () => {
    for (const username of usernames) {
      await checkLiveStatusAndSendNotification(username);
    }
  }, 3 * 60 * 1000);
})();
