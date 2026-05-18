import axios from 'axios';

// 🍏 Dökümandaki v3 token'ın
const MASSIVE_TOKEN = 'L3V4gQYenQdqJe11Lks5vkOKayl3hiWZ'; 
// 🍏 Host: api.massive.com dediği için base URL'i güncelledik
const BASE_URL_V1 = 'https://api.massive.com/v1'; 
const BASE_URL_V2 = 'https://api.massive.com/v2'; 
const BASE_URL_V3 = 'https://api.massive.com/v3'; 

export const fetchMassiveData = async () => {
  try {
    const response = await axios.get(`${BASE_URL_V3}/reference/dividends`, {
      headers: {
        // 🍏 HEADER ÖYLE DİYORSA BÖYLE OLACAK:
        'Authorization': `Bearer ${MASSIVE_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    // v3 yapısında veri genellikle 'results' içinde gelir
    return {
      success: true,
      items: response.data.results || []
    };
  } catch (error) {
    console.error("Massive v3 Error:", {
      status: error.response?.status,
      data: error.response?.data
    });
    return { success: false, items: [] };
  }
};

export const fetchNewsData = async () => {
  try {
    const response = await axios.get(`${BASE_URL_V2}/reference/news`, {
      headers: {
        // 🍏 HEADER ÖYLE DİYORSA BÖYLE OLACAK:
        'Authorization': `Bearer ${MASSIVE_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    // v3 yapısında veri genellikle 'results' içinde gelir
    return {
      success: true,
      items: response.data.results || []
    };
  } catch (error) {
    console.error("Massive v2 Error:", {
      status: error.response?.status,
      data: error.response?.data
    });
    return { success: false, items: [] };
  }
};