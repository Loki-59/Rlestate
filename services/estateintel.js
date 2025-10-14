const axios = require('axios');

const API_BASE_URL = 'https://api.estateintel.com/api';
const API_KEY = process.env.ESTATEINTEL_API_KEY;

if (!API_KEY) {
  throw new Error('ESTATEINTEL_API_KEY is required in .env');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'API-KEY': API_KEY,
    'Content-Type': 'application/json',
  },
});

// Function to fetch supported locations
const getSupportedLocations = async () => {
  try {
    const response = await apiClient.get('/supported-locations');
    return response.data; // Assume array of {neighborhood, city, country}
  } catch (error) {
    console.error('Error fetching supported locations:', error.message);
    throw new Error(`Failed to fetch locations: ${error.response?.data?.message || error.message}`);
  }
};

// Function to fetch residential prices
const getResidentialPrices = async (location, type = 'sale', beds = 3, country = 'NG') => {
  try {
    const params = {
      location, // e.g., 'lagos-ikeja'
      country,
      type,
      beds: beds.toString(),
    };
    const response = await apiClient.get('/residential-prices', { params });
    return response.data; // Assume {average_price, location_details, etc.}
  } catch (error) {
    console.error('Error fetching residential prices:', error.message);
    throw new Error(`Failed to fetch prices: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = {
  getSupportedLocations,
  getResidentialPrices,
};
