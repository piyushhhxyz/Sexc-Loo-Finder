const { Client, MessageMedia, LocalAuth, Location} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { getAIGeneratedAnswer }  = require('./assistant');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');


const client = new Client({
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    authStrategy: new LocalAuth(),
});
client.on('ready', () => console.log('Client is ready!'));
client.on('qr', qr => qrcode.generate(qr, {small: true}));

const csvWriter = createObjectCsvWriter({
    path: 'USERs.csv',
    header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'sender', title: 'Sender' },
        { id: 'messageCount', title: 'Message Count' },
        { id: 'message', title: 'Message' },
    ],
});
const messageCounts = {};
let nearestShops = [];
const logAndWriteToCSV = async(data) => {
    await csvWriter.writeRecords([data]);
}


client.on('message', async(message) => {

    const chat = await message.getChat();
    const sender = message.from;
    const messageContent = message.body.toLowerCase().trim();
    messageCounts[sender] = (messageCounts[sender] || 0) + 1;

    const logData = {
        timestamp: new Date().toLocaleString(),
        sender: sender,
        messageCount: messageCounts[sender],
        message: messageContent,
    };

    await logAndWriteToCSV(logData); // Log and write data to CSV

    if (message.body.toLowerCase() === 'hii') {
        chat.sendStateTyping();
        setTimeout(() => {
            chat.sendMessage('Hello, I am LooLoo AI!');
        }, 2000);
        // await message.reply('Hello, I am LooLoo AI!');
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
                chat.sendStateTyping();
                chat.sendMessage(`Finding royal-loos near: ${address}`);
                // await message.reply(`Finding royal-loos near: ${address}`);

                const nearestShopsResponse = await axios.get('http://localhost:3000/api/shops/nearest', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        longitude: longitude.toString(),
                        latitude: latitude.toString(),
                    },
                });
                nearestShops = nearestShopsResponse.data;
                console.log(nearestShops)

                for (let i = 0; i < Math.min(nearestShops.length, 3); i++) {
                    setTimeout(async () => {
                        const shop = nearestShops[i];
                        const distanceInKm = Math.floor(shop.distance / 1000);
                        let media;
                        if(i===0) media = MessageMedia.fromFilePath('BOT/data/1.jpeg');
                        if (i===1) media = MessageMedia.fromFilePath('BOT/data/2.jpeg');
                        if (i===2) media = MessageMedia.fromFilePath('BOT/data/3.jpeg');
                        const messageText = `Name: ${shop.name}\nGenre: ${shop.genre}\nDistance: ${(distanceInKm)} kms\n`;
                        console.log(messageText)

                        chat.sendStateTyping();
                        chat.sendMessage(media, { caption: messageText });
                        // await client.sendMessage(message.from, media, { caption: messageText });
                    },(i + 1) * 2000); 
                }
                chat.sendStateTyping();
                chat.sendMessage('type "select 1/2/3" to select and expand the shop details');
            } else {
                console.error('Failed to fetch location:', data.error || response.statusText);
                chat.sendStateTyping();
                chat.sendMessage(`LooLoo🔭 is facing an error fetching location`);
                // await message.reply(`LooLoo🔭 is facing an error fetching location`);
            }
        } catch (error) {
            console.error('Error fetching location:', error.message);
            chat.sendStateTyping();
            chat.sendMessage(`LooLoo🔭 is facing an error fetching location`);
            // await message.reply(`LooLoo🔭 is facing an error fetching location`);
        }
    } 
    else if (message.body.toLowerCase().startsWith('select')) {
        const number = parseInt(message.body.split(' ')[1]);
        if (isNaN(number) || number < 1 || number > 3) {
            chat.sendStateTyping();
            chat.sendMessage('Invalid SHOP. Please select a SHOP from 1 to 3.');
            // await message.reply('Invalid SHOP. Please select a SHOP from 1 to 3.');
        } 
        else if (nearestShops.length >= number) {
            const selectedShop = nearestShops[number - 1];
            const distanceInKm = Math.floor(selectedShop.distance / 1000);
            const media = await MessageMedia.fromUrl(selectedShop.washroomImages[0], { unsafeMime: true });
            const messageText = `Name: ${selectedShop.name}\nDistance: ${distanceInKm} kms\nRating: ${selectedShop.rating}⭐\n Facilities: ${selectedShop.address}`;
            await client.sendMessage(message.from, media, { caption: messageText });

            const latitude = 12.9715987;
            const longitude = 77.5945627;
            const location = new Location(latitude, longitude);
            chat.sendStateTyping();
            chat.sendMessage(location);
            // client.sendMessage(message.from, location);
            setTimeout(() => {
                chat.sendStateTyping();
                chat.sendMessage('type "confirm 1/2/3" to confirm that shop');
            }, 3000);
        } else {
            chat.sendStateTyping();
            chat.sendMessage(`No shop found for selection ${number}.`);
            // await message.reply(`No shop found for selection ${number}.`);
        }
    }
    else if (message.body.toLowerCase().startsWith('confirm')) {
        const number = parseInt(message.body.split(' ')[1]);
        if (isNaN(number) || number < 1 || number > 3) await message.reply('Invalid SHOP. Please select a SHOP from 1 to 3.');
        else if (nearestShops.length >= number) {
            const destinationNumber = '919355420878'; 
            const messageText = `Heyoo! You have a new visitor! ${timestampTo12Hour(message.timestamp)}.\nA user is heading your way. \nBe ready to welcome them with a smile.\nThey're just 0.2kms away`;
            console.log(firstMessage.from, destinationNumber, messageText)
            await client.sendMessage(destinationNumber + '@c.us', messageText); // Added @c.us
            chat.sendStateTyping();
            chat.sendMessage('DONE, shop partner has been notified \nYou are welcome to use their restrooms 🚀');
            // await message.reply(`DONE, shop partner has been notified \nYou are welcome to use their restrooms 🚀`);
        }
    }
    else {
        chat.sendStateTyping();
        const answer = await getAIGeneratedAnswer(message.body);
        chat.sendMessage(answer);
        // await message.reply(answer);
    }
});

function timestampTo12Hour(timestamp) {
    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2); // Add leading zero if needed
    const seconds = ('0' + date.getSeconds()).slice(-2); // Add leading zero if needed
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${meridiem}`;
}

client.initialize();
