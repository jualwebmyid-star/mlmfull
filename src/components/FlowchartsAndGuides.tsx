/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Compass, Terminal, FileText, Server, Lock, Code, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FlowchartsAndGuides() {
  const [activeTab, setActiveTab] = useState<'flowcharts' | 'cpanel_install' | 'api_docs' | 'backups'>('flowcharts');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="documentation-module">
      {/* 1. Module Header */}
      <div className="lg:col-span-12 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Dokumentasi Sistem, Alur UML & Panduan cPanel Hosting
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelajari diagram alur transaksi MLM, integrasi REST API, manual admin, serta cara instalasi otomatis pada Shared Hosting.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs w-full md:w-auto">
          <button
            onClick={() => setActiveTab('flowcharts')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-md font-medium transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'flowcharts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Flowcharts & UML</span>
          </button>
          <button
            onClick={() => setActiveTab('cpanel_install')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-md font-medium transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'cpanel_install' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>cPanel Install Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('api_docs')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-md font-medium transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'api_docs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>REST API Swagger</span>
          </button>
          <button
            onClick={() => setActiveTab('backups')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-md font-medium transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'backups' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Backup & Security</span>
          </button>
        </div>
      </div>

      {/* RENDER TAB: FLOWCHARTS & UML */}
      {activeTab === 'flowcharts' && (
        <div className="lg:col-span-12 space-y-6" id="docs-flowcharts-view">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Flowchart 1: Registration with automatic spillover */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Alur Registrasi Member & Spillover Biner (UML Sequence)
              </h4>
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                  <div>
                    <p className="font-bold text-slate-800">Submit Formulir Registrasi</p>
                    <p className="text-[10px]">Member mengisi detail profil, KYC, dan mengisikan username Sponsor.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                  <div>
                    <p className="font-bold text-slate-800">Cari Slot Kosong Terluar (Spillover)</p>
                    <p className="text-[10px]">Sistem melakukan traversal biner ke arah kiri/kanan terluar hingga menemukan kaki kosong.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                  <div>
                    <p className="font-bold text-slate-800">Menyisipkan Node Biner & Buat Dompet</p>
                    <p className="text-[10px]">Tabel <span className="font-mono bg-slate-100 px-1 rounded">binary_trees</span> di-insert dengan koordinat parent dan posisi leg yang benar.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">4</span>
                  <div>
                    <p className="font-bold text-slate-800">Kirim Notifikasi OTP WhatsApp</p>
                    <p className="text-[10px]">Gateway eksternal mengirim pemberitahuan registrasi sukses secara realtime.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flowchart 2: Pairing Commission & Flush Out limits */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Mesin Kalkulasi Bonus Pasangan & Flush Out
              </h4>
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                  <div>
                    <p className="font-bold text-slate-800">Ambil Volume Kaki Kiri & Kanan</p>
                    <p className="text-[10px]">Settlement Engine membaca kolom <span className="font-mono bg-slate-100 px-1 rounded">left_carry_forward</span> dan <span className="font-mono bg-slate-100 px-1 rounded">right_carry_forward</span>.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                  <div>
                    <p className="font-bold text-slate-800">Hitung Poin Kecocokan (Matching Pairs)</p>
                    <p className="text-[10px]">Mencari angka minimum antara kaki kiri dan kanan (<span className="font-mono bg-slate-100 px-1 rounded">pairs = min(left, right)</span>).</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                  <div>
                    <p className="font-bold text-slate-800">Verifikasi Batas Flush-Out Harian</p>
                    <p className="text-[10px]">Jika total pasangan melebihi batas (misal 10), kelebihan volume akan dibuang demi keamanan finansial.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">4</span>
                  <div>
                    <p className="font-bold text-slate-800">Pemberian PPh 21 & Deposit Komisi</p>
                    <p className="text-[10px]">Sistem menghitung potongan pajak PPh 21, mendaftarkan ledger ledger audit, dan mengkredit dana.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB: CPANEL INSTALLATION GUIDE */}
      {activeTab === 'cpanel_install' && (
        <div className="lg:col-span-12 space-y-6" id="docs-cpanel-view">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-warning" />
              Panduan Penyebaran & Instalasi pada Shared Hosting cPanel
            </h4>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div>
                <h5 className="font-bold text-slate-800 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  Langkah 1: Unggah Berkas & Ekstraksi
                </h5>
                <p className="pl-5 mt-1">
                  Unggah berkas zip Laravel 12 hasil download ke direktori akar (root) hosting Anda (di luar <span className="font-mono bg-slate-100 px-1 rounded">public_html</span> demi menjaga keamanan kode sumber dari akses publik browser). Ekstrak berkas tersebut.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  Langkah 2: Konfigurasi Virtual Directory (Symlink)
                </h5>
                <p className="pl-5 mt-1">
                  Pindahkan seluruh isi folder <span className="font-mono bg-slate-100 px-1 rounded">public/</span> Laravel ke dalam folder <span className="font-mono bg-slate-100 px-1 rounded">public_html/</span> cPanel. Sesuaikan file <span className="font-mono bg-slate-100 px-1 rounded">index.php</span> di dalam <span className="font-mono bg-slate-100 px-1 rounded">public_html</span> untuk mengarah ke lokasi path autoload baru Laravel.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  Langkah 3: Konfigurasi Versi PHP 8.3 & Database
                </h5>
                <p className="pl-5 mt-1">
                  Masuk ke menu <span className="font-semibold text-slate-800">Select PHP Version</span> di cPanel Anda, pilih versi <span className="font-bold text-emerald-600">8.3</span>. Buat database MySQL baru, buat user db, serta tautkan user tersebut ke database dengan hak akses penuh.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  Langkah 4: Jalankan Web Installer Otomatis
                </h5>
                <p className="pl-5 mt-1">
                  Buka domain situs Anda di browser (contoh: <span className="font-semibold text-slate-800">https://website-mlm.com/install</span>). Masukkan kredensial database yang telah dibuat. Sistem installer otomatis akan menulis berkas <span className="font-mono bg-slate-100 px-1 rounded">.env</span>, menjalankan migrasi 80 tabel, menyuntikkan seeder dummy data, dan membuat kunci keamanan aplikasi secara instan!
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  Langkah 5: Konfigurasi Cron Job untuk Komisi Harian
                </h5>
                <p className="pl-5 mt-1">
                  Masuk ke menu <span className="font-semibold text-slate-800">Cron Jobs</span> di cPanel. Tambahkan entri cron baru untuk memicu settlement bonus biner setiap jam 00:00 malam:
                </p>
                <div className="pl-5 mt-1.5">
                  <code className="bg-slate-950 text-slate-300 font-mono p-2.5 rounded-lg block text-[10px] border border-slate-900">
                    {"* * * * * cd /home/username_cpanel/project_mlm && php artisan schedule:run >> /dev/null 2>&1"}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB: REST API SWAGGER DOCS */}
      {activeTab === 'api_docs' && (
        <div className="lg:col-span-12 space-y-6" id="docs-api-view">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-600" />
              REST API Swagger & Webhook OpenAPI Specifications
            </h4>

            {/* Interactive API routes presentation */}
            <div className="space-y-3.5 text-xs">
              
              {/* Endpoint 1 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-emerald-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between font-mono">
                  <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded">POST</span>
                  <span className="font-bold text-slate-700">/api/v1/auth/register</span>
                  <span className="text-slate-500">Akses: Public</span>
                </div>
                <div className="p-3.5 bg-slate-50/50 space-y-2 text-slate-600 leading-normal">
                  <p className="font-semibold">Mendaftarkan member MLM baru dan menempatkannya secara biner otomatis.</p>
                  <p className="font-mono text-[10px] text-slate-400">Request Body (JSON): <span className="text-emerald-600">{"{ name, username, email, password, sponsor_username, placement_position }"}</span></p>
                  <p className="font-mono text-[10px] text-slate-400">Response (201): <span className="text-emerald-700">{"{ status: 'success', message: 'Registrasi berhasil', data: { id, username } }"}</span></p>
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-blue-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between font-mono">
                  <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded">GET</span>
                  <span className="font-bold text-slate-700">/api/v1/genealogy/binary/{"{id?}"}</span>
                  <span className="text-slate-500">Akses: Member (JWT Bearer Token)</span>
                </div>
                <div className="p-3.5 bg-slate-50/50 space-y-2 text-slate-600 leading-normal">
                  <p className="font-semibold">Mengambil silsilah struktur binary tree lengkap dengan volume leg carry forward kiri & kanan.</p>
                  <p className="font-mono text-[10px] text-slate-400">Headers: <span className="text-emerald-600">{"Authorization: Bearer <JWT_TOKEN>"}</span></p>
                </div>
              </div>

              {/* Endpoint 3 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-emerald-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between font-mono">
                  <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded">POST</span>
                  <span className="font-bold text-slate-700">/api/v1/withdrawal/request</span>
                  <span className="text-slate-500">Akses: Member (JWT Token)</span>
                </div>
                <div className="p-3.5 bg-slate-50/50 space-y-2 text-slate-600 leading-normal">
                  <p className="font-semibold">Mengajukan pencairan dana bonus. Sistem akan memverifikasi kesesuaian tanda tangan PIN & OTP.</p>
                  <p className="font-mono text-[10px] text-slate-400">Request Body (JSON): <span className="text-emerald-600">{"{ amount, bank_name, account_number, account_name, pin, otp }"}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB: BACKUP & SECURITY */}
      {activeTab === 'backups' && (
        <div className="lg:col-span-12 space-y-6" id="docs-security-view">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-red-600" />
              Sistem Keamanan Tingkat Tinggi (Enterprise Cybersecurity Rules)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
              {/* Card Security 1 */}
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  Perlindungan SQL-Injection & XSS
                </p>
                <p className="text-[11px]">
                  Laravel Eloquent ORM secara default menggunakan parameter binding PDO yang 100% aman dari eksploitasi SQL-Injection. Seluruh parameter text juga disaring menggunakan middleware XSS sanitization.
                </p>
              </div>

              {/* Card Security 2 */}
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  Autentikasi Dua Faktor (2FA) & Transaksi PIN
                </p>
                <p className="text-[11px]">
                  Keamanan dana member terlindungi berlapis menggunakan Google Authenticator (2FA) untuk gerbang login perangkat baru, dan 6 Digit PIN finansial statis yang dienkripsi untuk setiap request pencairan dana bonus.
                </p>
              </div>

              {/* Card Security 3 */}
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  Rutinitas Backup Basis Data Otomatis
                </p>
                <p className="text-[11px]">
                  Sistem backup terintegrasi dengan penjadwalan otomatis (Daily database backups) ke Google Drive atau AWS S3. Anda dapat memicu backup data SQL secara manual menggunakan baris perintah:
                </p>
                <code className="bg-slate-950 text-slate-300 font-mono p-2 rounded block text-[9px] mt-1.5 border border-slate-900">
                  php artisan backup:run --only-db
                </code>
              </div>

              {/* Card Security 4 */}
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  Rate Limiting & CSRF Shield
                </p>
                <p className="text-[11px]">
                  Gerbang API diamankan menggunakan pembatas beban rate-limiting (maksimal 60 request per menit per alamat IP) untuk mencegah spamming bot/brute force, serta token CSRF untuk semua rute web formulir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
