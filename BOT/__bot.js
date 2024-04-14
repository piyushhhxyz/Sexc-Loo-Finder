const { Client, MessageMedia, LocalAuth, Location} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { getAIGeneratedAnswer }  = require('./assistant');


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

let nearestShops = [];
client.on('message', async(message) => {
  
    if (message.body.toLowerCase() === 'hii') {
        await message.reply('Hello, I am LooLoo AI!');
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
                await message.reply(`Finding royal-loos near: ${address}`);

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

                for (let i = 0; i < Math.min(nearestShops.length, 3); i++) {
                    setTimeout(async () => {
                        const shop = nearestShops[i];
                        const distanceInKm = Math.floor(shop.distance / 1000);
                        const imagePath = `BOT/assets/images/7.png`;
                        const media = MessageMedia.fromFilePath(imagePath);
                        const messageText = `Name: ${shop.name}\nGenre: ${shop.genre}\nDistance: ${(distanceInKm)} kms`;

                        client.sendMessage(message.from, media, { caption: messageText });
                    },(i + 1) * 2000); 
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
    else if (message.body.toLowerCase().startsWith('select')) {
        const number = parseInt(message.body.split(' ')[1]);
        if (isNaN(number) || number < 1 || number > 3) {
            await message.reply('Invalid SHOP. Please select a SHOP from 1 to 3.');
        } 
        else if (nearestShops.length >= number) {
            const selectedShop = nearestShops[number - 1];
            const distanceInKm = Math.floor(selectedShop.distance / 1000);
            const messageText = `
                Name: ${selectedShop.name} 
                Distance: ${distanceInKm} kms
            `;
            await message.reply(messageText);

            const latitude = 12.9834;
            const longitude = 77.5837;
            const location = new Location(latitude, longitude);
            client.sendMessage(message.from, location);
        } else {
            await message.reply(`No shop found for selection ${number}.`);
        }
    }
    else if (message.body.toLowerCase().startsWith('confirm')) {
        const number = parseInt(message.body.split(' ')[1]);
        if (isNaN(number) || number < 1 || number > 3) await message.reply('Invalid SHOP. Please select a SHOP from 1 to 3.');
        else if (nearestShops.length >= number) {
            const destinationNumber = '918953815800'; 
            const messageText = `Heyoo! You have a new visitor! ${timestampTo12Hour(message.timestamp)}. 
            A user is heading your way. 
            Be ready to welcome them with a smile. 
            They're just 0.2kms away`;
            await client.sendMessage(destinationNumber + '@c.us', messageText); // Added @c.us
            await message.reply('done, shop partner has been notified');
        }
    }
    else {
        const answer = await getAIGeneratedAnswer(message.body);
        await message.reply(answer);
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
