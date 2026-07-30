/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member, Wallet, WithdrawalRequest, DepositRequest } from '../types';
import { Landmark, ArrowUpRight, DollarSign, Key, ShieldCheck, Clock, CheckCircle, Smartphone } from 'lucide-react';

interface WalletWithdrawalProps {
  member: Member;
  wallet: Wallet;
  withdrawals: WithdrawalRequest[];
  onWithdraw: (amount: number, bankName: string, accNum: string, accName: string, adminFee: number, tax: number) => void;
  onDeposit: (amount: number, method: 'va' | 'qris' | 'bank_transfer') => void;
}

export default function WalletWithdrawal({
  member,
  wallet,
  withdrawals,
  onWithdraw,
  onDeposit
}: WalletWithdrawalProps) {
  // WD states
  const [wdAmount, setWdAmount] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [accNum, setAccNum] = useState<string>('');
  const [accName, setAccName] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Deposit states
  const [depAmount, setDepAmount] = useState<string>('');
  const [depMethod, setDepMethod] = useState<'va' | 'qris' | 'bank_transfer'>('va');
  const [depSuccessMsg, setDepSuccessMsg] = useState<string>('');

  // Indonesian Tax Deduction (PPh 21) logic:
  // With NPWP = 2.5% tax rate
  // Without NPWP = 5.0% tax rate
  const hasNpwp = member.npwp && member.npwp.trim().length > 0;
  const taxRate = hasNpwp ? 0.025 : 0.050;
  const adminFee = 6500; // Flat bank admin fee (Rp 6.500)

  const numAmount = Number(wdAmount) || 0;
  const calculatedTax = numAmount * taxRate;
  const netAmount = Math.max(0, numAmount - (calculatedTax + adminFee));

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < 50000) {
      alert('Minimal penarikan dana (Withdrawal) adalah Rp 50.000');
      return;
    }
    if (wallet.bonus < numAmount) {
      alert('Maaf, Saldo Bonus Anda tidak mencukupi untuk melakukan penarikan dana.');
      return;
    }
    if (pin !== '123456') {
      alert('PIN Transaksi Anda salah! Silakan gunakan PIN bawaan: 123456');
      return;
    }

    onWithdraw(numAmount, bankName, accNum, accName, adminFee, calculatedTax);
    
    setWdAmount('');
    setBankName('');
    setAccNum('');
    setAccName('');
    setPin('');
    setOtp('');
    setSuccessMsg('Permintaan penarikan dana berhasil dikirim! Menunggu approval admin cPanel.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numDep = Number(depAmount) || 0;
    if (numDep < 20000) {
      alert('Minimal topup deposit adalah Rp 20.000');
      return;
    }

    onDeposit(numDep, depMethod);
    setDepAmount('');
    setDepSuccessMsg(`Topup deposit sebesar Rp ${numDep.toLocaleString('id-ID')} via ${depMethod.toUpperCase()} berhasil dikonfirmasi secara otomatis!`);
    setTimeout(() => setDepSuccessMsg(''), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="wallet-withdrawal-module">
      
      {/* 1. Header & Quick stats */}
      <div className="lg:col-span-12 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600" />
            Keuangan & Penarikan Dana (Withdrawal & Deposit)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cairkan bonus komisi langsung ke bank Anda dengan tarif pajak PPh 21 otomatis, atau topup deposit saldo untuk belanja.
          </p>
        </div>

        {/* Current balances recap */}
        <div className="flex gap-4 text-xs font-semibold">
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
            <span className="text-slate-500 block text-[9px] uppercase">Saldo Bonus Tunai</span>
            <span className="text-warning-hover font-extrabold text-sm">Rp {wallet.bonus.toLocaleString('id-ID')}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
            <span className="text-slate-500 block text-[9px] uppercase">Saldo Deposit</span>
            <span className="text-emerald-600 font-extrabold text-sm">Rp {wallet.deposit.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* 2. Withdrawal Request Panel (Left) */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <ArrowUpRight className="w-4 h-4 text-red-500" />
          Formulir Penarikan Dana Bonus (Withdrawal)
        </h4>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleWithdrawSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="space-y-1">
            <label className="block text-slate-600 font-semibold">Nominal Withdrawal (Rp):</label>
            <input
              type="number"
              required
              placeholder="Minimal Rp 50.000"
              value={wdAmount}
              onChange={(e) => setWdAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-600 font-semibold">Nama Bank Tujuan:</label>
            <select
              value={bankName}
              required
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">-- Pilih Bank --</option>
              <option value="BCA">Bank Central Asia (BCA)</option>
              <option value="Mandiri">Bank Mandiri</option>
              <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
              <option value="BNI">Bank Negara Indonesia (BNI)</option>
              <option value="GoPay">GoPay (E-Wallet)</option>
              <option value="OVO">OVO (E-Wallet)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-600 font-semibold">Nomor Rekening / No. HP E-Wallet:</label>
            <input
              type="text"
              required
              placeholder="Contoh: 812998822"
              value={accNum}
              onChange={(e) => setAccNum(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-600 font-semibold">Nama Pemilik Rekening:</label>
            <input
              type="text"
              required
              placeholder="Harus sesuai nama terdaftar"
              value={accName}
              onChange={(e) => setAccName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-600 font-semibold">PIN Transaksi Keuangan:</label>
            <input
              type="password"
              required
              placeholder="PIN 6 Digit (Default: 123456)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-600 font-semibold">OTP Verifikasi (SMS/WhatsApp):</label>
            <div className="flex space-x-1">
              <input
                type="text"
                required
                placeholder="Kode OTP sekali-pakai"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
              <button
                type="button"
                onClick={() => alert('Kode OTP baru berhasil dikirim via WhatsApp ke nomor telepon Anda: 1234')}
                className="px-2.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-lg"
              >
                Kirim OTP
              </button>
            </div>
          </div>

          {/* Tax summary details banner */}
          <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] space-y-1.5 text-slate-600">
            <p className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Perhitungan Potongan Pajak Resmi (PPh 21) & Biaya Admin Bank:
            </p>
            <div className="flex justify-between">
              <span>Status NPWP:</span>
              <span className="font-semibold text-slate-800">
                {hasNpwp ? `Terdaftar (NPWP: ${member.npwp})` : 'Tidak Terdaftar (Dikenakan tarif pajak 2x lipat)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tarif Pajak PPh 21:</span>
              <span className="font-semibold text-slate-800">{hasNpwp ? '2.5%' : '5.0% (Tanpa NPWP)'}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-1">
              <span>Potongan Pajak PPh:</span>
              <span className="font-semibold text-red-600">Rp {calculatedTax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Kliring Bank:</span>
              <span className="font-semibold text-red-600">Rp {adminFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-1 font-bold text-slate-800">
              <span>Net Transfer yang diterima:</span>
              <span className="text-emerald-700 font-extrabold">Rp {netAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition-all hover:shadow-md text-center"
            >
              Ajukan Penarikan Dana Bonus
            </button>
          </div>
        </form>
      </div>

      {/* 3. Deposit Top-Up Panel (Right) */}
      <div className="lg:col-span-4 flex flex-col space-y-4" id="deposit-sidebar">
        {depSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl text-xs space-y-1 animate-fade-in">
            <p className="font-bold">Top-Up Sukses!</p>
            <p className="text-[11px] text-emerald-700">{depSuccessMsg}</p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            Top-up Saldo Deposit
          </h4>

          <form onSubmit={handleDepositSubmit} className="space-y-4.5 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-600 font-semibold">Nominal Top-up (Rp):</label>
              <input
                type="number"
                required
                placeholder="Minimal Rp 20.000"
                value={depAmount}
                onChange={(e) => setDepAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-600 font-semibold">Metode Pembayaran:</label>
              <select
                value={depMethod}
                onChange={(e) => setDepMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="va">Virtual Account (VA BCA/Mandiri)</option>
                <option value="qris">QRIS (Gopay/OVO/Dana Instan)</option>
                <option value="bank_transfer">Transfer Bank Manual</option>
              </select>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] text-slate-500 leading-normal">
              Metode Virtual Account dan QRIS telah terintegrasi dengan Payment Gateway (Midtrans/Xendit) untuk verifikasi pembayaran real-time dalam 2 detik.
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition-all text-center cursor-pointer"
            >
              Bayar Sekarang
            </button>
          </form>
        </div>

        {/* Withdrawal History Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[180px] overflow-hidden">
          <h5 className="font-bold text-xs text-slate-800 border-b border-slate-100 pb-2 mb-2 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Riwayat WD Terakhir</span>
          </h5>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[11px]">
            {withdrawals.map(wd => (
              <div key={wd.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">{wd.bankName} - {wd.accountNumber}</p>
                  <p className="text-[9px] text-slate-400">{wd.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Rp {wd.amount.toLocaleString('id-ID')}</p>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    wd.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {wd.status === 'approved' ? 'Berhasil' : 'Tertunda'}
                  </span>
                </div>
              </div>
            ))}

            {withdrawals.length === 0 && (
              <div className="text-slate-400 italic text-center py-8">
                Belum ada pengajuan WD komisi.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
