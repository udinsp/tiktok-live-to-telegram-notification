const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

// Fungsi untuk mendapatkan timestamp dengan format [HH:mm DD/MM/YYYY] di zona waktu Jakarta
function getTimestamp() {
  const currentDate = moment().tz('Asia/Jakarta');
  const hours = currentDate.format('HH');
  const minutes = currentDate.format('mm');
  const day = currentDate.format('DD');
  const month = currentDate.format('MM');
  const year = currentDate.format('YYYY');

  return `[${hours}:${minutes} ${day}/${month}/${year}]`;
}

// Fungsi untuk memeriksa apakah pengguna sedang melakukan siaran langsung (live)
async function checkLiveStatus(username) {
  try {
    const profileUrl = `https://www.tiktok.com/@${username}`;
    const response = await axios.get(profileUrl);
    const html = response.data;

    // Menggunakan cheerio untuk memparsing HTML
    const $ = cheerio.load(html);
    const liveLink = $('a[target="tiktok_live_view_window"]').attr('href');

    // Jika terdapat tautan live, pengguna sedang melakukan siaran langsung
    if (liveLink) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(`${getTimestamp()} Gagal memeriksa status siaran langsung: ${error.message}`);
  }
}

// Fungsi untuk mengirim notifikasi ke Telegram
async function sendTelegramNotification(message) {
  try {
    const telegramApiUrl = 'https://api.telegram.org/xxxxxxx/sendMessage'; // Token Telegram
    const chatId = 'xxxxxxx'; // Chat id

    const response = await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: message,
    });

    // Memeriksa status pengiriman notifikasi
    if (response.status === 200) {
      console.log(`${getTimestamp()} Notifikasi berhasil dikirim ke Telegram.`);
    } else {
      throw new Error(`${getTimestamp()} Gagal mengirim notifikasi ke Telegram.`);
    }
  } catch (error) {
    throw new Error(`${getTimestamp()} Gagal mengirim notifikasi ke Telegram: ${error.message}`);
  }
}

// Variabel untuk melacak waktu terakhir notifikasi dikirim untuk setiap username
const lastNotificationTimes = {};

// Fungsi untuk melakukan pengecekan status siaran langsung dan mengirim notifikasi ke Telegram
async function checkLiveStatusAndSendNotification(username) {
  try {
    const isLive = await checkLiveStatus(username);

    if (isLive) {
      const currentTime = new Date();

      if (!lastNotificationTimes[username] || currentTime - lastNotificationTimes[username] >= 3 * 60 * 60 * 1000) {
        const message = `${username} sedang melakukan siaran langsung\n\nhttps://www.tiktok.com/@${username}/live`;
        await sendTelegramNotification(message);
        lastNotificationTimes[username] = currentTime;
      } else {
        console.log(`${getTimestamp()} Pengguna @${username} sedang melakukan siaran langsung, tetapi notifikasi hanya dikirim setiap 3 jam.`);
      }
    } else {
      console.log(`${getTimestamp()} Pengguna @${username} tidak sedang melakukan siaran langsung.`);
    }
  } catch (error) {
    console.error(`${getTimestamp()} Gagal memeriksa status siaran langsung dan mengirim notifikasi untuk pengguna @${username}:`, error.message);
  }
}

// Daftar username yang ingin diperiksa
const usernames = ['jessijkt48', 'jkt48.official']; 

// Memeriksa status siaran langsung dan mengirim notifikasi saat ini untuk setiap username
usernames.forEach((username) => {
  checkLiveStatusAndSendNotification(username);
});

// Memeriksa status siaran langsung dan mengirim notifikasi setiap 3 menit untuk setiap username
setInterval(() => {
  usernames.forEach((username) => {
    checkLiveStatusAndSendNotification(username);
  });
}, 3 * 60 * 1000);
