# Perpustakaan Kampus Teknik Informatika

Website statis perpustakaan kampus yang menampilkan katalog 20 buku teknik informatika, fitur peminjaman buku, dan panel login admin.

## Kredensial Admin
- Username: admin
- Password: admin123

## Cara Menjalankan
1. Buka folder project.
2. Jalankan server lokal:
   ```bash
   python -m http.server 8000
   ```
3. Buka browser ke http://localhost:8000

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub.
2. Upload semua file ke repository.
3. Aktifkan GitHub Pages pada branch `main`.
4. Website akan tersedia dengan URL GitHub Pages.

## Fitur
- Katalog 20 buku teknik informatika
- Form pinjam buku
- Simpan data peminjaman di browser menggunakan localStorage
- Panel admin untuk melihat dan mengubah status peminjaman
