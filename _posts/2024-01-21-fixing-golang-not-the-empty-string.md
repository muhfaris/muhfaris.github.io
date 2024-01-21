---
layout: post
title: Fixing Golang 1.21.5 error not the empty string
description: >-
  New Golang version (1.21.5), fixing error GOPROXY list is not the empty
  string, but contains no entries
author: muhfaris
image: assets/images/go.png
categories:
  - development
---

Bahasa pemograman Golang memiliki jadwal rilis setiap 6 bulan sekali, dengan penjadwalan 3 bulan untuk development dan 3 bulan untuk testing. Setiap rilisnya, ada perubahan yang perlu di perhatikan.
Pada halaman [Release History](https://go.dev/doc/devel/release), kita dapat melihat setiap perubahan yang dilakukan.

## Issue

### GOPROXY list is not the empty string, but contains no entries?

Jika kamu pertama kali menggunakan Golang versi 1.21+ atau kamu melakukan upgrade golang yang kamu gunakan ke versi 1.21+, hal ini mungkin akan terjadi. Sebelumnya saya menggunakan golang versi 1.20, setelah installasi selesai
tidak perlu menambahkan konfigurasi environment lain selain `GOPATH`. GOPATH itu juga optional, karena settingan tersebut hanya untuk mengatur project golang dalam satu tempat dan itu memudahkan dalam pengembangan project golang.

Issue ini muncul karena upgrade versi Golang dari 1.20 ke 1.21.5, kenapa ini bisa terjadi sedangkan pada versi sebelumnya tidak terjadi error?
Pada perilisan versi 1.21.0 di laman perilisan ataupun blog dari Golang tidak ada secara eksplisit menjelaskan akan perubahan ini. Setelah riset, pembaharuan GOPROXY atau GOSUMDB itu untuk dilakukan untuk menningkatkan keamanan.

### GOPROXY

Jika kita balik kebelakang, GOPROXY berfungsi untuk menentukan sumber yang digunakan sebagai referensi dari suatu modul. Golang akan menggunakan sumber yang ditentukan tersebut dan mengunduhnya untuk digunakan oleh modul-modul yang dipanggil.
Sebagai developer bisa sangat membantu, developer dapat mengatur sumber yang digunakan dan melakukan kontrol terhadap sumber tersebut. Selain itu GOPROXY juga membantu untuk memastikan modul selalu tersedia walaupun original repositornya dihapus,
karena GOPROXY juga punya sistem cache.

Ilustrasi GOPROXY dapat dilihat seperti berikut:
![GOPROXY](/assets/images/goproxy.avif)

## Workaround

Tambahkan env baru untuk `GOPROXY` dan `GOSUMDB`

```bash
export GOPROXY=https://proxy.golang.org,direct
export GOSUMDB=sum.golang.org
```

atau menggunakan `go -w`

```bash
go env -w GOPROXY=https://proxy.golang.org,direct
go env -w GOSUMDB=sum.golang.org
```

#### Reference

- https://www.practical-go-lessons.com/chap-18-go-module-proxies
- https://jfrog.com/blog/why-goproxy-matters-and-which-to-pick/
- https://www.suse.com/support/update/announcement/2023/suse-ru-20233323-1/
- https://go.dev/ref/mod#private-module-privacy
