# 🚀 MikroTik Web Manager (MikroTik Apps)

Aplikasi web modern berbasis **Laravel 12**, **Inertia.js v3**, **Vue 3**, dan **Tailwind CSS v4** yang berfungsi sebagai alternatif **WinBox** / **WebFig** berbasis web responsif untuk memonitor, mengonfigurasi, dan mengelola router MikroTik RouterOS secara _real-time_.

---

## 🌟 Fitur Utama (Features)

### 1. 📊 Live Router Dashboard & Monitoring

- **Statistik Perangkat Keras**: Monitor CPU load, RAM usage, HDD free space, Voltage, Temperature, dan Uptime secara _real-time_.
- **Interface Traffic**: Daftar seluruh port jaringan (Ethernet, Bridge, WLAN) dengan pembacaan trafik Rx/Tx live byte & packet.
- **DHCP Server Leases**: Tabel pemantauan client DHCP aktif, hostname, MAC address, dan status masa sewa (_expires-after_).
- **Hotspot & PPPoE Active**: Pemantauan user hotspot voucher dan koneksi PPPoE yang sedang aktif.
- **Tools Diagnostik**: Fitur **Ping Utility** interaktif langsung dari router ke host tujuan serta tombol **Remote Reboot**.
- **Auto-Refresh (6s)**: Polling statistik otomatis yang dapat diaktifkan/dinonaktifkan kapan saja.

---

### 2. 🛡️ Firewall & Security Management (WinBox-Style)

#### A. Filter Rules (`/ip/firewall/filter`)

- **CRUD Penuh**: Tambah, edit, hapus, dan aktifkan/nonaktifkan (_enable/disable toggle_) aturan filter.
- **Chain Filter**: Pengelompokan aturan berdasarkan `input`, `forward`, dan `output`.
- **Indikator Flag MikroTik**: Menampilkan status **`X`** (_Disabled_), **`D`** (_Dynamic_), dan **`I`** (_Invalid_).
- **Kriteria Match Lengkap**:
  - Protocol (TCP, UDP, ICMP, GRE, IPSec, dll)
  - Port Source & Destination
  - IP Address / Subnet Source & Destination
  - Interface In & Out
  - Address List Source & Destination
  - Connection State (_established, related, new, invalid, untracked_)
  - Action (_accept, drop, reject, fasttrack-connection, passthrough, log_)
- **Live Counter**: Penghitung jumlah paket (_packets_) dan ukuran data (_bytes_) yang cocok dengan aturan.

#### B. NAT Rules (`/ip/firewall/nat`)

- **Wizard & Preset Cepat**:
  1. **Port Forwarding (`dst-nat`)**: Wizard mudah untuk meneruskan port publik WAN ke IP lokal server internal (contoh: WAN port `8080` $\rightarrow$ Server LAN `192.168.88.50:80`).
  2. **Internet Sharing (`masquerade`)**: Konfigurasi masquerade source NAT keluar interface WAN dalam 1 klik.
  3. **Custom NAT**: Konfigurasi bebas untuk `src-nat`, `dst-nat`, `redirect`, `netmap`, dll.
- **Live Translation Mapping**: Menampilkan port asal dan port tujuan terjemahan secara jelas.

#### C. Address Lists (`/ip/firewall/address-list`)

- Pengelompokan daftar IP tunggal, Subnet CIDR (contoh `192.168.88.0/24`), atau Domain name (FQDN).
- Dukungan **Timeout Expiration** (Permanen atau batas waktu hitung mundur).
- Filter cepat berdasarkan nama list (contoh `Admin_WhiteList`, `Blocked_Scanners`, `Local_Networks`).

---

### 3. 🔄 Multi-Router Session & Fast Switcher

- Simpan banyak profil router (IP/Host, API Port, Username, Password terenkripsi, SSL).
- **Router Switcher Bar**: Berpindah antar router aktif secara instan tanpa perlu login ulang.
- **Uji Koneksi (Test Connection)**: Cek latensi (ping ms), versi RouterOS, dan identitas board sebelum menyimpan.
- **Offline Mock/Demo Engine**: Otomatis menyediakan simulasi dataset RouterOS yang realistis jika router fisik sedang offline.

---

## 🏗️ Arsitektur & Teknologi

- **Backend**:
  - **PHP 8.3+** & **Laravel 13**
  - **Laravel Fortify** (Autentikasi aman & Passkeys/Two-Factor)
  - **RouterOS Native Socket Client** ([`RouterOSService.php`](app/Services/RouterOSService.php)) yang berkomunikasi langsung via protokol binary RouterOS API (Port default `8728` / `8729` SSL).
- **Frontend**:
  - **Vue 3** (Composition API, `<script setup>`)
  - **Inertia.js v3** (SPA modern tanpa REST API boilerplate)
  - **Tailwind CSS v4** & **Reka UI / Lucide Icons**
  - **Vite 8** + **Laravel Wayfinder** (Type-safe routing)

---

## 📁 Struktur Direktori Proyek

```
mikrotik-apps/
├── app/
│   ├── Http/Controllers/
│   │   ├── RouterController.php      # Dashboard, manajemen profil router, stats
│   │   └── FirewallController.php    # Handler CRUD Filter, NAT, Address Lists
│   ├── Models/
│   │   └── Router.php                # Model router tersimpan & relasi user
│   └── Services/
│       └── RouterOSService.php       # Engine socket binary client RouterOS API
├── resources/
│   └── js/
│       ├── components/
│       │   ├── firewall/             # Tabel & Modal Filter, NAT, Address List
│       │   ├── router/               # Resource card, Interface table, DHCP, Quick login
│       │   └── ui/                   # Shadcn/Reka UI primitives (Button, Dialog, Badge, dll)
│       ├── pages/
│       │   ├── Dashboard.vue         # Halaman utama monitoring router
│       │   ├── firewall/Index.vue    # Halaman manajemen Firewall, NAT, Address List
│       │   └── routers/Index.vue     # Halaman kelola daftar router
│       └── types/
│           └── router.ts             # TypeScript interfaces data RouterOS
└── routes/
    └── web.php                       # Route definitions
```

---

## ⚙️ Persyaratan Sistem & Instalasi

### 1. Prasyarat

- **PHP >= 8.3** (dengan ekstensi `sockets`, `openssl`, `pdo_sqlite` / `pdo_mysql`)
- **Composer**
- **Node.js >= 20.x** & **npm**
- Router MikroTik dengan service API aktif:
  ```routeros
  /ip service enable api
  # Atau untuk koneksi terenkripsi SSL:
  /ip service enable api-ssl
  ```

### 2. Langkah Instalasi

1. **Clone repository & masuk ke direktori**:

   ```bash
   git clone https://github.com/kertopati007/mikrotik-manage.git
   ```

2. **Install dependensi PHP & JavaScript**:

   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment**:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Migrasi Database**:

   ```bash
   php artisan migrate
   ```

5. **Jalankan Development Server**:

   ```bash
   # Terminal 1 (Backend)
   php artisan serve

   # Terminal 2 (Vite Frontend)
   npm run dev
   ```

6. **Build untuk Production**:
   ```bash
   npm run build
   ```

---

## 📖 Pemetaan Command RouterOS API

| Modul               | Endpoint Aplikasi | Perintah RouterOS API                              |
| ------------------- | ----------------- | -------------------------------------------------- |
| **System Info**     | `/routers/stats`  | `/system/resource/print`, `/system/identity/print` |
| **Interfaces**      | `/routers/stats`  | `/interface/print`                                 |
| **DHCP Leases**     | `/routers/stats`  | `/ip/dhcp-server/lease/print`                      |
| **Firewall Filter** |
