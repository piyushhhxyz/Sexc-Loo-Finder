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
        console.log(latitude, longitude)
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (response.ok) {
              const address = data.display_name;
              console.log('Current location:', address);
              await message.reply(`finding royal-loos near: ${address}`);

            } else {
                console.error('Failed to fetch location:', data.error || response.statusText);
                await message.reply(`LooLoo🔭 is facing error fetching location`);
            }
          } catch (error) {
              console.error('Error fetching location:', error.message);
              await message.reply(`LooLoo🔭 is facing error fetching location`);
          }
    }
    // else {
    //     const answer = await getAIGeneratedAnswer(message.body);
    //     await message.reply(answer);
    // } 
});

client.initialize();
