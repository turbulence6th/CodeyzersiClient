# Reversi Frontend

Modern bir React arayüzü ile Reversi oyunu.

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu çalıştır
npm start

# Üretim için projeyi derle
npm run build
```

## Özellikler

- React ile modernize edilmiş arayüz
- Tahta hücreleri için görsel ipuçları
- Responsive tasarım
- Gerçek zamanlı skor takibi
- Mevcut AI endpointi ile uyumluluk

## Teknolojiler

- React
- Axios (HTTP istekleri için)
- Webpack
- CSS3

## Dosya Yapısı

```
reversi_frontend/
  ├── dist/                # Derlenmiş dosyalar
  ├── src/                 # Kaynak kodlar
  │   ├── components/      # React bileşenleri
  │   ├── constants/       # Sabitler ve yapılandırmalar
  │   ├── App.js           # Ana uygulama bileşeni
  │   └── index.js         # Giriş noktası
  ├── package.json         # NPM paketi yapılandırması
  ├── webpack.config.js    # Webpack yapılandırması
  └── README.md            # Dokümantasyon
``` 