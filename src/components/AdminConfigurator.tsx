/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MLMBonus, Member, Package, Rank } from '../types';
import { Play, Settings, ShieldAlert, ToggleLeft, ToggleRight, DollarSign, Activity, CheckCircle, RefreshCcw, Sparkles } from 'lucide-react';

interface AdminConfiguratorProps {
  bonuses: MLMBonus[];
  members: Member[];
  packages: Package[];
  ranks: Rank[];
  onToggleBonus: (bonusId: string) => void;
  onUpdateBonusValue: (bonusId: string, newValue: number) => void;
  onRunSettlementSimulation: (logs: string[]) => void;
}

export default function AdminConfigurator({
  bonuses,
  members,
  packages,
  ranks,
  onToggleBonus,
  onUpdateBonusValue,
  onRunSettlementSimulation
}: AdminConfiguratorProps) {
  const [activeTab, setActiveTab] = useState<'bonus_list' | 'payout_engine'>('bonus_list');
  const [runningSimulation, setRunningSimulation] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [pairingRatio, setPairingRatio] = useState<string>('1:1');
  const [flushOutLimit, setFlushOutLimit] = useState<number>(10);

  // Run the full multi-leg binary pairing and sponsorship calculation simulation
  const executeEngineRun = () => {
    setRunningSimulation(true);
    setSimulationLogs(['[START] Memulai MLM Daily Commission Settlement Engine...']);
    
    const logs: string[] = [];
    const now = new Date().toLocaleTimeString('id-ID');
    
    setTimeout(() => {
      logs.push(`[${now}] Menginisialisasi parameter settlement bonus...`);
      logs.push(`[${now}] Memuat konfigurasi aturan biner: Rasio ${pairingRatio}, Batas Flush-Out: ${flushOutLimit} pasang per hari.`);
      
      // Look for active bonuses
      const activeBonusesList = bonuses.filter(b => b.isEnabled);
      logs.push(`[${now}] Ditemukan ${activeBonusesList.length} bonus aktif dari total ${bonuses.length} konfigurasi bonus.`);

      // 1. Calculate Sponsor Commission Simulation
      if (bonuses.find(b => b.id === 'bonus_sponsor')?.isEnabled) {
        logs.push(`[${now}] [PROSES] Menghitung Bonus Sponsor (Sponsorship Commissions)...`);
        let sponsorPayouts = 0;
        members.forEach(m => {
          if (m.sponsorId) {
            const sponsor = members.find(s => s.id === m.sponsorId);
            if (sponsor) {
              const bSponsor = bonuses.find(b => b.id === 'bonus_sponsor')!;
              const commAmount = bSponsor.value; // Rp 150.000
              sponsorPayouts += commAmount;
              logs.push(` - Member @${m.username} mensponsori pendaftaran baru. Mengkredit Rp ${commAmount.toLocaleString('id-ID')} ke dompet bonus @${sponsor.username}.`);
            }
          }
        });
        logs.push(`[${now}] [SUKSES] Total payout Bonus Sponsor: Rp ${sponsorPayouts.toLocaleString('id-ID')}`);
      }

      // 2. Binary Pairing Commission Simulation
      if (bonuses.find(b => b.id === 'bonus_pairing')?.isEnabled) {
        logs.push(`[${now}] [PROSES] Menghitung Bonus Pasangan Biner (Binary Pairing Match)...`);
        let pairingPayouts = 0;
        let flushCount = 0;

        members.forEach(m => {
          if (m.leftCarryForward > 0 && m.rightCarryForward > 0) {
            const bPairing = bonuses.find(b => b.id === 'bonus_pairing')!;
            const rawPairs = Math.min(m.leftCarryForward, m.rightCarryForward);
            
            // Apply flushout limits
            const payablePairs = Math.min(rawPairs, flushOutLimit);
            const flushed = rawPairs - payablePairs;
            
            const comm = payablePairs * bPairing.value; // E.g., Rp 50.000 per pair
            pairingPayouts += comm;
            flushCount += flushed;

            logs.push(` - Node @${m.username}: Kiri=${m.leftCarryForward} PV, Kanan=${m.rightCarryForward} PV.`);
            logs.push(`   * Terbentuk ${payablePairs} pasang. Komisi dikredit: Rp ${comm.toLocaleString('id-ID')}.`);
            if (flushed > 0) {
              logs.push(`   * [FLUSHOUT] Kelebihan ${flushed} pasang dibuang karena melebihi batas harian.`);
            }
          }
        });
        logs.push(`[${now}] [SUKSES] Total payout Bonus Pasangan: Rp ${pairingPayouts.toLocaleString('id-ID')}. Sisa Volume di-Carry Forward.`);
      }

      // 3. Rank Auto-Promote check
      logs.push(`[${now}] [PROSES] Menilai kualifikasi promosi peringkat otomatis (Rank Advancements)...`);
      members.forEach(m => {
        // Calculate dynamic rank promotions
        const currentRank = ranks.find(r => r.id === m.rankId);
        const nextRank = ranks.find(r => r.id === m.rankId + 1);
        
        if (nextRank) {
          const req = nextRank.requirements;
          const leftVol = m.leftVolume;
          const rightVol = m.rightVolume;
          
          if (leftVol >= req.leftPv && rightVol >= req.rightPv && m.sponsorCount >= req.sponsorCount) {
            logs.push(` - [AUTO-PROMOTION] Member @${m.username} berhak naik peringkat dari ${currentRank?.name} -> ${nextRank.name}!`);
            logs.push(`   * Reward khusus dikreditkan: ${nextRank.rewardItem} (Senilai Rp ${nextRank.rewardValue.toLocaleString('id-ID')}).`);
          }
        }
      });

      logs.push(`[${now}] [FINISH] Komisi settlement harian selesai diproses. Database mutasi tersinkronisasi.`);
      
      setSimulationLogs([...logs]);
      setRunningSimulation(false);

      // Trigger global state update in parent to give actual money to member simulation
      onRunSettlementSimulation(logs);
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="admin-configurator-module">
      {/* Tab Select Header */}
      <div className="lg:col-span-12 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            Panel Admin: Manajemen Bonus & Mesin Kalkulasi
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Aktifkan/matikan 40+ jenis bonus MLM dan jalankan simulasi komisi settlement harian (settlement engine).
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs w-full md:w-auto">
          <button
            onClick={() => setActiveTab('bonus_list')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'bonus_list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Daftar Pengaturan Bonus</span>
          </button>
          <button
            onClick={() => setActiveTab('payout_engine')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'payout_engine' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Settlement Engine</span>
          </button>
        </div>
      </div>

      {/* RENDER TAB: BONUS LIST */}
      {activeTab === 'bonus_list' && (
        <div className="lg:col-span-12 space-y-6" id="admin-bonus-list-view">
          {/* Top warning info */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-800">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Konfigurasi Aturan Bonus Dinamis (Dynamic Rule Engine)</p>
              <p className="mt-1 text-amber-700 leading-relaxed">
                Semua toggle di bawah ini mengontrol perhitungan logika program secara dinamis. Anda dapat menghidupkan atau mematikan bonus, serta merubah nominal untuk mensimulasikan model bisnis perusahaan MLM Anda.
              </p>
            </div>
          </div>

          {/* Grid list of bonuses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bonuses.map(bonus => (
              <div
                key={bonus.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
                id={`admin-bonus-card-${bonus.id}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      bonus.category === 'sponsor'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : bonus.category === 'pairing'
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {bonus.category}
                    </span>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => onToggleBonus(bonus.id)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title={bonus.isEnabled ? 'Matikan' : 'Aktifkan'}
                    >
                      {bonus.isEnabled ? (
                        <ToggleRight className="w-7 h-7 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-slate-300" />
                      )}
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-800 text-xs">{bonus.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal mb-4">{bonus.description}</p>
                </div>

                {/* Edit Input for Value */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Nilai Bonus:</span>
                  <div className="flex items-center space-x-1">
                    {bonus.type === 'fixed' && <span className="text-slate-400 font-bold">Rp</span>}
                    <input
                      type="number"
                      value={bonus.value}
                      disabled={!bonus.isEnabled}
                      onChange={(e) => onUpdateBonusValue(bonus.id, Number(e.target.value))}
                      className={`w-20 px-2 py-1 text-right border rounded-lg font-bold text-xs ${
                        bonus.isEnabled ? 'border-slate-300 text-slate-800 bg-white' : 'border-slate-100 text-slate-300 bg-slate-50'
                      }`}
                    />
                    {bonus.type === 'percentage' && <span className="text-slate-400 font-bold">%</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER TAB: PAYOUT SETTLEMENT ENGINE */}
      {activeTab === 'payout_engine' && (
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6" id="admin-payout-engine-view">
          
          {/* Rules Configuration Column */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-warning" />
              Aturan Mesin Biner (Binary Parameters)
            </h4>

            {/* Ratio selection */}
            <div className="space-y-1 text-xs">
              <label className="block text-slate-700 font-semibold">Rasio Pasangan Kaki (Pairing Ratio):</label>
              <select
                value={pairingRatio}
                onChange={(e) => setPairingRatio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="1:1">1:1 Standard (Rasio Paling Adil)</option>
                <option value="1:2">1:2 Ratio (Kaki Gajah Compensate)</option>
                <option value="2:1">2:1 Ratio (Spillover Compensate)</option>
              </select>
            </div>

            {/* Flushout Limit input */}
            <div className="space-y-1 text-xs">
              <label className="block text-slate-700 font-semibold">Batas Flush-out Harian (Pasang/Hari):</label>
              <input
                type="number"
                value={flushOutLimit}
                onChange={(e) => setFlushOutLimit(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
              <p className="text-[9px] text-slate-400">
                Flushout membatasi pembayaran bonus harian demi menjaga keamanan finansial omzet perusahaan agar tidak over-payout.
              </p>
            </div>

            {/* Execute Button */}
            <button
              onClick={executeEngineRun}
              disabled={runningSimulation}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow transition-all cursor-pointer ${
                runningSimulation
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-md'
              }`}
            >
              {runningSimulation ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  <span>Sedang Menghitung Komisi...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>JALANKAN SETTLEMENT MLM SEKARANG</span>
                </>
              )}
            </button>
          </div>

          {/* Running logs Monitor Column */}
          <div className="md:col-span-7 bg-slate-950 border border-slate-900 rounded-2xl p-5 flex flex-col h-[340px] overflow-hidden" id="payout-engine-terminal">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3 text-xs">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Console Log Transaksi Settlement
              </span>
              <button
                onClick={() => setSimulationLogs([])}
                className="text-[10px] text-slate-500 hover:text-slate-300 font-semibold"
              >
                Clear Screen
              </button>
            </div>

            {/* Terminal screen text scrolling */}
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1 text-slate-300 select-all pr-1">
              {simulationLogs.map((log, index) => (
                <div
                  key={index}
                  className={
                    log.includes('[START]') || log.includes('[FINISH]')
                      ? 'text-warning font-bold'
                      : log.includes('[SUKSES]')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('[AUTO-PROMOTION]')
                      ? 'text-amber-400 font-bold'
                      : 'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))}

              {simulationLogs.length === 0 && (
                <div className="text-slate-500 italic text-center py-16">
                  Terminal menganggur. Klik tombol "JALANKAN SETTLEMENT MLM" di sebelah kiri untuk memulai kalkulasi program nyata.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
