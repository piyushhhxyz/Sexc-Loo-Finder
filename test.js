const https = require('https');

// Replace with your Google Maps API key
const apiKey = 'AIzaSyA6EFGs_FRI40xeicSfMxYTJRcQAqGrHEs';

function getTopPlaces(state, category) {
  // Text Search API to find points of interest
  const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+rated+${category} in ${state}&key=${apiKey}`;

  https.get(textSearchUrl, (textSearchResponse) => {
    let textSearchData = '';
    textSearchResponse.on('data', (chunk) => {
      textSearchData += chunk;
    });

    textSearchResponse.on('end', () => {
      const textSearchResult = JSON.parse(textSearchData);
      if (textSearchResult.status !== 'OK') {
        console.error('Text Search API error:', textSearchResult.error_message);
        return;
      }

      // Grab the first place_id from results
      const placeId = textSearchResult.results[0].place_id;

      // Places API to get details of the top place
      const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

      https.get(placeDetailsUrl, (placeDetailsResponse) => {
        let placeDetailsData = '';
        placeDetailsResponse.on('data', (chunk) => {
          placeDetailsData += chunk;
        });

        placeDetailsResponse.on('end', () => {
          const placeDetailsResult = JSON.parse(placeDetailsData);
          if (placeDetailsResult.status !== 'OK') {
            console.error('Places API error:', placeDetailsResult.error_message);
            return;
          }

          const topPlaceName = placeDetailsResult.result.name;
          const topPlaceRating = placeDetailsResult.result.rating;

          console.log(`1. ${topPlaceName} - Rating: ${topPlaceRating}`);

          // Repeat Places API calls for remaining top 9 places using a loop
          for (let i = 1; i < 10; i++) {
            getNextTopPlace(textSearchResult.results[i].place_id);
          }
        });
      }).on('error', (error) => {
        console.error('Places Details API error:', error.message);
      });
    });
  }).on('error', (error) => {
    console.error('Text Search API error:', error.message);
  });
}

function getNextTopPlace(placeId) {
  const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

  https.get(placeDetailsUrl, (placeDetailsResponse) => {
    let placeDetailsData = '';
    placeDetailsResponse.on('data', (chunk) => {
      placeDetailsData += chunk;
    });

    placeDetailsResponse.on('end', () => {
      const placeDetailsResult = JSON.parse(placeDetailsData);
      if (placeDetailsResult.status !== 'OK') {
        console.error('Places API error:', placeDetailsResult.error_message);
        return;
      }

      const placeName = placeDetailsResult.result.name;
      const placeRating = placeDetailsResult.result.rating;
      const placeNumber = (placeDetailsResult.result.place_id === placeId) ? 2 : (textSearchResult.results.indexOf(placeId) + 2);

      console.log(`${placeNumber}. ${placeName} - Rating: ${placeRating}`);
    });
  }).on('error', (error) => {
    console.error('Places Details API error:', error.message);
  });
}

const state = 'Bangalore';
const category = 'restaurants'; // You can change this to 'attractions' etc.
getTopPlaces(state, category);