---
layout: post
title: Perjalanan membuat plugin di nvim part 1
description: >-
  Membuat plugin devtools.nvim dari awal menggunakan lua script.
author: muhfaris
image: assets/images/devtools.png
categories:
  - development
---

Resources untuk membuat plugin di nvim menggunakan lua script itu tidak banyak yang saya temukan. Semoga catatan ini bisa membantu developer yang lain juga yang ingin membuat plugin nvim sendiri.

Nama plugin yang akan dibuat adalah [muhfaris/devtools.nvim](https://github.com/muhfaris/devtools.nvim), yang berisi beberapa fungsi yang dapat mempermudah pekerjaan as developer. Kita akan menggunakan [folke/lazy.nvim](https://github.com/folke/lazy.nvim) sebagai package managernya.

## Struktur plugin

Diambil dari website resmi [neovim](https://neovim.io/doc/user/lua-guide.html#lua-guide-modules), struktur plugin ini memiliki struktur seperti berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```bash
~/.config/nvim
|-- after/
|-- ftplugin/
|-- lua/
|   |-- myluamodule.lua
|   |-- other_modules/
|       |-- anothermodule.lua
|       |-- init.lua
|-- plugin/
|-- syntax/
|-- init.vim
```

### Buat direktori plugin

Buat direktori baru dengan nama [devtools.nvim](https://github.com/muhfaris/devtools.nvim), beserta subdirektori yang dibutuhkan. Buat file `init.lua` didalam direktori `lua/devtools` dan `devtools.lua` didalam folder `plugin`.

{:.w-80 .overflow-x-auto .md:w-full}

```bash
.
├── lua
│   └── devtools
│       └── init.lua
├── plugin
│   └── devtools.lua
└── README.md
```

### `/Plugin`

Direktori plugin menjadi entrypoint di nvim, yang akan dieksekusi ketika nvim dijalankan. Tahap pertama coba tambahkan kode simple print

{:.w-80 .overflow-x-auto .md:w-full}

```lua
print("muhfaris/devtools.nvim loaded")
```

### `/lua`

Dalam folder `lua` terdapat `devtools` folder yang berisi kode plugin.
Script-script lua yang dibuat dapat di organize disini.

Tambahkan kode berikut pada file `lua/devtools/init.lua`

{:.w-80 .overflow-x-auto .md:w-full}

```lua
local M = {}

function M.setup()
    print("heello from devtools")
end
```

## Install Plugin

Sekarang pindah pada `lazy.nvim`, silahkan tambahkan plugin `devtools` pada
`lazy.nvim`. `dir` adalah path direktori plugin, kamu dapat menggantinya dengan
path direktori plugin kamu.

{:.w-80 .overflow-x-auto .md:w-full}

```lua
return {
  dir = "/home/muhfaris/Documents/projects/sourcecode/src/github.com/muhfaris/devtools.nvim",
 }
```

Output dari plugin [muhfaris/devtools.nvim](https://github.com/muhfaris/devtools.nvim) seperti berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```bash
muhfaris/devtools.nvim loaded
heello from devtools
Press ENTER or type command to continue
```

## Check IP Address

Kita akan membuat plugin [muhfaris/devtools.nvim](https://github.com/muhfaris/devtools.nvim) yang berfungsi untuk mengecek publik IP Address yang digunakan. Web yang akan digunakan beralamat di https://api.ipify.org, web ini akan memberikan response ip public yang kita gunakan.

Jika menggunakan curl, perintah yang digunakan seperti berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```bash
curl https://api.ipify.org
```

### `devtools.lua`

Update kode di `devtools.lua` dengan kode berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```lua
require("devtools")
```

### `lua/devtools/init.lua`

Ubah kode `init.lua` untuk melakukan call request ke web API
`https://api.ipify.org` menjadi seperti berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```lua
local M = {}

function M.setup(opts)
	local handle = io.popen("curl -s https://api.ipify.org")
	if handle == nil then
		vim.api.nvim_out_write("Failed to execute curl command.\n")
		return
	end

	local result = handle:read("*a")
	handle:close()

	if result then
		vim.api.nvim_out_write("Your public IP address is: " .. result .. "\n")
	else
		vim.api.nvim_out_write("Failed to retrieve IP address.\n")
	end
end
```

### Output

Silahkan buka tab pada terminal kalian dan buka nvim, maka akan ditampilkan ip public yang kalian gunakan. Contoh hasil plugin seperti berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```bash
Your public IP address is: xx3.1xx.10.9
Press ENTER or type command to continue
```

### Keybinding

Disini kita akan menambahkan keybinding `Leader + ip` untuk memunculkan ip public yang kita gunakan dari pada menampilkannya ketika menjalankan nvim.

Ubah fungsi `setup` pada kode `init.lua` dengan kode berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```lua
function M.setup(opts)
	opts = opts or {}

	vim.keymap.set("n", "<Leader>ip", function()
		M.fetch_ip()
	end, { desc = "Fetch your public IP address" })
end

```

Buat fungsi baru `fetch_ip` pada `init.lua` dengan kode berikut:

{:.w-80 .overflow-x-auto .md:w-full}

```lua
function M.fetch_ip()
	local handle = io.popen("curl -s https://api.ipify.org")
	if handle == nil then
		vim.api.nvim_out_write("Failed to execute curl command.\n")
		return
	end

	local result = handle:read("*a")
	handle:close()

	if result then
		vim.api.nvim_out_write("Your public IP address is: " .. result .. "\n")
	else
		vim.api.nvim_out_write("Failed to retrieve IP address.\n")
	end
end

```

#### Output

Buka nvim dan tekan tombol `Leader + ip` untuk memunculkan ip public yang kita gunakan.

![Public IP](/assets/images/keybinding-ippublic.png "Public IP")
![Public IP](/assets/images/keybinding-ippublic2.png "Public IP")
