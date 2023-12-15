# TikTok Live to Telegram Notification

## Description
This script allows you to monitor TikTok users' live streaming status and send notifications to Telegram when they are live.

## Requirements
- Node.js installed on your computer.
- A TikTok account to obtain user profile links.
- A Telegram account and bot token to send notifications to Telegram.

## Usage

1. **Install Node.js**: Ensure that Node.js is installed on your computer. You can download it from the [Node.js website](https://nodejs.org/).

2. **Clone or Download the Repository**: Clone this repository to your computer or download it as a ZIP file.

3. **Install Dependencies**: Open a terminal or command prompt, navigate to the directory where you've saved this repository, and run the following command to install the required dependencies.

    ```bash
    npm install
    ```

4. **Configure Telegram Token and Chat ID**: You need to replace the [Telegram token](https://www.google.com/search?q=how+to+get+telegram+token) and [chat ID](https://www.google.com/search?q=How+to+Find+a+Chat+ID+in+Telegram&) in the script with your Telegram account information. You can do this by editing the following part of the script:

    ```javascript
    const telegramApiUrl = 'https://api.telegram.org/xxxxxxx/sendMessage'; // Telegram Token
    const chatId = 'xxxxxxx'; // Chat id
    ```

    Replace `'xxxxxxx'` with the appropriate token and chat ID.

5. **List TikTok Usernames to Monitor**: You can add or remove TikTok usernames you want to monitor by editing the `usernames` array in the script:

    ```javascript
    const usernames = ['jessijkt48', 'jkt48.official'];
    ```

6. **Run the Script**: Open the terminal or command prompt again, navigate to the directory where you've saved the repository, and run the script with the following command:

    ```bash
    node run.js
    ```

    The script will check the live streaming status and send a notification once when it's first run and then every 3 minutes.

7. **Stopping the Script**: To stop the script, simply press `Ctrl + C` in the terminal where the script is running.

## Notes
- Make sure to keep your Telegram token and other sensitive information secure and not share it with others.
- You can add more TikTok usernames to the `usernames` array to monitor more users simultaneously.

By following the steps above, you'll be able to monitor the live streaming status of TikTok users you select and receive notifications on Telegram when they go live.
