const { Client, MessageMedia, LocalAuth, Location } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');

const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    // authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        authStrategy:  new LocalAuth(),
    }
});

client.on('ready', async () => {
    console.log('WhatsApp Bot is ready!');
    try {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser'
        });
        // Add your Puppeteer code here, such as navigating to a webpage or taking a screenshot
        await browser.close(); // Close the browser after finishing your Puppeteer tasks
    } catch (error) {
        console.error('Error launching Puppeteer:', error);
    }
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    if (chat) {
        chat.sendStateTyping();
        chat.sendMessage('I am a bot');
    }
});

client.initialize();
