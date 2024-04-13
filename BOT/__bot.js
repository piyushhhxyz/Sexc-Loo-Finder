const { Client,LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// const { getAIGeneratedAnswer }  = require('./assistant');


const client = new Client({
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    authStrategy: new LocalAuth(),
});

client.on('ready', () => console.log('Client is ready!'));

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
client.on('message', async(message) => {
    if (message.body.toLowerCase() === 'hi') {
        await message.reply('Hello!');
    }
    else if (message.location) {
        const { latitude, longitude } = message.location;
        await message.reply(`You shared your location: Latitude ${latitude}, Longitude ${longitude}`);
    }
    // else {
    //     const answer = await getAIGeneratedAnswer(message.body);
    //     await message.reply(answer);
    // } 
});

client.initialize();
