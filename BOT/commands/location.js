// locationCommand.js

const axios = require('axios');

async function handleLocationCommand(message, chat) {
    const { latitude, longitude } = message.location;
    console.log(latitude, longitude);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    try {
        const response = await axios.get(url);
        const data = response.data

        if (response.ok) {
            const address = data.display_name;
                chat.sendStateTyping();
                chat.sendMessage(`Finding royal-loos near: ${address}`);

                const nearestShopsResponse = await axios.get('http://localhost:3000/api/shops/nearest', {
                    headers: {'Content-Type': 'application/json'},
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
                        const media = await MessageMedia.fromUrl(shop.washroomImages[0], { unsafeMime: true });
                        const messageText = `Name: ${shop.name}\nGenre: ${shop.genre}\nDistance: ${(distanceInKm)} kms\n`;
                        
                        chat.sendStateTyping();
                        chat.sendMessage(media, { caption: messageText });
                    },(i + 1) * 2000); 
                }
                chat.sendStateTyping();
                chat.sendMessage('type "select 1/2/3" to select and expand the shop details');
        } else {
            console.error('Failed to fetch location:', data.error || response.statusText);
            chat.sendStateTyping();
            chat.sendMessage(`LooLoo🔭 is facing an error fetching location`);
        }
    } catch (error) {
        console.error('Error fetching location:', error.message);
        chat.sendStateTyping();
        chat.sendMessage(`LooLoo🔭 is facing an error fetching location`);
    }
}

module.exports = { handleLocationCommand };
