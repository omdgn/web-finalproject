// utils/geocode.js
const axios = require('axios');

module.exports = async function geocode(address) {
  const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: { address, key: process.env.GOOGLE_API_KEY }
  });
  if (res.data.status !== 'OK' || !res.data.results.length) {
    throw new Error('Geocoding başarısız: ' + res.data.status);
  }
  const { lat, lng } = res.data.results[0].geometry.location;
  return { lat, lng };
};
