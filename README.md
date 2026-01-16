}
🛡️ DevCode Guard Bot - Premium Security System
https://img.shields.io/badge/DevCode-Protect-blueviolet
https://img.shields.io/badge/Version-2.0.0-green
https://img.shields.io/badge/Node.js-20.x%252B-brightgreen
https://img.shields.io/badge/License-MIT-yellow

Gelişmiş Çoklu Bot Destekli Güvenlik Sistemi & Web Dashboard
Premium koruma özellikleri, çoklu bot desteği ve modern web yönetim paneli ile sunucunuzu profesyonelce koruyun.

📋 İçindekiler
🌟 Öne Çıkan Özellikler

⚡ Hızlı Kurulum

📦 Sistem Gereksinimleri

🔧 Detaylı Kurulum Rehberi

⚙️ DevCode.json Yapılandırması

🌐 Web Dashboard Kurulumu

🛡️ Guard Sistemleri Detayları

🎮 Komutlar ve Kullanım

🚀 Botu Çalıştırma

🔍 Sorun Giderme

📞 Destek ve İletişim

🌟 Öne Çıkan Özellikler
🤖 Çoklu Bot Desteği
Aynı anda birden fazla bot ile koruma

Her bot için farklı ses kanalı ve aktivite

Yük dağıtımı ile performans optimizasyonu

🛡️ Kapsamlı Korumalar
Rol Koruması: Yetkisiz rol işlemlerini engelleme

Kanal Koruması: Kanal değişikliklerini izleme

Sunucu Koruması: Kritik ayarları koruma

Emoji/Sticker Koruması: Sunucu öğelerini koruma

Webhook Koruması: Yetkisiz webhook oluşumunu engelleme

Ban/Kick Koruması: Yetkisiz yasaklama/atma işlemleri

📊 Gelişmiş Log Sistemi
Her olay tipi için özel log kanalları

Detaylı log mesajları

Web dashboard'da görüntüleme

Log arşivleme sistemi

🌐 Web Dashboard
Gerçek zamanlı sunucu izleme

Koruma ayarlarını yönetme

Logları görüntüleme ve filtreleme

Responsive ve modern tasarım

Güvenli oturum yönetimi

⚡ Hızlı Kurulum
5 Dakikada Botu Çalıştırın:
Node.js kurun (v20 veya üzeri)

MongoDB kurun (yerel veya cloud)

Bot dosyalarını indirin

Modülleri kurun:

bash
npm install
cd dashboard
npm install
cd ..
DevCode.json'u düzenleyin

Botu başlatın:

bash
start.bat
📦 Sistem Gereksinimleri
Zorunlu Gereksinimler:
✅ Node.js 20.0.0 veya üzeri (⚠️ Daha düşük sürümler çalışmaz!)

✅ MongoDB 4.4 veya üzeri

✅ Discord Developer Portal'da bot oluşturulmuş olmalı

✅ Windows 10/11 veya Linux/macOS

Önerilen Sistem:
RAM: 2GB veya üzeri

Disk Alanı: 500MB boş alan

İnternet: Sabit bağlantı

🔧 Detaylı Kurulum Rehberi
1. Adım: Node.js Kurulumu
bash
# Node.js sürümünüzü kontrol edin
node --version

# Eğer 20.x değilse, Node.js 20 veya üzeri kurun:
# https://nodejs.org/ adresinden LTS sürümünü indirin
2. Adım: MongoDB Kurulumu
Windows için:
MongoDB Community Server indirin

Kurulumu tamamlayın

MongoDB Compass ile bağlantıyı test edin

Linux için:
bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# CentOS/RHEL
sudo yum install mongodb-org
sudo systemctl start mongod
3. Adım: Bot Dosyalarını Hazırlama
bash
# Dosyaları indirin ve klasöre çıkarın
cd desktop
mkdir guard-bot
# Dosyaları bu klasöre kopyalayın
4. Adım: Modülleri Yükleme
bash
# Ana klasörde:
npm install

# Dashboard klasöründe:
cd dashboard
npm install
cd ..
⚙️ DevCode.json Yapılandırması
Örnek Yapılandırma Dosyası:
json
{
    "guardI": {
        "token": "BOT_1_TOKEN_BURAYA",
        "voiceChannelID": "1457459565791678546",
        "activity": "Arven Was Here",
        "status": "idle"
    },
    "guardII": {
        "token": "BOT_2_TOKEN_BURAYA",
        "voiceChannelID": "1457459565791678546",
        "activity": "DevCode Was Here",
        "status": "idle"
    },
    "mongoURL": "mongodb://localhost:27017/guardbot",
    "guildID": "SUNUCU_ID_BURAYA",
    "logChannels": {
        "channel": "kanal-log",
        "role": "rol-log",
        "guard": "guard-log",
        "emoji": "emoji-log",
        "sticker": "sticker-log",
        "webhook": "webhook-log",
        "ban": "ban-log",
        "kick": "kick-log"
    },
    "ownerIDs": [
        "284790439679361025"
    ],
    "password": "GüçlüBirWebŞifresi123",
    "prefix": "."
}
🔑 Yapılandırma Parametreleri:
Bot Ayarları:
Parametre	Açıklama	Zorunlu
guardI.token	1. botun Discord tokeni	✅
guardII.token	2. botun Discord tokeni	✅
voiceChannelID	Botların bağlanacağı ses kanalı ID	✅
activity	Botun durum mesajı	✅
status	Bot durumu (idle/dnd/online/invisible)	✅
Veritabanı ve Sunucu:
Parametre	Açıklama	Zorunlu
mongoURL	MongoDB bağlantı adresi	✅
guildID	Korunacak sunucu ID	✅
Log Kanalları:
Parametre	Açıklama	Örnek
logChannels.channel	Kanal değişiklik logları	#kanal-log
logChannels.role	Rol değişiklik logları	#rol-log
logChannels.guard	Guard olayları logları	#guard-log
logChannels.emoji	Emoji değişiklik logları	#emoji-log
logChannels.sticker	Sticker değişiklik logları	#sticker-log
logChannels.webhook	Webhook olayları logları	#webhook-log
logChannels.ban	Ban işlemleri logları	#ban-log
logChannels.kick	Kick işlemleri logları	#kick-log
Güvenlik ve Yetki:
Parametre	Açıklama	Önerilen
ownerIDs	Bot sahiplerinin Discord ID'leri	["123456789"]
password	Web dashboard şifresi	Min. 8 karakter
prefix	Bot komut prefix'i	. veya !
🚀 Token Alma Rehberi:
Discord Developer Portal açın

"New Application" butonuna tıklayın

Bot adını girin ve oluşturun

Sol menüden "Bot" sekmesine tıklayın

"Reset Token" butonuna tıklayın ve tokeni kopyalayın

Tokeni DevCode.json dosyasına yapıştırın

🌐 Web Dashboard Kurulumu
Dashboard Özellikleri:
✅ Gerçek Zamanlı İzleme

✅ Koruma Ayarları Yönetimi

✅ Log Görüntüleyici

✅ Üye Yönetimi

✅ Sunucu İstatistikleri

Dashboard Erişimi:
Bot çalıştıktan sonra tarayıcınızda açın:

text
http://localhost:3000
Giriş yapmak için:

Kullanıcı Adı: admin

Şifre: DevCode.json'da belirttiğiniz password

Dashboard Port Değiştirme:
Eğer 3000 portu kullanılıyorsa:

javascript
// dashboard/server.js dosyasında
const port = process.env.PORT || 3001; // Portu değiştirin
🛡️ Guard Sistemleri Detayları
📌 Rol Koruması
javascript
// Özellikler:
- Yeni rol oluşturma engeli
- Rol silme engeli
- Rol izin değişikliği engeli
- Rol renk/isim değişikliği engeli
- Admin rolü özel koruması
📌 Kanal Koruması
javascript
// Özellikler:
- Kanal oluşturma engeli
- Kanal silme engeli
- Kanal izin değişikliği engeli
- Kategori değişikliği engeli
- Özel kanal ayarları koruması
📌 Sunucu Koruması
javascript
// Özellikler:
- Sunucu isim değişikliği engeli
- AFK kanalı/ayarları koruması
- Sistem kanalı değişiklik engeli
- Banner/icon değişiklik koruması
📌 Emoji & Sticker Koruması
javascript
// Özellikler:
- Emoji oluşturma/silme engeli
- Sticker oluşturma/silme engeli
- Emoji isim değişikliği engeli
- Toplu emoji silme engeli
📌 Webhook Koruması
javascript
// Özellikler:
- Webhook oluşturma engeli
- Webhook silme engeli
- Webhook izin değişikliği engeli
- Spam webhook koruması
📌 Ban & Kick Koruması
javascript
// Özellikler:
- Toplu ban engeli
- Yetkisiz ban/kick engeli
- Owner/Admin koruması
- Anti-raid ban koruması
🎮 Komutlar ve Kullanım
🛡️ Guard Komutları:
Komut	Açıklama	Örnek
.guard enable	Tüm korumaları aktif eder	.guard enable all
.guard disable	Tüm korumaları kapatır	.guard disable role
.guard log	Log kanalını ayarlar	.guard log #kanal
.guard whitelist	Beyaz listeye ekle	.guard whitelist add @kullanıcı
.guard settings	Ayarları gösterir	.guard settings
🛠️ Moderasyon Komutları:
Komut	Açıklama	Örnek
.ban	Kullanıcıyı yasakla	.ban @kullanıcı Spam
.kick	Kullanıcıyı at	.kick @kullanıcı Kurallar
.mute	Kullanıcıyı sustur	.mute @kullanıcı 1h
.clear	Mesajları temizle	.clear 50
.warn	Uyarı ver	.warn @kullanıcı Reklam
📊 Bilgi Komutları:
Komut	Açıklama	Örnek
.stats	Bot istatistikleri	.stats
.help	Yardım menüsü	.help guard
.ping	Bot gecikmesi	.ping
.invite	Davet linki	.invite
.info	Bot bilgileri	.info
🚀 Botu Çalıştırma
Windows için:
bash
# Yöntem 1: start.bat dosyasını çift tıklayın
start.bat

# Yöntem 2: Manuel başlatma
node bot.js

# Yöntem 3: PM2 ile (kalıcı çalıştırma)
npm install -g pm2
pm2 start bot.js --name "guard-bot"
Linux/macOS için:
bash
# Terminalde çalıştırın
node bot.js

# Veya PM2 ile:
pm2 start bot.js --name "guard-bot"
pm2 save
pm2 startup
🌐 Dashboard'u Başlatma:
bash
# Yeni terminal penceresi açın
cd dashboard
node server.js

# PM2 ile dashboard:
pm2 start server.js --name "guard-dashboard" --cwd ./dashboard
🔍 Sorun Giderme
⚠️ Sık Karşılaşılan Hatalar:
1. "MongoDB connection error"
bash
# MongoDB çalışıyor mu kontrol edin:
mongosh

# MongoDB'yi başlatın:
sudo systemctl start mongod
# veya
mongod
2. "Invalid token" hatası
text
✅ Doğru: MTIwNDU2Nzg5MDEyMzQ1Njc4OQ.GzABCD.efghijklmnopqrstuvwxyz123456
❌ Yanlış: bot_token_here veya boş bırakma
3. "Cannot find module"
bash
# Tüm modülleri tekrar kurun:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
4. Node.js versiyon hatası
bash
# Node.js sürümünüzü kontrol edin:
node --version

# Eğer 20.x değilse, Node.js 20 kurun:
# Node.js 20 LTS indirin ve kurun
5. Bot ses kanalına bağlanamıyor
text
✅ Ses kanalı ID'sini kontrol edin
✅ Botun ses kanalına girebilme izni olduğundan emin olun
✅ Kanalın sunucuda var olduğundan emin olun
✅ Başarılı Kurulum Kontrol Listesi:
Node.js 20.x kurulu ✓

MongoDB çalışıyor ✓

DevCode.json düzgün dolduruldu ✓

npm install çalıştırıldı ✓

Bot tokenleri doğru ✓

Sunucu ID doğru ✓

Log kanalları oluşturuldu ✓

📞 Destek ve İletişim
💬 Discord Desteği:
Sunucu: DevCode Support

Developer: Arven#0001

Bot: DevCode Guard#0000

📚 Ek Kaynaklar:
Discord.js Documentation

MongoDB Documentation

Node.js Documentation

🐛 Hata Bildirimi:
Bir hata ile karşılaşırsanız:

Hata mesajını ekran görüntüsü alın

DevCode.json dosyanızı (tokenler hariç) paylaşın

Node.js ve MongoDB versiyonlarınızı belirtin

🔐 Güvenlik Önlemleri
Önemli Tavsiyeler:
Tokeninizi asla paylaşmayın!

DevCode.json dosyasını .gitignore'a ekleyin

Web şifrenizi güçlü yapın

Owner ID'lerinizi doğru girin

Botu sadece güvendiğiniz sunucularda kullanın

Yedekleme:
bash
# Bot verilerini yedekleyin:
mongodump --db guardbot --out ./backup

# Yedekten geri yükleyin:
mongorestore --db guardbot ./backup/guardbot
<div align="center">
🎉 Kurulum Tamamlandı!
Tebrikler! 🥳 DevCode Guard Bot başarıyla kuruldu ve çalışıyor.

Son Kontroller:
Botlar Discord'da online görünüyor

Ses kanalına bağlandılar

Dashboard http://localhost:3000 adresinde çalışıyor

Log kanallarında test mesajları görünüyor

⭐ Projeyi Beğendiyseniz:
Geliştirmeye devam etmemiz için yıldız vermeyi unutmayın!

Keyifli kullanımlar! 🚀

</div>
© 2024 DevCode Development. Tüm hakları saklıdır.
Bu bot sadece eğitim ve güvenlik amaçlıdır. Kötüye kullanım sorumluluğu kullanıcıya aittir.
