import axios from 'axios';

// 🍏 Dökümandaki v3 token'ın
const MASSIVE_TOKEN = 'L3V4gQYenQdqJe11Lks5vkOKayl3hiWZ'; 
// 🍏 Host: api.massive.com dediği için base URL'i güncelledik
const BASE_URL = 'https://api.massive.com/v3'; 

export const fetchMassiveData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/reference/dividends`, {
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