/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Member, Package, Wallet, WalletTransaction, Rank } from '../types';
import { Wallet as WalletIcon, TrendingUp, Users, Award, ShieldAlert, ArrowUpRight, ArrowDownLeft, Clock, ShoppingBag, Send } from 'lucide-react';

interface MemberDashboardProps {
  member: Member;
  wallet: Wallet;
  transactions: WalletTransaction[];
  packages: Package[];
  ranks: Rank[];
  onQuickTransfer: (targetUsername: string, amount: number) => void;
}

export default function MemberDashboard({
  member,
  wallet,
  transactions,
  packages,
  ranks,
  onQuickTransfer
}: MemberDashboardProps) {
  const [transferTarget, setTransferTarget] = React.useState('');
  const [transferAmount, setTransferAmount] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const activePackage = packages.find(p => p.id === member.packageId);
  const activeRank = ranks.find(r => r.id === member.rankId);

  const getPackageBadgeColor = () => {
    if (member.packageId === 4) return 'bg-violet-100 text-violet-800 border border-violet-200';
    if (member.packageId === 3) return 'bg-amber-100 text-amber-800 border border-amber-200';
    if (member.packageId === 2) return 'bg-blue-100 text-blue-800 border border-blue-200';
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTarget || !transferAmount) return;
    onQuickTransfer(transferTarget, Number(transferAmount));
    setTransferTarget('');
    setTransferAmount('');
    setSuccessMsg('Transfer antar member berhasil diproses!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6" id="member-area-dashboard">
      
      {/* 1. Header Banner & Verification warning */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            MEMBER AREA PORTAL
          </span>
          <h2 className="text-lg font-bold text-slate-800 mt-1">Selamat Datang Kembali, {member.name}!</h2>
          <p className="text-xs text-slate-500 mt-0.5">ID Kemitraan: #{member.id} | Link Referral Anda: https://mlm.co.id/ref/{member.username}</p>
        </div>

        {/* Verification Pill */}
        <div className="flex items-center space-x-2">
          <span className={getPackageBadgeColor() + " text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"}>
            Paket: {activePackage?.name || 'Belum Beli'}
          </span>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm">
            <Award className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            <span>Peringkat: {activeRank?.name}</span>
          </span>
        </div>
      </div>

      {/* 2. Wallet Multi-Saldo Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="wallet-balances-grid">
        {/* Bonus Wallet */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md border border-slate-800 relative overflow-hidden">
          <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-warning">
            <WalletIcon className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Saldo Bonus (Tunai)</p>
          <h3 className="font-extrabold text-base text-warning mt-2">Rp {wallet.bonus.toLocaleString('id-ID')}</h3>
          <p className="text-[9px] text-slate-500 mt-1">Bisa ditarik ke Rekening Bank</p>
        </div>

        {/* Deposit Balance */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Saldo Deposit</p>
          <h3 className="font-extrabold text-base text-slate-800 mt-2">Rp {wallet.deposit.toLocaleString('id-ID')}</h3>
          <p className="text-[9px] text-slate-500 mt-1">Digunakan untuk checkout belanja</p>
        </div>

        {/* Shopping Balance */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Saldo Belanja (Product)</p>
          <h3 className="font-extrabold text-base text-slate-800 mt-2">Rp {wallet.belanja.toLocaleString('id-ID')}</h3>
          <p className="text-[9px] text-slate-500 mt-1">Voucher repeat-order diskon</p>
        </div>

        {/* Reward Balance */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Award className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Poin Reward</p>
          <h3 className="font-extrabold text-base text-slate-800 mt-2">{wallet.reward.toLocaleString('id-ID')} Poin</h3>
          <p className="text-[9px] text-slate-500 mt-1">Kualifikasi reward motor/mobil</p>
        </div>
      </div>

      {/* 3. Analytics Charts: Payouts & Enrollment growth (using Custom clean SVGs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="member-charts-section">
        {/* Payout Growth Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Perkembangan Payout Komisi (Sponsor & Pasangan)</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Akumulasi bonus yang diterima selama 5 bulan terakhir.</p>
          </div>

          {/* Simple Custom SVG bar graph */}
          <div className="h-44 w-full flex items-end justify-between border-b border-l border-slate-100 pt-4 px-2">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] text-emerald-600 font-bold mb-1">Rp 1.2M</span>
              <div className="w-8 bg-emerald-100 rounded-t-md h-12"></div>
              <span className="text-[9px] text-slate-400 mt-2">Mar</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] text-emerald-600 font-bold mb-1">Rp 2.4M</span>
              <div className="w-8 bg-emerald-200 rounded-t-md h-24"></div>
              <span className="text-[9px] text-slate-400 mt-2">Apr</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] text-emerald-600 font-bold mb-1">Rp 1.8M</span>
              <div className="w-8 bg-emerald-100 rounded-t-md h-16"></div>
              <span className="text-[9px] text-slate-400 mt-2">Mei</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] text-emerald-600 font-bold mb-1">Rp 3.5M</span>
              <div className="w-8 bg-emerald-300 rounded-t-md h-32"></div>
              <span className="text-[9px] text-slate-400 mt-2">Jun</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] text-emerald-600 font-bold mb-1">Rp 4.2M</span>
              <div className="w-8 bg-emerald-500 rounded-t-md h-36"></div>
              <span className="text-[9px] text-slate-400 mt-2">Jul</span>
            </div>
          </div>
        </div>

        {/* Downlines Growth Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Pertumbuhan Jaringan Downline</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Penambahan anggota downline baru di bawah kaki kiri & kanan.</p>
          </div>

          {/* Simple Custom SVG Area Chart */}
          <div className="h-44 w-full relative pt-4 flex items-end">
            <svg viewBox="0 0 400 150" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#F1F5F9" strokeWidth="1" />

              {/* Path Area (Left leg) */}
              <path
                d="M 0 150 L 50 120 L 150 90 L 250 100 L 350 40 L 400 10 L 400 150 Z"
                fill="url(#leftLegGrad)"
                opacity="0.2"
              />
              <path
                d="M 0 150 L 50 120 L 150 90 L 250 100 L 350 40 L 400 10"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="leftLegGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2 text-[8px] text-slate-400 font-mono">
              <span>Maret</span>
              <span>April</span>
              <span>Mei</span>
              <span>Juni</span>
              <span>Juli (Sekarang)</span>
            </div>
            <div className="absolute top-2 right-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-md font-bold">
              Kaki Kiri Aktif + {member.leftVolume} PV
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom grid split: Transactions Ledger vs Quick Transfer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ledger */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-[340px] overflow-hidden" id="financial-ledger">
          <h4 className="font-bold text-slate-800 text-xs mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Buku Besar Mutasi Dompet (Wallet Transaction Ledger)</span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Real-time Audit Ledger
            </span>
          </h4>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="p-3 hover:bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center transition-colors"
                id={`tx-row-${tx.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    tx.direction === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {tx.direction === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{tx.description}</p>
                    <p className="text-[10px] text-slate-400">{tx.date} | ID: {tx.id}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-extrabold ${tx.direction === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.direction === 'in' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </p>
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold tracking-wider">
                    {tx.type}
                  </span>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-slate-400 italic text-center py-16">
                Belum ada transaksi keluar-masuk di dalam buku besar Anda.
              </div>
            )}
          </div>
        </div>

        {/* Quick Internal Transfer */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4" id="internal-transfer-card">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Send className="w-4 h-4 text-emerald-600" />
            Transfer Antar Member (Internal Transfer)
          </h4>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold animate-fade-in">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleTransferSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-600 font-semibold">Username Penerima:</label>
              <input
                type="text"
                required
                placeholder="Contoh: andi88"
                value={transferTarget}
                onChange={(e) => setTransferTarget(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-600 font-semibold">Nominal Dana (Rupiah):</label>
              <input
                type="number"
                required
                placeholder="Minimal Rp 10.000"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] text-slate-500 leading-normal">
              Pengiriman dana instan ini akan memindahkan saldo "Deposit" Anda ke akun penerima secara real-time. Proses dijamin aman dengan perlindungan concurrency.
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition-all hover:shadow-md text-center cursor-pointer"
            >
              Kirim Dana Instan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
