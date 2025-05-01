// config.js - Ortam yapılandırmaları

const ENV = process.env.NODE_ENV || 'development';

// Ortama göre API URL yapılandırmaları
const config = {
  // Geliştirme ortamı ayarları
  development: {
    apiUrl: 'http://localhost:8080',
    baseUrl: 'http://localhost:3000',
  },
  // Üretim ortamı ayarları
  production: {
    apiUrl: 'https://reversi-server.codeyzer.com',
    baseUrl: 'https://reversi.codeyzer.com',
  }
};

// Mevcut ortama göre yapılandırmayı dışa aktar
export default config[ENV]; 