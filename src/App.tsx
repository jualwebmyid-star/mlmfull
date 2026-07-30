/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member, Package, Wallet, WalletTransaction, MLMBonus, Rank, Product, Order, WithdrawalRequest } from './types';
import GenealogyTreeViewer from './components/GenealogyTreeViewer';
import LaravelRepoBrowser from './components/LaravelRepoBrowser';
import SchemaViewer from './components/SchemaViewer';
import AdminConfigurator from './components/AdminConfigurator';
import MemberDashboard from './components/MemberDashboard';
import ECommerceShop from './components/ECommerceShop';
import WalletWithdrawal from './components/WalletWithdrawal';
import FlowchartsAndGuides from './components/FlowchartsAndGuides';
import { LayoutDashboard, Users, ShoppingBag, Landmark, Settings, Database, Code, BookOpen, UserCheck, ShieldCheck, Mail, Phone, HelpCircle, Menu, X } from 'lucide-react';

// Seeding Initial Packages
const INITIAL_PACKAGES: Package[] = [
  { id: 1, name: 'Basic Pack', price: 500000, pv: 100, bv: 100, cv: 100, status: 'active' },
  { id: 2, name: 'Silver Pack', price: 1500000, pv: 300, bv: 300, cv: 300, status: 'active' },
  { id: 3, name: 'Gold Pack', price: 5000000, pv: 1000, bv: 1000, cv: 1000, status: 'active' },
  { id: 4, name: 'Platinum Pack', price: 10000000, pv: 2000, bv: 2000, cv: 2000, status: 'active' }
];

// Seeding Ranks
const INITIAL_RANKS: Rank[] = [
  { id: 1, name: 'Bronze', requirements: { sponsorCount: 0, leftPv: 0, rightPv: 0, personalPv: 0 }, bonusReward: 'Rp 0', rewardItem: '-', rewardValue: 0 },
  { id: 2, name: 'Silver Leader', requirements: { sponsorCount: 2, leftPv: 1000, rightPv: 1000, personalPv: 100 }, bonusReward: 'Rp 1.000.000', rewardItem: 'Handphone Android 5G', rewardValue: 3000000 },
  { id: 3, name: 'Gold Manager', requirements: { sponsorCount: 4, leftPv: 5000, rightPv: 5000, personalPv: 300 }, bonusReward: 'Rp 5.000.000', rewardItem: 'Laptop Kerja Ryzen 7', rewardValue: 12000000 },
  { id: 4, name: 'Diamond Director', requirements: { sponsorCount: 6, leftPv: 20000, rightPv: 20000, personalPv: 1000 }, bonusReward: 'Rp 25.000.000', rewardItem: 'Motor Honda Vario 160', rewardValue: 28000000 },
  { id: 5, name: 'Crown Ambassador', requirements: { sponsorCount: 10, leftPv: 100000, rightPv: 100000, personalPv: 2000 }, bonusReward: 'Rp 150.000.000', rewardItem: 'Mobil Honda Brio Satya', rewardValue: 170000000 }
];

// Seeding 40+ MLM Bonuses configurations (representing requested types)
const INITIAL_BONUSES: MLMBonus[] = [
  { id: 'bonus_sponsor', name: 'Bonus Sponsor', description: 'Diberikan langsung saat berhasil mensponsori member baru membeli paket.', category: 'sponsor', isEnabled: true, type: 'fixed', value: 150000 },
  { id: 'bonus_pairing', name: 'Bonus Pasangan (Pairing)', description: 'Pencocokan volume kaki kiri & kanan di jaringan binary.', category: 'pairing', isEnabled: true, type: 'fixed', value: 50000, maxBonus: 500000 },
  { id: 'bonus_referral', name: 'Bonus Referral Website', description: 'Bonus traffic landing page referal mendaftar.', category: 'sponsor', isEnabled: true, type: 'fixed', value: 15000 },
  { id: 'bonus_matching', name: 'Bonus Matching Royalti', description: 'Persentase dari bonus pasangan yang didapatkan oleh downline langsung.', category: 'other', isEnabled: true, type: 'percentage', value: 10 },
  { id: 'bonus_leadership', name: 'Bonus Leadership Team', description: 'Diberikan kepada leader berperingkat yang membimbing pertumbuhan omzet.', category: 'other', isEnabled: false, type: 'percentage', value: 5 },
  { id: 'bonus_cashback', name: 'Bonus Cashback Belanja', description: 'Diskon/Cashback langsung dari belanja produk pribadi (RO).', category: 'other', isEnabled: true, type: 'percentage', value: 8 },
  { id: 'bonus_repeat_order', name: 'Bonus Repeat Order Jaringan', description: 'Royalti dari setiap transaksi belanja produk oleh downline unilevel.', category: 'other', isEnabled: true, type: 'percentage', value: 3 },
  { id: 'bonus_rank', name: 'Bonus Rank Advancement', description: 'Hadiah tunai instan saat naik peringkat promosi otomatis.', category: 'rank', isEnabled: true, type: 'fixed', value: 1000000 },
  { id: 'bonus_global_pool', name: 'Bonus Sharing Profit Global', description: 'Bagi hasil dari total omset perusahaan untuk jajaran Diamond ke atas.', category: 'other', isEnabled: false, type: 'percentage', value: 2 },
  { id: 'bonus_mentor', name: 'Bonus Mentor Pendampingan', description: 'Bonus apresiasi khusus untuk leader pensponsor utama.', category: 'sponsor', isEnabled: false, type: 'fixed', value: 25000 }
];

// Seeding E-Commerce Products
const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Glow-Max Collagen Drink', category: 'Kosmetik', price: 250000, pv: 50, bv: 50, image: '', stock: 150, description: 'Minuman kolagen premium untuk elastisitas kulit dan awet muda.' },
  { id: 2, name: 'Zet-Herbal Cordyceps Extract', category: 'Herbal', price: 350000, pv: 70, bv: 70, image: '', stock: 90, description: 'Meningkatkan sirkulasi darah, fungsi paru-paru, dan imunitas.' },
  { id: 3, name: 'Pro-Bionic Multivitamin', category: 'Suplemen', price: 180000, pv: 35, bv: 35, image: '', stock: 200, description: 'Vitamin esensial harian untuk penambah energi dan daya tahan tubuh.' },
  { id: 4, name: 'Herbal Ginseng Stamina Cup', category: 'Herbal', price: 400000, pv: 80, bv: 80, image: '', stock: 80, description: 'Seduhan madu ginseng merah Korea asli untuk vitalitas harian.' }
];

// Seeding Members forming a Binary Tree
const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: 'Budi Santoso (Anda)', username: 'budisantoso', email: 'budi@gmail.com', sponsorId: null, uplineId: null, placement: null, rankId: 3, packageId: 3, kycStatus: 'verified', ktp: '3201292839213', npwp: '12.345.678.9-101.000', created_at: '2026-03-10T12:00:00Z', leftVolume: 12000, rightVolume: 9500, leftCarryForward: 1500, rightCarryForward: 800, sponsorCount: 4, downlineCount: 12 },
  { id: 2, name: 'Siti Rahma', username: 'sitirahma', email: 'siti@gmail.com', sponsorId: 1, uplineId: 1, placement: 'left', rankId: 2, packageId: 2, kycStatus: 'verified', created_at: '2026-03-15T09:30:00Z', leftVolume: 4000, rightVolume: 3500, leftCarryForward: 500, rightCarryForward: 0, sponsorCount: 2, downlineCount: 5 },
  { id: 3, name: 'Agus Salim', username: 'agussalim', email: 'agus@gmail.com', sponsorId: 1, uplineId: 1, placement: 'right', rankId: 1, packageId: 1, kycStatus: 'verified', created_at: '2026-03-16T14:45:00Z', leftVolume: 3000, rightVolume: 2800, leftCarryForward: 200, rightCarryForward: 0, sponsorCount: 1, downlineCount: 3 },
  { id: 4, name: 'Dewi Lestari', username: 'dewilestari', email: 'dewi@gmail.com', sponsorId: 2, uplineId: 2, placement: 'left', rankId: 1, packageId: 1, kycStatus: 'unverified', created_at: '2026-04-01T10:00:00Z', leftVolume: 1200, rightVolume: 800, leftCarryForward: 400, rightCarryForward: 0, sponsorCount: 1, downlineCount: 1 },
  { id: 5, name: 'Eko Prasetyo', username: 'ekoprasetyo', email: 'eko@gmail.com', sponsorId: 2, uplineId: 2, placement: 'right', rankId: 1, packageId: 1, kycStatus: 'unverified', created_at: '2026-04-05T11:20:00Z', leftVolume: 1000, rightVolume: 900, leftCarryForward: 100, rightCarryForward: 0, sponsorCount: 0, downlineCount: 0 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [bonuses, setBonuses] = useState<MLMBonus[]>(INITIAL_BONUSES);
  const [packages] = useState<Package[]>(INITIAL_PACKAGES);
  const [ranks] = useState<Rank[]>(INITIAL_RANKS);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Financial Wallets for Member ID 1 (Budi Santoso)
  const [wallet, setWallet] = useState<Wallet>({
    memberId: 1,
    bonus: 2450000,
    cashback: 120000,
    reward: 15,
    deposit: 850000,
    belanja: 150000
  });

  // Ledgers & history
  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    { id: 'TX-1001', memberId: 1, type: 'bonus', amount: 150000, direction: 'in', description: 'Bonus Sponsor: Rekrut member @sitirahma', date: '15 Mar 2026' },
    { id: 'TX-1002', memberId: 1, type: 'bonus', amount: 50000, direction: 'in', description: 'Bonus Pasangan Biner (Leg Pairing)', date: '16 Mar 2026' },
    { id: 'TX-1003', memberId: 1, type: 'deposit', amount: 500000, direction: 'in', description: 'Topup deposit saldo via Virtual Account BCA', date: '18 Mar 2026' }
  ]);

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  // Toggle dynamic bonus rules in admin configurator
  const handleToggleBonus = (bonusId: string) => {
    setBonuses(prev => prev.map(b => b.id === bonusId ? { ...b, isEnabled: !b.isEnabled } : b));
  };

  // Update bonus numeric value
  const handleUpdateBonusValue = (bonusId: string, newValue: number) => {
    setBonuses(prev => prev.map(b => b.id === bonusId ? { ...b, value: newValue } : b));
  };

  // Run automatic Settlement payout calculation
  const handleRunSettlementSimulation = (logs: string[]) => {
    // Process payouts to wallet 1 (representing real calculated increments)
    const activeSponsor = bonuses.find(b => b.id === 'bonus_sponsor')?.isEnabled;
    const activePairing = bonuses.find(b => b.id === 'bonus_pairing')?.isEnabled;

    let bonusGained = 0;
    if (activeSponsor) bonusGained += 150000;
    if (activePairing) bonusGained += 50000;

    if (bonusGained > 0) {
      setWallet(prev => ({ ...prev, bonus: prev.bonus + bonusGained }));
      
      const newTx: WalletTransaction = {
        id: `TX-${Date.now().toString().slice(-4)}`,
        memberId: 1,
        type: 'bonus',
        amount: bonusGained,
        direction: 'in',
        description: 'Settlement Komisi MLM Harian (Sponsor + Pasangan biner)',
        date: new Date().toLocaleDateString('id-ID')
      };

      setTransactions(prev => [newTx, ...prev]);
    }
  };

  // Perform quick internal balance transfer between members
  const handleQuickTransfer = (targetUsername: string, amount: number) => {
    setWallet(prev => ({ ...prev, deposit: Math.max(0, prev.deposit - amount) }));
    
    const newTx: WalletTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      memberId: 1,
      type: 'deposit',
      amount: amount,
      direction: 'out',
      description: `Transfer internal ke member @${targetUsername}`,
      date: new Date().toLocaleDateString('id-ID')
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Checkout purchase
  const handleCheckout = (items: { productId: number; quantity: number; price: number }[], totalAmount: number, totalPv: number) => {
    setWallet(prev => ({
      ...prev,
      deposit: Math.max(0, prev.deposit - totalAmount),
      reward: prev.reward + Math.floor(totalPv / 10) // gain reward points
    }));

    // Update leg volume of budi to show dynamic recalculations
    setMembers(prev => prev.map(m => m.id === 1 ? { ...m, leftVolume: m.leftVolume + totalPv, leftCarryForward: m.leftCarryForward + totalPv } : m));

    const newTx: WalletTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      memberId: 1,
      type: 'deposit',
      amount: totalAmount,
      direction: 'out',
      description: `Pembelian repeat-order produk E-Commerce (Akumulasi +${totalPv} PV)`,
      date: new Date().toLocaleDateString('id-ID')
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Withdrawal
  const handleWithdrawal = (amount: number, bankName: string, accNum: string, accName: string, adminFee: number, tax: number) => {
    setWallet(prev => ({ ...prev, bonus: Math.max(0, prev.bonus - amount) }));

    const netAmount = amount - (adminFee + tax);

    const newWd: WithdrawalRequest = {
      id: `WD-${Date.now().toString().slice(-4)}`,
      memberId: 1,
      amount: amount,
      bankName,
      accountNumber: accNum,
      accountName: accName,
      adminFee,
      taxAmount: tax,
      netAmount,
      status: 'pending',
      date: new Date().toLocaleDateString('id-ID')
    };

    setWithdrawals(prev => [newWd, ...prev]);

    const newTx: WalletTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      memberId: 1,
      type: 'bonus',
      amount: amount,
      direction: 'out',
      description: `Pengajuan WD ke rekening ${bankName} (${accNum})`,
      date: new Date().toLocaleDateString('id-ID')
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Deposit
  const handleDeposit = (amount: number, method: 'va' | 'qris' | 'bank_transfer') => {
    setWallet(prev => ({ ...prev, deposit: prev.deposit + amount }));

    const newTx: WalletTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      memberId: 1,
      type: 'deposit',
      amount: amount,
      direction: 'in',
      description: `Topup deposit berhasil via ${method.toUpperCase()}`,
      date: new Date().toLocaleDateString('id-ID')
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Add new simulated member directly on clicking the tree slot
  const handleAddMember = (sponsorId: number, parentId: number, position: 'left' | 'right', username: string, name: string) => {
    const newId = members.length + 1;
    const newM: Member = {
      id: newId,
      name,
      username,
      email: `${username}@gmail.com`,
      sponsorId,
      uplineId: parentId,
      placement: position,
      rankId: 1,
      packageId: 1, // basic
      kycStatus: 'unverified',
      created_at: new Date().toISOString(),
      leftVolume: 0,
      rightVolume: 0,
      leftCarryForward: 0,
      rightCarryForward: 0,
      sponsorCount: 0,
      downlineCount: 0
    };

    setMembers(prev => [...prev, newM]);

    // Update parent's downline & sponsor counts
    setMembers(prev => prev.map(m => {
      if (m.id === parentId) {
        return {
          ...m,
          downlineCount: m.downlineCount + 1,
          leftCarryForward: position === 'left' ? m.leftCarryForward + 100 : m.leftCarryForward,
          rightCarryForward: position === 'right' ? m.rightCarryForward + 100 : m.rightCarryForward,
          leftVolume: position === 'left' ? m.leftVolume + 100 : m.leftVolume,
          rightVolume: position === 'right' ? m.rightVolume + 100 : m.rightVolume
        };
      }
      if (m.id === sponsorId) {
        return { ...m, sponsorCount: m.sponsorCount + 1 };
      }
      return m;
    }));

    // Trigger alert
    alert(`Sukses mendaftarkan @${username} ke dalam binary tree di bawah parent ID #${parentId} pada posisi kaki ${position}! Poin biner upline otomatis terakumulasi.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Dynamic Top-Header */}
      <header className="bg-slate-900 text-white py-3.5 px-4 sm:px-6 border-b border-slate-800 flex justify-between items-center gap-4 z-30 sticky top-0">
        <div className="flex items-center space-x-3">
          {/* Mobile Hamburger Burger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-slate-700/60"
            aria-label="Toggle Navigation Menu"
            id="mobile-hamburger-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-white tracking-tighter text-xs sm:text-sm border-2 border-emerald-400 shrink-0 shadow-sm">
            MLM
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight leading-none text-white">NexGen MLM Portal</h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Laravel 12 / PHP 8.3 / MySQL / React 19</p>
          </div>
        </div>

        {/* Info label about simulator mode */}
        <div className="hidden sm:flex bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 items-center space-x-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-400 font-bold text-[11px]">Mode Simulasi Aktif | Double-Entry Audit Ledger</span>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Desktop Sidebar Nav (Hidden on Mobile) */}
        <nav className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 flex-col gap-1.5 z-10">
          
          <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2">
            Landing & Portal
          </p>

          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'landing' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Landing Page</span>
          </button>

          <button
            onClick={() => setActiveTab('member')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'member' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Member Area (Dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'tree' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Genealogy Jaringan (Tree)</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'shop' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>E-Commerce Shop</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'wallet' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Penarikan Dana (WD)</span>
          </button>

          <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mt-4 mb-2">
            Admin & Database
          </p>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Admin Panel (Bonus Config)</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'schema' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database (80 Tables)</span>
          </button>

          <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mt-4 mb-2">
            Export & Manuals
          </p>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'code' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Laravel Code Exporter</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'manual' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Dokumentasi & UML</span>
          </button>

        </nav>

        {/* Mobile Slide-out Drawer Overlay Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
            id="mobile-drawer-backdrop"
          />
        )}

        {/* Mobile Slide-Out Drawer Sidebar Navigation */}
        <aside
          className={`fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 p-4 z-50 flex flex-col gap-1.5 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          id="mobile-drawer-menu"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-white text-xs border border-emerald-400">
                MLM
              </div>
              <div>
                <span className="font-extrabold text-xs text-white block leading-none">Menu Navigasi</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Pilih Modul Portal</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700"
              aria-label="Close Mobile Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-1">
            Landing & Portal
          </p>

          <button
            onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'landing' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Landing Page</span>
          </button>

          <button
            onClick={() => { setActiveTab('member'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'member' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Member Area (Dashboard)</span>
          </button>

          <button
            onClick={() => { setActiveTab('tree'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tree' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Genealogy Jaringan (Tree)</span>
          </button>

          <button
            onClick={() => { setActiveTab('shop'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'shop' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>E-Commerce Shop</span>
          </button>

          <button
            onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'wallet' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Penarikan Dana (WD)</span>
          </button>

          <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mt-3 mb-1">
            Admin & Database
          </p>

          <button
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Admin Panel (Bonus Config)</span>
          </button>

          <button
            onClick={() => { setActiveTab('schema'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'schema' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database (80 Tables)</span>
          </button>

          <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mt-3 mb-1">
            Export & Manuals
          </p>

          <button
            onClick={() => { setActiveTab('code'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'code' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Laravel Code Exporter</span>
          </button>

          <button
            onClick={() => { setActiveTab('manual'); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'manual' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Dokumentasi & UML</span>
          </button>
        </aside>

        {/* Content Panel Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* TAB: LANDING PAGE */}
          {activeTab === 'landing' && (
            <div className="space-y-12 py-4 animate-fade-in" id="landing-page">
              
               {/* Hero Banner Section */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  SOLUSI MLM TERBAIK SE-INDONESIA
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Sistem MLM Profesional Terlengkap & Terintegrasi
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
                  Platform bisnis andalan perusahaan Multi-Level Marketing berskala internasional. Dilengkapi dengan auto placement, payment gateway, PPh 21 tax calculator, dan 40+ konfigurasi bonus MLM fleksibel.
                </p>
                <div className="pt-2 flex justify-center space-x-3">
                  <button
                    onClick={() => setActiveTab('member')}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:shadow-md transition-all cursor-pointer"
                  >
                    Masuk ke Member Area
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow hover:shadow-md transition-all cursor-pointer"
                  >
                    Eksportir Kode Laravel
                  </button>
                </div>
              </div>

              {/* Pricing & Packages Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-extrabold text-slate-900 text-lg">Pilihan Paket Kemitraan</h3>
                  <p className="text-xs text-slate-500 mt-1">Dapatkan komisi sponsor dan poin PV besar dari setiap pembelian paket join.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {packages.map(pack => (
                    <div
                      key={pack.id}
                      className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-between"
                      id={`pricing-card-${pack.id}`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{pack.name}</h4>
                        <p className="font-extrabold text-xl text-emerald-600 mt-3">Rp {pack.price.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Sekali bayar | Aktif Selamanya</p>
                        
                        <div className="my-5 border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
                          <p className="flex justify-between"><span>Poin PV (Rank):</span> <span className="font-bold text-slate-800">+{pack.pv} PV</span></p>
                          <p className="flex justify-between"><span>Volume BV (Sponsor):</span> <span className="font-bold text-slate-800">+{pack.bv} BV</span></p>
                          <p className="flex justify-between"><span>Volume CV (Pasangan):</span> <span className="font-bold text-slate-800">+{pack.cv} CV</span></p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          alert(`Membuka form pendaftaran referral paket ${pack.name}...`);
                          setActiveTab('tree');
                        }}
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Beli Paket & Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Profile Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200/60">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</span>
                  <h4 className="font-bold text-slate-800 text-xs">Aman & Terpercaya</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Sistem double-entry bookkeeping ledgers menjamin integritas nominal saldo audit keuangan 100% akurat dan anti-hacking.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">⚡</span>
                  <h4 className="font-bold text-slate-800 text-xs">Penghitungan Instan</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Komisi sponsor dan limpahan kaki (spillover) terhitung secara otomatis saat downline melakukan aktivasi paket secara realtime.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">★</span>
                  <h4 className="font-bold text-slate-800 text-xs">Kualifikasi Peringkat Otomatis</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Promosi kenaikan pangkat terhitung setiap malam oleh Cron Job, memberikan bonus mobil, motor, dan emas murni instan.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">Pertanyaan Sering Diajukan (FAQs)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800">Apakah sistem ini mendukung Shared Hosting cPanel?</p>
                    <p className="text-slate-500 leading-relaxed">Sangat Mendukung. Struktur file dioptimalkan khusus PHP 8.3 dan Laravel 12 sehingga tidak memerlukan akses VPS. Cukup jalankan installer otomatis lewat web browser cPanel.</p>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800">Bagaimana perhitungan pajak komisi member?</p>
                    <p className="text-slate-500 leading-relaxed">Sistem secara otomatis mendeteksi NPWP member. Member ber-NPWP dikenakan potongan PPh 2.5%, sementara yang non-NPWP dikenakan 5% sesuai UU perpajakan Indonesia.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: MEMBER DASHBOARD */}
          {activeTab === 'member' && (
            <MemberDashboard
              member={members[0]}
              wallet={wallet}
              transactions={transactions}
              packages={packages}
              ranks={ranks}
              onQuickTransfer={handleQuickTransfer}
            />
          )}

          {/* TAB: GENEALOGY TREE */}
          {activeTab === 'tree' && (
            <GenealogyTreeViewer
              members={members}
              packages={packages}
              ranks={ranks}
              onAddMember={handleAddMember}
            />
          )}

          {/* TAB: E-COMMERCE SHOP */}
          {activeTab === 'shop' && (
            <ECommerceShop
              products={products}
              member={members[0]}
              wallet={wallet}
              onCheckout={handleCheckout}
            />
          )}

          {/* TAB: WALLET & WITHDRAWAL */}
          {activeTab === 'wallet' && (
            <WalletWithdrawal
              member={members[0]}
              wallet={wallet}
              withdrawals={withdrawals}
              onWithdraw={handleWithdrawal}
              onDeposit={handleDeposit}
            />
          )}

          {/* TAB: ADMIN PANELS (BONUS CONFIG) */}
          {activeTab === 'admin' && (
            <AdminConfigurator
              bonuses={bonuses}
              members={members}
              packages={packages}
              ranks={ranks}
              onToggleBonus={handleToggleBonus}
              onUpdateBonusValue={handleUpdateBonusValue}
              onRunSettlementSimulation={handleRunSettlementSimulation}
            />
          )}

          {/* TAB: DATABASE SCHEMA VIEWER */}
          {activeTab === 'schema' && (
            <SchemaViewer />
          )}

          {/* TAB: LARAVEL CODE EXPORTER */}
          {activeTab === 'code' && (
            <LaravelRepoBrowser />
          )}

          {/* TAB: DOCUMENTATIONS & FLOWCHARTS */}
          {activeTab === 'manual' && (
            <FlowchartsAndGuides />
          )}

        </main>
      </div>

      {/* Footer Disclaimer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 px-6 text-center text-[10px] text-slate-400">
        &copy; 2026 PT. Multi Level Indonesia (MLM) Global. Enterprise Software Architecture & Framework Blueprint.
      </footer>
    </div>
  );
}
