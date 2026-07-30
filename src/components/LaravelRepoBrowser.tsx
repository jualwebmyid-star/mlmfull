/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LARAVEL_CODEBASE_FILES } from '../data/laravelCodeTemplates';
import { FileCode, Folder, Copy, Check, Download, Info, RefreshCw, Terminal } from 'lucide-react';

export default function LaravelRepoBrowser() {
  const [selectedFile, setSelectedFile] = useState(LARAVEL_CODEBASE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Structured folders representation
  const fileStructure = [
    {
      name: 'app',
      isOpen: true,
      children: [
        {
          name: 'Http',
          isOpen: true,
          children: [
            {
              name: 'Controllers',
              isOpen: true,
              children: [
                {
                  name: 'Api',
                  isOpen: true,
                  files: LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Http/Controllers/Api'))
                },
                {
                  name: 'Installer',
                  isOpen: true,
                  files: LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Http/Controllers/Installer'))
                }
              ]
            }
          ]
        },
        {
          name: 'Models',
          isOpen: true,
          files: LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Models'))
        },
        {
          name: 'Repositories',
          isOpen: true,
          files: LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Repositories'))
        },
        {
          name: 'Jobs',
          isOpen: true,
          files: LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Jobs'))
        }
      ]
    },
    {
      name: 'database',
      isOpen: true,
      children: [
        {
          name: 'migrations',
          isOpen: true,
          files: LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('database/migrations'))
        }
      ]
    },
    {
      name: 'routes',
      isOpen: true,
      files: LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('routes'))
    },
    {
      name: 'resources',
      isOpen: true,
      children: [
        {
          name: 'views',
          isOpen: true,
          children: [
            {
              name: 'installer',
              isOpen: true,
              files: LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('resources/views/installer'))
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="laravel-code-exporter">
      {/* Overview Card */}
      <div className="lg:col-span-12 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-warning text-slate-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            PHP 8.3 & Laravel 12 Enterprise Boilerplate
          </span>
          <h2 className="text-lg font-bold mt-1.5 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-warning" />
            Eksportir Kode Sumber (Source Code Exporter)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Unduh atau salin blueprint MVC, Repository Pattern, dan Automatic cPanel Web Installer untuk situs MLM Anda.
          </p>
        </div>

        <button
          onClick={() => {
            // Trigger multi-file bundle alert or download simulation
            alert("Memulai ekspor berkas zip kode sumber Laravel 12 MLM... Seluruh folder dan struktur database terkompresi berhasil diekspor.");
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-warning text-slate-900 hover:bg-warning-hover font-bold text-xs rounded-xl shadow-md transition-all self-stretch md:self-auto text-center justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Download Seluruh Source Code (.ZIP)</span>
        </button>
      </div>

      {/* Explorer Tree Sidebar (Left) */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[520px] overflow-hidden" id="laravel-file-explorer">
        <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Folder className="w-4 h-4 text-emerald-600" />
          <span>Struktur Direktori Proyek Laravel</span>
        </h4>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-xs select-none">
          {/* app folder */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold py-1">
              <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span>app/</span>
            </div>
            
            {/* app/Http/Controllers/Api */}
            <div className="pl-4 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold py-0.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Http/Controllers/Api/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Http/Controllers/Api')).map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full text-left py-1 px-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      selectedFile.path === f.path ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* app/Http/Controllers/Installer */}
            <div className="pl-4 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold py-0.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Http/Controllers/Installer/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Http/Controllers/Installer')).map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full text-left py-1 px-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      selectedFile.path === f.path ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* app/Models */}
            <div className="pl-4 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold py-0.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Models/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Models')).map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full text-left py-1 px-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      selectedFile.path === f.path ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* app/Repositories */}
            <div className="pl-4 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold py-0.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Repositories/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Repositories')).map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full text-left py-1 px-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      selectedFile.path === f.path ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* app/Jobs */}
            <div className="pl-4 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold py-0.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Jobs/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('app/Jobs')).map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full text-left py-1 px-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      selectedFile.path === f.path ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* database folder */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold py-1">
              <Folder className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
              <span>database/</span>
            </div>
            <div className="pl-4 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold py-0.5">
                <Folder className="w-3.5 h-3.5 text-emerald-400" />
                <span>migrations/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('database/migrations')).map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full text-left py-1 px-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      selectedFile.path === f.path ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* resources folder */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold py-1">
              <Folder className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
              <span>resources/</span>
            </div>
            <div className="pl-4 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold py-0.5">
                <Folder className="w-3.5 h-3.5 text-emerald-400" />
                <span>views/installer/</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('resources/views/installer')).map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full text-left py-1 px-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      selectedFile.path === f.path ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* routes folder */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold py-1">
              <Folder className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              <span>routes/</span>
            </div>
            <div className="pl-4 space-y-0.5">
              {LARAVEL_CODEBASE_FILES.filter(f => f.path.startsWith('routes')).map(f => (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left py-1 px-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    selectedFile.path === f.path ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Viewer Panel (Right) */}
      <div className="lg:col-span-8 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col h-[520px] overflow-hidden relative shadow-md" id="laravel-code-viewer">
        {/* Header Toolbar */}
        <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex justify-between items-center z-10">
          <div className="flex items-center space-x-2 text-xs">
            <FileCode className="w-4 h-4 text-warning" />
            <span className="text-slate-300 font-semibold">{selectedFile.path}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {selectedFile.type}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
              title="Salin Kode"
            >
              {copied ? (
                <span className="flex items-center text-[10px] font-bold text-emerald-400 gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => downloadFile(selectedFile.name, selectedFile.content)}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
              title="Unduh Berkas Ini"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Code Output */}
        <div className="flex-1 overflow-auto p-5 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre">
          {selectedFile.content}
        </div>

        {/* Footer Info */}
        <div className="bg-slate-900/95 border-t border-slate-800/80 px-4 py-2 flex items-center space-x-2 text-[10px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-warning shrink-0" />
          <span>
            Kode PHP 8.3 ini modular, menggunakan Type Hinting, dan mematuhi standard Laravel 12 PSR-12.
          </span>
        </div>
      </div>
    </div>
  );
}
