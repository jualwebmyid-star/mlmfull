/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DATABASE_SCHEMA_LIST, OTHER_TABLES_INVENTORY, CATEGORIES } from '../data/databaseSchema';
import { Database, Search, Copy, Check, ListFilter, HelpCircle, HardDrive } from 'lucide-react';

export default function SchemaViewer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState(DATABASE_SCHEMA_LIST[0]);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Filter both lists
  const filteredCoreTables = DATABASE_SCHEMA_LIST.filter(table => {
    const matchesCategory = selectedCategory === 'All' || table.category === selectedCategory;
    const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          table.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredInventoryTables = OTHER_TABLES_INVENTORY.filter(table => {
    const matchesCategory = selectedCategory === 'All' || table.module === selectedCategory;
    const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          table.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopySql = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="database-schema-viewer">
      {/* Category Bar & Search */}
      <div className="lg:col-span-12 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-base font-bold text-slate-800">Database Schema (80 Normalized Tables)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Struktur basis data relasional MySQL yang telah dinormalisasi lengkap dengan DDL DDL SQL siap-pakai.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tabel atau kolom..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800"
          />
        </div>
      </div>

      {/* Categories filter sidebar */}
      <div className="lg:col-span-12 flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
            selectedCategory === 'All' ? 'bg-emerald-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Semua ({DATABASE_SCHEMA_LIST.length + OTHER_TABLES_INVENTORY.length})</span>
        </button>
        {CATEGORIES.map(cat => {
          const count = DATABASE_SCHEMA_LIST.filter(t => t.category === cat).length +
                        OTHER_TABLES_INVENTORY.filter(t => t.module === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat ? 'bg-emerald-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Left lists (Core schemas vs Table Inventory) */}
      <div className="lg:col-span-5 space-y-4 max-h-[500px] overflow-y-auto pr-1" id="tables-list-column">
        {/* Core Tables section */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Skema DDL Utama ({filteredCoreTables.length})</span>
          </h4>
          <div className="space-y-1.5">
            {filteredCoreTables.map(table => (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                  selectedTable.name === table.name
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                id={`table-selector-${table.name}`}
              >
                <div>
                  <h5 className="font-bold text-xs text-slate-800">
                    {table.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{table.description}</p>
                </div>
                <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                  Core
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Inventory list section */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-emerald-500" />
            <span>Tabel Relasional Tambahan ({filteredInventoryTables.length})</span>
          </h4>
          <div className="space-y-1.5">
            {filteredInventoryTables.map(table => (
              <div
                key={table.name}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-slate-700">
                    {table.name}
                  </span>
                  <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded uppercase">
                    Normalized
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{table.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Detailed Table Schema Definition & DDL) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm" id="schema-details-column">
        {/* Table Title Panel */}
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Tabel: {selectedTable.name}</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{selectedTable.description}</p>
          </div>

          <button
            onClick={() => handleCopySql(selectedTable.sql)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition-all"
            title="Salin SQL DDL"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">SQL Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin SQL DDL</span>
              </>
            )}
          </button>
        </div>

        {/* Content Area split in Columns / SQL tabs */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Columns Table */}
          <div>
            <h5 className="font-bold text-xs text-slate-700 mb-2">Definisi Kolom & Tipe Data</h5>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-2.5">Nama Kolom</th>
                    <th className="p-2.5">Tipe Data</th>
                    <th className="p-2.5">Atribut</th>
                    <th className="p-2.5">Deskripsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedTable.fields.map(field => (
                    <tr key={field.name} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-semibold text-slate-900">{field.name}</td>
                      <td className="p-2.5 font-mono text-emerald-700">{field.type}</td>
                      <td className="p-2.5">
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          {field.attributes}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-500">{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DDL SQL Panel */}
          <div>
            <h5 className="font-bold text-xs text-slate-700 mb-2">Query SQL DDL Pembuatan Tabel (MySQL/MariaDB)</h5>
            <div className="bg-slate-950 text-slate-300 font-mono text-[10px] p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-900">
              {selectedTable.sql}
            </div>
          </div>
        </div>

        {/* Foreign Key note */}
        <div className="bg-amber-50/80 border-t border-amber-100 px-4 py-2 text-[10px] text-amber-800 flex items-center space-x-2">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            * Integritas referensial terjaga penuh dengan kaskade data (<span className="font-mono bg-amber-100 px-1 rounded">ON DELETE CASCADE</span> / <span className="font-mono bg-amber-100 px-1 rounded">SET NULL</span>).
          </span>
        </div>
      </div>
    </div>
  );
}
