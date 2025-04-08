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
    apiUrl: 'https://codeyzersiserver.tail9fb8f4.ts.net',
    baseUrl: 'https://codeyzersi.tail9fb8f4.ts.net',
  }
};

// Mevcut ortama göre yapılandırmayı dışa aktar
export default config[ENV]; 