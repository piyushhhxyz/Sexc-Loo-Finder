const { Client, MessageMedia, LocalAuth, Location} = require('whatsapp-web.js');

const client = new Client({
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    authStrategy: new LocalAuth(),
});

client.on('ready', () => {
    console.log('WhatsApp Bot is ready!');
});

client.on('message', async (message) => {
    if (message.body === 'hii') {
        const media = await MessageMedia.fromUrl('https://imgtr.ee/images/2024/04/14/5385afb84925f51e6912498c64a8aec4.jpeg', { unsafeMime: true });
        await client.sendMessage(message.from, media, { caption: 'this is my caption' });

    }
});

// Start the WhatsApp bot
client.initialize();
