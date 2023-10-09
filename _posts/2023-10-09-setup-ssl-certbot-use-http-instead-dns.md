---
layout: post
title: Setup ssl cerbot use HTTP instead DNS
author: muhfaris
image: assets/images/ssl.jpg
toc: true
categories:
  - infra
---
## Introduction

Installasi ssl pada suatu domain supaya dapat diakses secara aman dengan https://, perlu banget untuk menambahkah certificate dari domain tersebut. Generate certificate domain ini kita bisa manfaatkan tool certbot instead kita generate manual sendiri.

Beberapa kasus kita bisa melakukan generate certificate ini di main domain dan akan berlaku di semua sub-domainnya, tapi itu hanya bisa dilakukan ketika kita menggunakan preferred-challenges adalah dns. Next kita akan bahas pada artikel selanjutnya.

Pada artikel ini kita bahas untuk generate certificate dengan preferred-challenges adalah http, disini kita tidak perlu untuk menambahkan TXT record baru pada konfigurasi dns tapi hanya menambahkan konfigurasi pada webrootnya saja.

### Prerequirement

Beberapa komponen yang perlu disiapkan sebelum kita mulai untuk installasi ssl pada domain

1. certbot
2. docker
3. nginx image
4. domain

## Setup Nginx Service

### Configuration nginx

Kita bikin folder baru, anggaplah saat ini kita ada di root directory atau **home** directory terminal. Buat folder `nginx` kemudian buat file dengan format `domain.com.conf` didalamnya. Jika nama domainnya adalah `[muhfaris.com](http://muhfaris.com)` maka file konfigurasinya adalah `muhfaris.com.conf`. Jadi akan terlihat seperti berikut structure foldernya

```json
nginx
└── muhfaris.com.conf
```

Selanjutnya kita akan siapkan konfigurasi nginx untuk handle request dari certbot. Pada konfigurasi ini kita perlu untuk membuat konfigurasi location .well-known/acme-challenge untuk menerima request dari certbotnya. Ketika kita generate ssl, certbot nanti akan melakukan request ke doman kita dengan format requestnya itu seperti berikut

```json
http://<domain.com>/.well-known/acme-challenge/<random unique key>
```

Edit file `muhfaris.com.conf` dan masukan konfigurasi nginx berikut:

```json
server {
    listen 80;
    listen [::]:80;

    server_name muhfaris.com;
    server_tokens off;

   location ~ /.well-known {
      allow all;
   }

   location ^~ /.well-known/acme-challenge/ {
      add_header Content-Type text/html;
      root /usr/share/nginx/html;
   }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 default_server;
    listen [::]:443;

    server_name muhfaris.com;

    #ssl_certificate /etc/letsencrypt/live/muhfaris.com/fullchain.pem;
    #ssl_certificate_key /etc/letsencrypt/live/muhfaris.com/privkey.pem;

    location / {
      # proxy_pass http://app:3000;
    }
}
```

### Setup docker compose nginx

Docker sudah kita siapkan selanjutnya kita buat konfigurasi compose file. Image yang akan kita gunakan adalah `nginx:latest` , kemudian kita listen port `80` dan `443` . Pada pembahasan sebelumnya kita sudah bikin folder baru `nginx` , folder ini nanti akan kita masukkan sebagai konfigurasi di service nginxnya.

Silahkan buat file `docker-compose.yaml` kemudian copy-paste konfig berikut:

```json
version: "3.4"
services:
	nginx:
	    image: nginx:latest
	    restart: always
	    ports:
	      - "80:80"
	      - "443:443"
	    volumes:
	      - ${HOME}/nginx/muhfaris.com.conf:/etc/nginx/conf.d/muhfaris.com.conf:ro
	      - ${HOME}/nginx/acme:/usr/share/nginx/html:ro
	      - /etc/letsencrypt/live/muhfaris.com/fullchain.pem:/etc/letsencrypt/live/muhfaris.com/fullchain.pem:ro
	      - /etc/letsencrypt/live/muhfaris.com/privkey.pem:/etc/letsencrypt/live/muhfaris.com/privkey.pem:ro
	    networks:
	      net:
networks:
  net:
```

Ingat untuk selalu ganti domain `[muhfaris.com](http://muhfaris.com)` sesuai dengan domain yang digunakan. Pada `volumes` diatas ada folder `acme` dan `/etc/letsencrypt` yang kita masukkan, ini nanti akan kita buat di langkah selanjutnya.

Setelah langkah-langkah diatas selesai, maka structure foldernya akan berubah seperti berikut:

```json
.
├── docker-compose.yaml
└── nginx
    └── muhfaris.com.conf
```

### Generate ssl domain

Buat folder baru didalam folder `nginx` yang sudah dibuat dengan nama `acme` , folder ini nanti sebagai webroot di nginxnya. Maka structure folder akan terlihat seperti berikut:

```json
├── docker-compose.yaml
└──	nginx
		├── acme
		│   └── index.html
		└── muhfaris.com.conf
```

Jalankan nginx yang sudah kita siapkan pada `docker-compose.yaml` dengan perintah berikut

`docker compose up -d` . Perintah ini akan menjalankan service yang sudah kita definisikan dalam mode daemon.

Selanjutnya, kita generate certificate menggunakan certbot. Silahkan ganti domain `[muhfaris.com](http://muhfaris.com)` pada perintah certbot berikut sesuai dengan domain yang sudah disiapkan.

```json
sudo certbot certonly \
--preferred-challenges http -d muhfaris.com --agree-tos \
--manual-public-ip-logging-ok --preferred-challenges dns-01 \
--server https://acme-v02.api.letsencrypt.org/directory \
--register-unsafely-without-email --rsa-key-size 4096 \
--webroot --webroot-path $HOME/nginx/acme
```

Perintah diatas akan melakukan generate ssl certificate dari domain `[muhfaris.com](http://muhfaris.com)` , pada proses ini certbot akan melakukan verifikasi domain dengan mengakses path `acme-challenge`. Jika proses berhasil maka tampilan outputnya seperti berikut:

```bash
Press Enter to Continued
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/muhfaris.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/muhfaris.com/privkey.pem
   Your cert will expire on 2023-12-26. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

```

### Update compose and load ssl cerificate

Tahap ini kita sudah mendapatkan ssl certificate, langkah terakhir adalah uncomment konfigurasi ssl pada nginx.

```markdown
server {
...
...
ssl_certificate /etc/letsencrypt/live/muhfaris.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/muhfaris.com/privkey.pem;
}
```

Setelah itu lakukan update service nginx dengan menjalankan perintah `docker compose restart` . Finally, sekarang domain dapat diakses menggunakan protokol https [https://muhfaris.com](https://muhfaris.com).
