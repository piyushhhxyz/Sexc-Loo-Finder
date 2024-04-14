const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
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
        console.log(latitude, longitude);
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                const address = data.display_name;
                console.log('Current location:', address);
                await message.reply(`Finding royal-loos near: ${address}`);

                //dummy
                longitude_dummy = 77.5946;
                latitude_dummy = 12.9716;
                const nearestShopsResponse = await axios.get('http://localhost:3000/api/shops/nearest', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        longitude: longitude.toString(),
                        latitude: latitude.toString(),
                    },
                });
                const nearestShops = nearestShopsResponse.data;

                // Send each nearest shop in a separate message with a delay
                for (let i = 0; i < Math.min(nearestShops.length, 3); i++) {
                    setTimeout(async () => {
                        const shop = nearestShops[i];
                        const messageText = `
                            Name: ${shop.name}
                            Genre: ${shop.genre}
                            Distance: ${shop.distance.toFixed(2)} meters
                            Washroom Images: ${shop.washroomImages.join(', ')}
                        `;
                        await message.reply(messageText);
                    }, (i + 1) * 1000); // 1-second delay between each message
                }
            } else {
                console.error('Failed to fetch location:', data.error || response.statusText);
                await message.reply(`LooLoo🔭 is facing an error fetching location`);
            }
        } catch (error) {
            console.error('Error fetching location:', error.message);
            await message.reply(`LooLoo🔭 is facing an error fetching location`);
        }
    } 
    // else {
    //     const answer = await getAIGeneratedAnswer(message.body);
    //     await message.reply(answer);
    // }
});

client.on('chat-update', async (chat) => {
    if (chat.unreadCount > 0) {
        const messages = await chat.fetchMessages();
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.fromMe) {
            await lastMessage.setTyping();
        }
    }
});
// Send voice message
async function sendVoiceMessage(chatId, audioBuffer) {
    const media = new MessageMedia('audio/ogg', audioBuffer);
    const chat = await client.getChatById(chatId);
    await chat.sendMessage(media, { sendAudioAsVoice: true });
}

// Send media message (image, video, document)
async function sendMediaMessage(chatId, mediaType, mediaURL, caption) {
    const media = new MessageMedia(mediaType, mediaURL);
    const chat = await client.getChatById(chatId);
    await chat.sendMessage(media, { caption });
}

client.initialize();
