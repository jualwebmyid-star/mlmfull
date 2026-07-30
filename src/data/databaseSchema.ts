/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchemaTable {
  name: string;
  category: string;
  description: string;
  fields: {
    name: string;
    type: string;
    attributes?: string;
    description: string;
  }[];
  sql: string;
}

export const CATEGORIES = [
  'Users & Authentication',
  'Genealogy & Networks',
  'Packages & Upgrades',
  'Wallet & Transactions',
  'MLM Bonuses & Rules',
  'Withdrawals & Bank Accounts',
  'Deposits & Gateway Logs',
  'Ranks & Rewards',
  'E-Commerce & Checkout',
  'Invoices & Shipments',
  'System Logs & Audits'
];

export const DATABASE_SCHEMA_LIST: SchemaTable[] = [
  // CATEGORY: Users & Authentication
  {
    name: 'users',
    category: 'Users & Authentication',
    description: 'Tabel utama penyimpan kredensial login member dan status akun.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik member.' },
      { name: 'username', type: 'VARCHAR(50)', attributes: 'UNIQUE, INDEX', description: 'Username unik untuk login.' },
      { name: 'email', type: 'VARCHAR(100)', attributes: 'UNIQUE', description: 'Alamat email terdaftar.' },
      { name: 'password', type: 'VARCHAR(255)', attributes: 'NOT NULL', description: 'Hash password (bcrypt).' },
      { name: 'name', type: 'VARCHAR(150)', attributes: 'NOT NULL', description: 'Nama lengkap member.' },
      { name: 'phone', type: 'VARCHAR(20)', attributes: 'NULLable', description: 'Nomor telepon aktif.' },
      { name: 'status', type: 'ENUM("active", "suspended", "inactive")', attributes: 'DEFAULT "inactive"', description: 'Status keanggotaan.' },
      { name: 'email_verified_at', type: 'TIMESTAMP', attributes: 'NULLable', description: 'Waktu verifikasi email.' },
      { name: 'two_factor_secret', type: 'TEXT', attributes: 'NULLable', description: 'Kunci rahasia Google Authenticator 2FA.' },
      { name: 'remember_token', type: 'VARCHAR(100)', attributes: 'NULL', description: 'Token remember me.' },
      { name: 'created_at', type: 'TIMESTAMP', attributes: 'NULL', description: 'Waktu pendaftaran.' }
    ],
    sql: `CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  status ENUM('active', 'suspended', 'inactive') DEFAULT 'inactive',
  email_verified_at TIMESTAMP NULL DEFAULT NULL,
  two_factor_secret TEXT DEFAULT NULL,
  remember_token VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    name: 'user_profiles',
    category: 'Users & Authentication',
    description: 'Profil detail member termasuk alamat fisik dan jenis kelamin.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik profil.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK (users.id)', description: 'Relasi ke tabel users.' },
      { name: 'gender', type: 'ENUM("M", "F")', attributes: 'NULL', description: 'Jenis kelamin.' },
      { name: 'address', type: 'TEXT', attributes: 'NULL', description: 'Alamat lengkap.' },
      { name: 'city', type: 'VARCHAR(100)', attributes: 'NULL', description: 'Kota tinggal.' },
      { name: 'province', type: 'VARCHAR(100)', attributes: 'NULL', description: 'Provinsi tinggal.' },
      { name: 'postal_code', type: 'VARCHAR(10)', attributes: 'NULL', description: 'Kode pos.' }
    ],
    sql: `CREATE TABLE user_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  gender ENUM('M', 'F') DEFAULT NULL,
  address TEXT DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  province VARCHAR(100) DEFAULT NULL,
  postal_code VARCHAR(10) DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
  },
  {
    name: 'user_kyc',
    category: 'Users & Authentication',
    description: 'Penyimpanan dokumen KYC (KTP, NPWP, Selfie) untuk verifikasi penarikan dana.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik data KYC.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK, UNIQUE', description: 'Relasi ke users.' },
      { name: 'ktp_number', type: 'VARCHAR(16)', attributes: 'NOT NULL', description: 'NIK KTP.' },
      { name: 'ktp_photo', type: 'VARCHAR(255)', attributes: 'NOT NULL', description: 'Path foto KTP.' },
      { name: 'npwp_number', type: 'VARCHAR(20)', attributes: 'NULLable', description: 'Nomor NPWP.' },
      { name: 'npwp_photo', type: 'VARCHAR(255)', attributes: 'NULLable', description: 'Path foto NPWP.' },
      { name: 'selfie_photo', type: 'VARCHAR(255)', attributes: 'NOT NULL', description: 'Path foto selfie memegang KTP.' },
      { name: 'bank_book_photo', type: 'VARCHAR(255)', attributes: 'NOT NULL', description: 'Path foto halaman depan buku tabungan.' },
      { name: 'status', type: 'ENUM("pending", "approved", "rejected")', attributes: 'DEFAULT "pending"', description: 'Status KYC.' },
      { name: 'verified_by', type: 'BIGINT UNSIGNED', attributes: 'FK (users.id)', description: 'Admin yang memverifikasi.' },
      { name: 'verified_at', type: 'TIMESTAMP', attributes: 'NULL', description: 'Tanggal verifikasi.' }
    ],
    sql: `CREATE TABLE user_kyc (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED UNIQUE NOT NULL,
  ktp_number VARCHAR(16) NOT NULL,
  ktp_photo VARCHAR(255) NOT NULL,
  npwp_number VARCHAR(20) DEFAULT NULL,
  npwp_photo VARCHAR(255) DEFAULT NULL,
  selfie_photo VARCHAR(255) NOT NULL,
  bank_book_photo VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  verified_by BIGINT UNSIGNED DEFAULT NULL,
  verified_at TIMESTAMP NULL DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
  },

  // CATEGORY: Genealogy & Networks
  {
    name: 'sponsors',
    category: 'Genealogy & Networks',
    description: 'Relasi unilevel langsung (Sponsorship). Siapa mensponsori siapa.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik sponsor.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK, UNIQUE', description: 'ID member (Downline).' },
      { name: 'sponsor_id', type: 'BIGINT UNSIGNED', attributes: 'FK, INDEX', description: 'ID yang mensponsori (Upline langsung).' },
      { name: 'generation', type: 'INT', attributes: 'DEFAULT 1', description: 'Level generasi dari sponsor.' }
    ],
    sql: `CREATE TABLE sponsors (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED UNIQUE NOT NULL,
  sponsor_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sponsor_id (sponsor_id)
) ENGINE=InnoDB;`
  },
  {
    name: 'binary_trees',
    category: 'Genealogy & Networks',
    description: 'Struktur binary MLM. Menentukan posisi Kiri (Left) atau Kanan (Right).',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik node.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK, UNIQUE', description: 'ID member.' },
      { name: 'parent_id', type: 'BIGINT UNSIGNED', attributes: 'FK, INDEX', description: 'ID upline tempat menempel.' },
      { name: 'position', type: 'ENUM("left", "right")', attributes: 'NOT NULL', description: 'Kaki Kiri atau Kanan.' },
      { name: 'left_pv', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Point Volume di kaki kiri.' },
      { name: 'right_pv', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Point Volume di kaki kanan.' },
      { name: 'left_carry_forward', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Sisa point kiri untuk pencocokan berikutnya.' },
      { name: 'right_carry_forward', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Sisa point kanan untuk pencocokan berikutnya.' }
    ],
    sql: `CREATE TABLE binary_trees (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED UNIQUE NOT NULL,
  parent_id BIGINT UNSIGNED DEFAULT NULL,
  position ENUM('left', 'right') NOT NULL,
  left_pv DECIMAL(15,2) DEFAULT 0.00,
  right_pv DECIMAL(15,2) DEFAULT 0.00,
  left_carry_forward DECIMAL(15,2) DEFAULT 0.00,
  right_carry_forward DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_parent_position (parent_id, position)
) ENGINE=InnoDB;`
  },
  {
    name: 'ancestors_paths',
    category: 'Genealogy & Networks',
    description: 'Tabel closure path untuk query silsilah downline tak terbatas dengan sangat cepat.',
    fields: [
      { name: 'ancestor_id', type: 'BIGINT UNSIGNED', attributes: 'FK, PK', description: 'ID upline/atasan.' },
      { name: 'descendant_id', type: 'BIGINT UNSIGNED', attributes: 'FK, PK', description: 'ID downline/bawahan.' },
      { name: 'depth', type: 'INT', attributes: 'NOT NULL', description: 'Jarak level kedalaman (generasi).' }
    ],
    sql: `CREATE TABLE ancestors_paths (
  ancestor_id BIGINT UNSIGNED NOT NULL,
  descendant_id BIGINT UNSIGNED NOT NULL,
  depth INT NOT NULL,
  PRIMARY KEY (ancestor_id, descendant_id),
  FOREIGN KEY (ancestor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (descendant_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_descendant_depth (descendant_id, depth)
) ENGINE=InnoDB;`
  },

  // CATEGORY: Packages & Upgrades
  {
    name: 'packages',
    category: 'Packages & Upgrades',
    description: 'Master paket investasi atau join MLM dengan nilai PV/BV/CV.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik paket.' },
      { name: 'name', type: 'VARCHAR(100)', attributes: 'NOT NULL', description: 'Nama paket (Basic, Silver, Gold).' },
      { name: 'price', type: 'DECIMAL(15,2)', attributes: 'NOT NULL', description: 'Harga beli paket.' },
      { name: 'pv', type: 'INT', attributes: 'DEFAULT 0', description: 'Point Value (Kualifikasi Rank).' },
      { name: 'bv', type: 'INT', attributes: 'DEFAULT 0', description: 'Business Value (Basis Komisi Sponsor).' },
      { name: 'cv', type: 'INT', attributes: 'DEFAULT 0', description: 'Commissionable Value (Basis Komisi Pasangan).' },
      { name: 'status', type: 'ENUM("active", "inactive")', attributes: 'DEFAULT "active"', description: 'Status keaktifan paket.' }
    ],
    sql: `CREATE TABLE packages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  pv INT DEFAULT 0,
  bv INT DEFAULT 0,
  cv INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;`
  },
  {
    name: 'user_packages',
    category: 'Packages & Upgrades',
    description: 'Histori pembelian dan status paket aktif milik member.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik pembelian.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK, INDEX', description: 'ID member pembeli.' },
      { name: 'package_id', type: 'BIGINT UNSIGNED', attributes: 'FK', description: 'ID paket yang dibeli.' },
      { name: 'amount_paid', type: 'DECIMAL(15,2)', attributes: 'NOT NULL', description: 'Uang yang dibayarkan.' },
      { name: 'status', type: 'ENUM("active", "expired", "renewed")', attributes: 'DEFAULT "active"', description: 'Status paket saat ini.' },
      { name: 'expired_at', type: 'TIMESTAMP', attributes: 'NULL', description: 'Tanggal kadaluarsa otomatis.' }
    ],
    sql: `CREATE TABLE user_packages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  package_id BIGINT UNSIGNED NOT NULL,
  amount_paid DECIMAL(15,2) NOT NULL,
  status ENUM('active', 'expired', 'renewed') DEFAULT 'active',
  activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expired_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
  },

  // CATEGORY: Wallet & Transactions
  {
    name: 'wallets',
    category: 'Wallet & Transactions',
    description: 'Penyimpanan saldo multi-wallet untuk setiap member.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik wallet.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK, UNIQUE', description: 'ID member pemilik.' },
      { name: 'bonus_balance', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Saldo bonus tunai hasil MLM.' },
      { name: 'cashback_balance', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Saldo cashback belanja.' },
      { name: 'reward_balance', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Saldo point reward.' },
      { name: 'deposit_balance', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Saldo deposit internal hasil topup.' },
      { name: 'shopping_balance', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Saldo khusus belanja produk.' }
    ],
    sql: `CREATE TABLE wallets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED UNIQUE NOT NULL,
  bonus_balance DECIMAL(15,2) DEFAULT 0.00,
  cashback_balance DECIMAL(15,2) DEFAULT 0.00,
  reward_balance DECIMAL(15,2) DEFAULT 0.00,
  deposit_balance DECIMAL(15,2) DEFAULT 0.00,
  shopping_balance DECIMAL(15,2) DEFAULT 0.00,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
  },
  {
    name: 'wallet_ledgers',
    category: 'Wallet & Transactions',
    description: 'Buku besar audit mutasi saldo (Double-Entry Bookkeeping) yang anti manipulasi.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID transaksi.' },
      { name: 'wallet_id', type: 'BIGINT UNSIGNED', attributes: 'FK, INDEX', description: 'ID wallet yang bermutasi.' },
      { name: 'wallet_type', type: 'VARCHAR(30)', description: 'Jenis saldo (bonus, deposit, reward).' },
      { name: 'type', type: 'ENUM("debit", "credit")', description: 'Debit (Dana Masuk) atau Credit (Dana Keluar).' },
      { name: 'amount', type: 'DECIMAL(15,2)', description: 'Nominal mutasi.' },
      { name: 'balance_before', type: 'DECIMAL(15,2)', description: 'Saldo sebelum transaksi.' },
      { name: 'balance_after', type: 'DECIMAL(15,2)', description: 'Saldo setelah transaksi.' },
      { name: 'description', type: 'TEXT', description: 'Keterangan transaksi.' }
    ],
    sql: `CREATE TABLE wallet_ledgers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wallet_id BIGINT UNSIGNED NOT NULL,
  wallet_type ENUM('bonus', 'cashback', 'reward', 'deposit', 'shopping') NOT NULL,
  type ENUM('debit', 'credit') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
  INDEX idx_ledger_wallet_type (wallet_id, wallet_type)
) ENGINE=InnoDB;`
  },

  // CATEGORY: MLM Bonuses & Rules
  {
    name: 'bonus_settings',
    category: 'MLM Bonuses & Rules',
    description: 'Pengaturan master 40+ jenis bonus MLM yang dapat diaktifkan/matikan oleh admin.',
    fields: [
      { name: 'id', type: 'VARCHAR(50)', attributes: 'PK', description: 'Kode identifikasi bonus (misal: "bonus_sponsor").' },
      { name: 'name', type: 'VARCHAR(150)', attributes: 'NOT NULL', description: 'Nama bonus.' },
      { name: 'is_active', type: 'BOOLEAN', attributes: 'DEFAULT TRUE', description: 'Status aktif bonus.' },
      { name: 'calculation_type', type: 'ENUM("percentage", "fixed")', description: 'Persentase atau nominal rupiah.' },
      { name: 'value', type: 'DECIMAL(15,2)', description: 'Nilai hitungan bonus.' },
      { name: 'min_omzet', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Minimal omzet kelompok jika diperlukan.' },
      { name: 'max_payout_limit', type: 'DECIMAL(15,2)', description: 'Batas maksimum payout bonus (Flushout).' }
    ],
    sql: `CREATE TABLE bonus_settings (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  calculation_type ENUM('percentage', 'fixed') NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  min_omzet DECIMAL(15,2) DEFAULT 0.00,
  max_payout_limit DECIMAL(15,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;`
  },
  {
    name: 'commissions',
    category: 'MLM Bonuses & Rules',
    description: 'Histori perolehan bonus MLM lengkap dengan detail potongan pajak dan biaya admin.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID komisi.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK, INDEX', description: 'ID member penerima.' },
      { name: 'bonus_type_id', type: 'VARCHAR(50)', attributes: 'FK', description: 'Jenis bonus.' },
      { name: 'gross_amount', type: 'DECIMAL(15,2)', description: 'Nominal kotor.' },
      { name: 'tax_amount', type: 'DECIMAL(15,2)', description: 'Potongan PPh (pajak).' },
      { name: 'admin_fee', type: 'DECIMAL(15,2)', description: 'Potongan biaya admin.' },
      { name: 'net_amount', type: 'DECIMAL(15,2)', description: 'Nominal bersih yang masuk wallet.' },
      { name: 'source_member_id', type: 'BIGINT UNSIGNED', attributes: 'FK', description: 'Downline pemicu bonus.' }
    ],
    sql: `CREATE TABLE commissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  bonus_type_id VARCHAR(50) NOT NULL,
  gross_amount DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0.00,
  admin_fee DECIMAL(15,2) DEFAULT 0.00,
  net_amount DECIMAL(15,2) NOT NULL,
  source_member_id BIGINT UNSIGNED DEFAULT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bonus_type_id) REFERENCES bonus_settings(id),
  FOREIGN KEY (source_member_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;`
  },

  // CATEGORY: Withdrawals & Bank Accounts
  {
    name: 'withdrawals',
    category: 'Withdrawals & Bank Accounts',
    description: 'Pencatatan permintaan penarikan dana bonus member ke Rekening Bank / E-Wallet.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID penarikan.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK, INDEX', description: 'ID member.' },
      { name: 'amount', type: 'DECIMAL(15,2)', description: 'Nominal yang ditarik.' },
      { name: 'admin_fee', type: 'DECIMAL(15,2)', description: 'Potongan biaya admin WD.' },
      { name: 'tax_amount', type: 'DECIMAL(15,2)', description: 'Potongan pajak.' },
      { name: 'net_amount', type: 'DECIMAL(15,2)', description: 'Uang bersih yang dicairkan.' },
      { name: 'status', type: 'ENUM("pending", "approved", "rejected")', description: 'Status penarikan.' },
      { name: 'bank_name', type: 'VARCHAR(100)', description: 'Nama Bank / E-Wallet tujuan.' }
    ],
    sql: `CREATE TABLE withdrawals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  admin_fee DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) NOT NULL,
  net_amount DECIMAL(15,2) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_name VARCHAR(150) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  processed_by BIGINT UNSIGNED DEFAULT NULL,
  processed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;`
  },

  // CATEGORY: Deposits & Gateway Logs
  {
    name: 'deposits',
    category: 'Deposits & Gateway Logs',
    description: 'Histori transaksi topup saldo deposit baik manual maupun gateway otomatis.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID deposit.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK', description: 'ID member.' },
      { name: 'amount', type: 'DECIMAL(15,2)', description: 'Nominal deposit.' },
      { name: 'gateway', type: 'VARCHAR(50)', description: 'Xendit, Midtrans, Tripay, Manual, dll.' },
      { name: 'reference_code', type: 'VARCHAR(100)', description: 'ID referensi dari payment gateway.' },
      { name: 'status', type: 'ENUM("pending", "completed", "cancelled")', description: 'Status deposit.' }
    ],
    sql: `CREATE TABLE deposits (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  gateway VARCHAR(50) NOT NULL,
  reference_code VARCHAR(100) UNIQUE NOT NULL,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
  },

  // CATEGORY: Ranks & Rewards
  {
    name: 'ranks',
    category: 'Ranks & Rewards',
    description: 'Tingkatan/Peringkat member MLM dan syarat kualifikasi volumenya.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID Peringkat.' },
      { name: 'name', type: 'VARCHAR(50)', attributes: 'UNIQUE', description: 'Nama peringkat (Gold, Diamond, dll).' },
      { name: 'required_sponsor', type: 'INT', attributes: 'DEFAULT 0', description: 'Syarat minimal mensponsori langsung.' },
      { name: 'required_left_pv', type: 'INT', attributes: 'DEFAULT 0', description: 'Minimal volume PV kaki kiri.' },
      { name: 'required_right_pv', type: 'INT', attributes: 'DEFAULT 0', description: 'Minimal volume PV kaki kanan.' },
      { name: 'rank_bonus', type: 'DECIMAL(15,2)', attributes: 'DEFAULT 0.00', description: 'Hadiah berupa uang tunai otomatis.' }
    ],
    sql: `CREATE TABLE ranks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  required_sponsor INT DEFAULT 0,
  required_left_pv INT DEFAULT 0,
  required_right_pv INT DEFAULT 0,
  rank_bonus DECIMAL(15,2) DEFAULT 0.00,
  reward_item VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;`
  },
  {
    name: 'user_ranks',
    category: 'Ranks & Rewards',
    description: 'Histori promosi kenaikan peringkat otomatis member.',
    fields: [
      { name: 'id', type: 'BIGINT UNSIGNED', attributes: 'PK, AUTO_INCREMENT', description: 'ID unik histori.' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', attributes: 'FK, INDEX', description: 'ID member.' },
      { name: 'rank_id', type: 'BIGINT UNSIGNED', attributes: 'FK', description: 'ID Peringkat baru.' },
      { name: 'is_active', type: 'BOOLEAN', attributes: 'DEFAULT TRUE', description: 'Status kualifikasi rank aktif saat ini.' }
    ],
    sql: `CREATE TABLE user_ranks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  rank_id BIGINT UNSIGNED NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (rank_id) REFERENCES ranks(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
  }
];

export const OTHER_TABLES_INVENTORY = [
  // Users & Auth Module
  { name: 'user_devices', module: 'Users & Auth', purpose: 'Pelacakan perangkat login aktif (Security Audit).' },
  { name: 'user_login_histories', module: 'Users & Auth', purpose: 'Riwayat lengkap IP address, lokasi, dan browser login member.' },
  { name: 'password_reset_tokens', module: 'Users & Auth', purpose: 'Penyimpanan secure token reset password.' },
  { name: 'email_otps', module: 'Users & Auth', purpose: 'Kode verifikasi sekali pakai untuk registrasi/transaksi keuangan.' },
  
  // Genealogy Networks Module
  { name: 'matrix_trees', module: 'Genealogy Network', purpose: 'Silsilah dengan struktur Force Matrix (e.g. 3x3, 5x5).' },
  { name: 'spillover_logs', module: 'Genealogy Network', purpose: 'Pencatatan penempatan limpahan otomatis (spillover) dari upline.' },
  { name: 'generation_volumes', module: 'Genealogy Network', purpose: 'Akumulasi omzet mingguan untuk komisi unilevel generasi.' },
  
  // MLM Bonuses Settings Module
  { name: 'pairing_logs', module: 'MLM Bonuses', purpose: 'Catatan rinci proses matching bonus harian kaki kiri & kanan.' },
  { name: 'flushout_logs', module: 'MLM Bonuses', purpose: 'Log pembuangan volume kelebihan batas harian (Flush Out).' },
  { name: 'compression_history', module: 'MLM Bonuses', purpose: 'Catatan proses mampat otomatis upline (Dynamic Compression) pasif.' },
  { name: 'global_profit_pools', module: 'MLM Bonuses', purpose: 'Persentase dividen perusahaan untuk dibagikan ke peringkat elit.' },
  
  // Wallet & Financials
  { name: 'internal_transfers', module: 'Wallet & Finance', purpose: 'Pencatatan pengiriman saldo antar member.' },
  { name: 'wallet_audit_locks', module: 'Wallet & Finance', purpose: 'Penguncian baris baris transaksi saldo demi menghindari race-condition.' },
  { name: 'tax_rates', module: 'Wallet & Finance', purpose: 'Tarif PPh 21 bagi member ber-NPWP (2.5%) vs non-NPWP (5.0%).' },
  
  // E-Commerce
  { name: 'product_categories', module: 'E-Commerce', purpose: 'Pengelompokan kategori produk MLM (Suplemen, Kosmetik, dll).' },
  { name: 'products', module: 'E-Commerce', purpose: 'Katalog produk retail pembelanjaan repeat-order.' },
  { name: 'product_stocks', module: 'E-Commerce', purpose: 'Manajemen mutasi stok produk di berbagai gudang cabang.' },
  { name: 'product_images', module: 'E-Commerce', purpose: 'Galeri multi-foto untuk display produk.' },
  { name: 'carts', module: 'E-Commerce', purpose: 'Penyimpanan item belanja sementara milik member.' },
  { name: 'orders', module: 'E-Commerce', purpose: 'Tabel master penjualan produk retail / repeat-order.' },
  { name: 'order_items', module: 'E-Commerce', purpose: 'Rincian produk dan kuantiti yang dibeli dalam satu invoice.' },
  { name: 'product_vouchers', module: 'E-Commerce', purpose: 'Penyimpanan kode promo diskon / cashback belanja.' },
  
  // Invoices & Shipments
  { name: 'invoices', module: 'Invoices & Shipping', purpose: 'Faktur resmi transaksi finansial dilengkapi kode barcode/QR.' },
  { name: 'shipments', module: 'Invoices & Shipping', purpose: 'Manajemen kurir, ongkir, resi pelacakan ekspedisi.' },
  { name: 'shipment_trackers', module: 'Invoices & Shipping', purpose: 'Penyimpanan tracking history status paket pengiriman.' },

  // Admin & Super Admin Module
  { name: 'admins', module: 'Admin Panel', purpose: 'Data akun staff admin pengelola sistem.' },
  { name: 'roles', module: 'Admin Panel', purpose: 'Sistem Role (Super Admin, Financial Staff, CS).' },
  { name: 'permissions', module: 'Admin Panel', purpose: 'Hak akses fitur dinamis sistem.' },
  { name: 'role_permissions', module: 'Admin Panel', purpose: 'Pivot tabel pemetaan hak akses per role.' },
  { name: 'admin_audit_logs', module: 'Admin Panel', purpose: 'Catatan aktivitas vital administrator (Siapa mengubah apa).' },
  { name: 'support_tickets', module: 'Admin Panel', purpose: 'Sistem pengaduan keluhan / bantuan member (Help Desk).' },
  { name: 'support_ticket_replies', module: 'Admin Panel', purpose: 'Percakapan riwayat replies bantuan.' },
  { name: 'blogs', module: 'Admin Panel', purpose: 'Manajemen postingan artikel edukasi / berita perusahaan.' },
  { name: 'company_settings', module: 'Admin Panel', purpose: 'Pengaturan nama, logo, telp, sosial media perusahaan.' },
  { name: 'smtp_gateways', module: 'Admin Panel', purpose: 'Setting SMTP server email pengiriman notifikasi/OTP.' },
  { name: 'whatsapp_gateways', module: 'Admin Panel', purpose: 'Koneksi API WhatsApp Gateway notifikasi pendaftaran.' },
  { name: 'sms_gateways', module: 'Admin Panel', purpose: 'Sistem gateway SMS OTP fallback.' },
  { name: 'database_backups', module: 'Admin Panel', purpose: 'Log riwayat backup data otomatis zip/sql.' },
];
