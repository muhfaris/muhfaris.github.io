---
layout: post
title: Mengatasi masalah where clause di Golang
description: Cara mengatasi variasi logik sql pada native atau raw sql di golang
author: muhfaris
image: assets/images/go.png
toc: true
categories:
  - programmer
---
Beberapa tahun terakhir dalam kontribusi pembuataan aplikasi menggunakan
database postgreSQL dengan bahas pemograman Golang, ada beberapa case yang
seringkali sulit diterapkan pada RAW SQL.

Contoh case yang sulit untuk diterapkan seperti menampilkan data dengan
optional filter. Adanya optional filter ini membuat suatu query jadi berbeda
setiap kali filter itu digunakan. Anggaplah ada data video dengan filter date,
owner, kategory dan top 10 view, pada filter ini bisa dikombinasikan juga antar
filter.

Kita coba bikin object video untuk lebih mudah memahaminya:

{:.w-80 .overflow-x-auto .md:w-full}

```go
type Video struct {
    id string
    name string
    category_id string
    created_at time.Time
    created_by string
}

type VideoView struct {
    id string
    video_id string
    total_view int
    created_at time.Time
    created_by string
    updated_at time.Time
    updated_by string
}

```

Untuk menampilkan list video dengan filter date, disini menggunakan field `created_at` query yang digunakan kurang lebih seperti berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```go
func GetAllVideo(ctx context.Context, params domain.SearchParams)(domain.Videos, error){
    ...
    ...
    var (
        wheres []interface{}
        where string
    )

    if params.Date != ""{
        wheres = append(wheres, params.Date)
        where += "WHERE created_at=$1"
    }


    sql :=`
        SELECT
            id, name, category_id, created_at, created_by
        FROM videos`

    if where != ""{
        sql += where

    }

    rows, err:= db.QueryContext(ctx, sql, wheres...)
    if err != nil {
            ...
    }

    for rows.Next(){
            ...
            ...
    }
    ...
    ...
    ...
}

```

Bagaimana jika filter date diatas dikombinasikan dengan filter category?
Harus memperhatikan urutan pernulisan kode sqlnya, karena pada kode diatas placeholder SQL yang digunakan itu dihardcode. Belum lagi jika filternya hanya category saja tanpa date.

{:.w-80 .overflow-x-auto .md:w-full}

```go
...
...
...
    var (
        wheres []interface{}
        where string
    )

    if params.Date != ""{
        wheres = append(wheres, params.Date)
        where += "WHERE created_at=$1"
    }

    if params.Date !="" && params.CategoryID != ""{
        wheres = append(wheres, params.CategoryID)
        where += "AND category_id=$2"
    }


    sql :=`
        SELECT
            id, name, category_id, created_at, created_by
        FROM videos`

    if where != ""{
        sql += where
    }

...
...

```

Bayangkan dari simple case diatas bisa jadi kompleks pada SQL querynya, belum lagi dikombinasikan dengan filter yang lain ataupun jika ada join ke table yang lain juga.

Bagaimana jika bikin library general yang bisa bantu untuk mengatasi hal tersebut?

Fungsinya itu sederhana, dia hanya menampung kondisi yang valid dalam suatu variabel kemudian ada method lain untuk menggabungkan kondisi secara keseluruhan termasuk query `WHERE`. Pertama bikin fungsinya terlebih dahulu, dengan beberapa parameter.

{:.w-80 .overflow-x-auto .md:w-full}

```go
func (s *SQLCondition) Where(exist bool, query string, value interface{}) *SQLCondition {
	const dollarSymbol = "$"

	if !exist {
		return s
	}

	if strings.Contains(query, dollarSymbol) {
		placeholder := fmt.Sprintf("%s%d", dollarSymbol, len(s.Args)+1)
		query = strings.ReplaceAll(query, dollarSymbol, placeholder)
	}

	if s.hasAnd {
		s.wheres = fmt.Sprintf("%s AND %s", s.wheres, query)
		s.hasAnd = false
	} else {
		s.wheres = query
	}

	if value != nil {
		s.Args = append(s.Args, value)
	}

	return s
}

```

Fungsi diatas menerima hasil kondisi, jika hasilnya `true` maka query akan ditampung dalam variabel `wheres` dan jika variable `value` tidak `nil` maka akan ditampung juga dalam variabel `Args`.
Pada fungsi diatas, ada logik untuk mendeteksi simbol dollar `$`. Ini adalah untuk membuat placeholder query itu secara dinamis, akan bertambah sesuai dengan kondisi dan existing kondisi sebelumnya. Sekarang kita lengkapin kode lainnya supaya bisa digunakan

{:.w-80 .overflow-x-auto .md:w-full}

```go

type SQLCondition struct {
	defaultQuery string
	wheres       string
	Args         []interface{}
	hasAnd       bool
}

func NewSQLCondition() *SQLCondition {
	return &SQLCondition{}
}

func (s *SQLCondition) Where(exist bool, query string, value interface{}) *SQLCondition {
    ...
    // Previous code
    ...
}

func (s *SQLCondition) And() *SQLCondition {
	s.hasAnd = true
	return s
}

func (s *SQLCondition) Build() string {
	if s.wheres != "" {
		return fmt.Sprintf("WHERE %s", s.wheres)
	}

	return ""
}

```

Okay, kita bandingkan penulisan query pada case sebelumnya dengan menggunakan library yang baru saja dibuat.

{:.w-80 .overflow-x-auto .md:w-full}

```go

    sqlCondition := NewSQLCondition()
    sqlCondition.Where(params.Date !="", "created_at=$", params.Date).And().
    Where(params.Category != "", "category_id=$", params.CategoryID)

    whereSQL := sqlCondition.Build()

    sql :=fmt.Sprintf(`
        SELECT
            id, name, category_id, created_at, created_by
        FROM videos %s`, whereSQL)

    rows, err:= db.QueryContext(ctx, sql, sqlCondition.Args...)
    if err != nil {
            ...
    }

```

Hasil dari library kode jadi lebih clear, mudah baca query sqlnya juga. Jikalaupun ada kondisi yang tidak terpenuhi itu hasil querynya tetep valid.
Sekian, semoga bisa jadi bahan diskusi untuk sesama programmer. thanks.
