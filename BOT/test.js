const { Client, MessageMedia, LocalAuth, Location} = require('whatsapp-web.js');

const client = new Client({
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    authStrategy: new LocalAuth(),
});

client.on('ready', () => console.log('WhatsApp Bot is ready!'));

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    if (chat) {
        const media = MessageMedia.fromFilePath('BOT/data/1.jpeg');
        chat.sendStateTyping();
        chat.sendMessage(media, { caption: 'messageText' });
    }
});

client.initialize();

