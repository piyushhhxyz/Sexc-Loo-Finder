const { Client, MessageMedia, LocalAuth} = require('whatsapp-web.js');

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

// Event fired when a message is received
client.on('message', async (msg) => {
    // if (msg.body.toLowerCase() === 'hii') {
    //     // Send an image in response to "hii"
    //     const media = MessageMedia.fromFilePath('BOT/assets/images/1.png');
    //     await client.sendMessage(msg.from, media);
    // } else if (msg.hasMedia && msg.body.toLowerCase() === 'ok') {
    //     // Check if the message is a reply to an image and contains "ok"
    //     const destinationNumber = '9355420878';
    //     console.log('hii')
    //     const messageText = 'a user is just heading your way, please be kind and welcome him he\'s 0.2kms away';
    //     await client.sendMessage(destinationNumber, messageText);
    // }
    if (msg.body.toLowerCase() === 'hii') {
        const destinationNumber = '918953815800'; // Replace with the desired number
        const messageText = 'a user is just heading your way, please be kind and welcome him he\'s 0.2kms away';
        await client.sendMessage(destinationNumber + '@c.us', messageText); // Added @c.us
        await msg.reply('done, shop partner has been notified');

    }
});

// Start the WhatsApp bot
client.initialize();
