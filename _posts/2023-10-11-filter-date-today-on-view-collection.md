---
layout: post
title: Filter date today on view collection MongoDB
author: muhfaris
image: assets/images/mongodb.png
toc: true
categories:
  - development
---
Hari ini saya dapat issue pada sistem aplikasi yang memanfaatkan views colleciton di mongodb. Data yang seharusnya menampilkan data hari ini justru menampilkan data kemarin. Issue terbesar ada pada filter date today pada views collection di mongodb.

## Introduction

Views collection adalah suatu collection yang dibuat hanya untuk membaca data dari data source utama (collection lain) dengan kondisi atau filter yang sudah ditentukan. Data pada views collection sendiri tidak disimpan dalam disk, tapi akan dikalkulasi ketika client melakukan query ke views collection tersebut.Tetapi bukan berarti tidak bisa disimpan di disk, kamu dapat mempelajarinya lagi untuk mengimplementasikannya pada bab **[on-demand materialized views](https://www.mongodb.com/docs/manual/core/materialized-views/).**

Kasus seperti apa yang dapat menggunakan views collection?

berdasarkan informasi dari website resmi mongodb, contoh beberapa kasus yang dapat menggunakan views collection seperti berikut:

1. Membuat view collection dari data karyawan dengan mengecualikan field tertentu yang tidak ditampilkan atau bahkan menambahkan field tertentu.
2. Membuat view collection dari data sensor dengan menambahkan field baru dan metrics baru.
3. Membuat view collection dari 2 collections seperti inventory dan order history, jadi dapat melakukan sekali query pada view collection dari pada melakukan query ke 2 collection tersebut.

## Details Information

### Issue

Issue yang muncul adalah Customer tidak dapat melakukan redeem voucer yang sudah dia dapatkan, setelah ditelusuri permasalahannya ada pada filter date today yang tidak relevan.

Filter date today yang digunakan adalah menggunakan `new Date()` , jadi helper tersebut akan mereturn sebuah string date hari ini. Disini anggaplah kita membuat view collection kemarin dengan filternya menggunakan `new Date()` maka hari ini ketika kita check querynya kembali, filter tersebut akan didefine pada mongodb dengan filter date adalah kemarin bukan hari ini.

Sebagai gambaran, ketika kita membuat view collection **baru** dengan filter date hari ini maka aggregate yang digunakan seperti berikut:

```json
{
 "$match": {
      "available_at": {
        $lte: new Date(),
      },
      "expired_at": {
        $gt: new Date(),
      },
	}
}
```

Misal besok kita check lagi query yang sudah dibuat, query diatas akan berubah menjadi seperti berikut:

```json
{
 "$match": {
      "available_at": {
        $lte: ISODate("2023-10-10T17:00:00.000+00:00"),
      },
      "expired_at": {
        $gt: ISODate("2023-10-10T17:00:00.000+00:00"),
      },
	}
}
```

seharusnya filter date tersebut tetap menampilkan `new Date()` karena yang diinginkan adalah mendapatkan data voucher yang masih available, jika filter tersebut berubah di kemudian hari 1 bulan, atau 1 tahun kedepan atau 2 tahun kedepan voucher yang masa berlakunya lama tidak dapat diambil juga.

### Workaround

Setelah beberapa kali riset, saya dapati pada mongodb mempunyai fungsi [$expr](https://www.mongodb.com/docs/v7.0/reference/operator/query/expr/) yang dapat kita manfaatkan. Dengan fungsi ini dikombinasikan untuk mendapatkan date hari ini menggunakan `NOW` dari pada `new Date()`.

Pada filter sebelumnya akan diubah dan disatukan dalam `and` , sehingga filter tersebut masih tetep sama, akan mengambil voucher yang available dan belum expired.

```json
{
  "$match": {
    "$and": [
      {
        "$expr": {
          "$lte": [
            {
              "$dateToString": {
                "format": "%Y-%m-%d",
                "date": "$available_at"
              }
            },
            {
              "$dateToString": {
                "format": "%Y-%m-%d",
                "date": "$$NOW"
              }
            }
          ]
        }
      },
      {
        "$expr": {
          "$gt": [
            {
              "$dateToString": {
                "format": "%Y-%m-%d",
                "date": "$expired_at"
              }
            },
            {
              "$dateToString": {
                "format": "%Y-%m-%d",
                "date": "$$NOW"
              }
            }
          ]
        }
      }
    ]
  }
}
```

Next day coba check kembali apakah query berubah seperti halnya waktu menggunakan `new Date` atau tidak, ini hanya untuk make sure saja jika kalian masih ragu.
