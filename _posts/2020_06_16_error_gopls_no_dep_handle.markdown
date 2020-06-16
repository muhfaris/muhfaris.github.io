Pagi ini mau develop apps eh editornya vim malah dapat error setelah di update.
setelah cari - cari kenapa masalahnya ada di settingan env golangnya yaitu di
```
GO111MODULE
```

jadi lokasi apps project nya ada di `src/github/xxx/nama_project`, nah ketika `GO111MODULE` aktif dia tidak bisa mendeteksi source code nya.
contoh kasus
```
import "github.com/ccc/nama_package/ol"
err :=ol.Submit(data)
if err != nil {

}
```
ketika akan jump ke method `ol.Submit()` error muncul di vim :
```
gopls no dep handle no metadata for
```

solusinya, matikan `GO111MODULE` dengan perintah :
```
go env -w GO111MODULE=off
```
