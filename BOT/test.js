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
    if (msg.body === 'hii') {
        const media = await MessageMedia.fromUrl('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP788Hx5vg772lDwwBY44HRI3Q9BBDtE1RsA&s', { unsafeMime: true });
        await client.sendMessage(message.from, media, { caption: 'this is my caption' });

    }
});

// Start the WhatsApp bot
client.initialize();
