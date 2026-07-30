/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member, Package, Rank } from '../types';
import { ZoomIn, ZoomOut, Maximize2, UserPlus, Users, Award, ShieldCheck, HelpCircle } from 'lucide-react';

interface GenealogyTreeViewerProps {
  members: Member[];
  packages: Package[];
  ranks: Rank[];
  onAddMember: (sponsorId: number, parentId: number, position: 'left' | 'right', username: string, name: string) => void;
}

export default function GenealogyTreeViewer({
  members,
  packages,
  ranks,
  onAddMember
}: GenealogyTreeViewerProps) {
  const [treeType, setTreeType] = useState<'binary' | 'unilevel'>('binary');
  const [zoom, setZoom] = useState<number>(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(members[0] || null);
  const [rootId, setRootId] = useState<number>(1);

  // Form state for adding new members via tree slot clicks
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [modalPlacement, setModalPlacement] = useState<{ parentId: number; position: 'left' | 'right' } | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [sponsorSelectId, setSponsorSelectId] = useState<number>(1);

  const activeRoot = members.find(m => m.id === rootId) || members[0];

  // Helper functions for zoom
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.6));
  const handleZoomReset = () => setZoom(1);

  // Binary node lookup
  const getBinaryChild = (parentId: number, position: 'left' | 'right'): Member | undefined => {
    return members.find(m => m.uplineId === parentId && m.placement === position);
  };

  // Unilevel children lookup
  const getUnilevelChildren = (parentId: number): Member[] => {
    return members.filter(m => m.uplineId === parentId);
  };

  const getPackageName = (packageId: number | null) => {
    if (!packageId) return 'No Package';
    return packages.find(p => p.id === packageId)?.name || 'Basic';
  };

  const getRankName = (rankId: number) => {
    return ranks.find(r => r.id === rankId)?.name || 'Bronze';
  };

  const submitAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newName || !modalPlacement) return;

    onAddMember(
      sponsorSelectId,
      modalPlacement.parentId,
      modalPlacement.position,
      newUsername.trim().toLowerCase(),
      newName.trim()
    );

    // Reset fields
    setNewUsername('');
    setNewName('');
    setShowAddModal(false);
  };

  const clickEmptySlot = (parentId: number, position: 'left' | 'right') => {
    setModalPlacement({ parentId, position });
    setShowAddModal(true);
  };

  // Render SVG nodes for Binary
  const renderBinaryTreeSVG = () => {
    const nodeWidth = 140;
    const nodeHeight = 85;

    // Define coordinate offsets for 3 levels (Root, Level 1, Level 2)
    // Level 0: Root (cx=400, cy=50)
    // Level 1: Left (cx=200, cy=180), Right (cx=600, cy=180)
    // Level 2: Left-Left (cx=100, cy=310), Left-Right (cx=300, cy=310)
    //          Right-Left (cx=500, cy=310), Right-Right (cx=700, cy=310)

    const coords = {
      root: { x: 400, y: 50 },
      l1: {
        left: { x: 220, y: 180 },
        right: { x: 580, y: 180 }
      },
      l2: {
        left_left: { x: 110, y: 310 },
        left_right: { x: 330, y: 310 },
        right_left: { x: 470, y: 310 },
        right_right: { x: 690, y: 310 }
      }
    };

    // Build the 3-level tree nodes based on current root
    const rootNode = activeRoot;
    if (!rootNode) return null;

    const l1_left = getBinaryChild(rootNode.id, 'left');
    const l1_right = getBinaryChild(rootNode.id, 'right');

    const l2_left_left = l1_left ? getBinaryChild(l1_left.id, 'left') : undefined;
    const l2_left_right = l1_left ? getBinaryChild(l1_left.id, 'right') : undefined;

    const l2_right_left = l1_right ? getBinaryChild(l1_right.id, 'left') : undefined;
    const l2_right_right = l1_right ? getBinaryChild(l1_right.id, 'right') : undefined;

    // Connect lines
    const renderLine = (x1: number, y1: number, x2: number, y2: number) => (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeDasharray="1 1"
        id={`line-${x1}-${y1}`}
      />
    );

    const renderNodeBox = (member: Member, x: number, y: number) => {
      const isSelected = selectedMember?.id === member.id;
      const pack = packages.find(p => p.id === member.packageId);
      const isVerified = member.kycStatus === 'verified';

      // Design styling based on package
      let packColor = 'border-slate-300 bg-white text-slate-800';
      if (member.packageId === 1) packColor = 'border-emerald-500 bg-emerald-50';
      if (member.packageId === 2) packColor = 'border-blue-500 bg-blue-50';
      if (member.packageId === 3) packColor = 'border-amber-500 bg-amber-50';
      if (member.packageId === 4) packColor = 'border-violet-500 bg-violet-50';

      return (
        <g
          className="cursor-pointer transition-all hover:scale-105"
          onClick={() => setSelectedMember(member)}
          key={`node-${member.id}`}
        >
          {/* Card Border & Background */}
          <rect
            x={x - nodeWidth / 2}
            y={y}
            width={nodeWidth}
            height={nodeHeight}
            rx="10"
            fill={isSelected ? '#F8FAFC' : '#FFFFFF'}
            stroke={isSelected ? '#10B981' : '#E2E8F0'}
            strokeWidth={isSelected ? '2.5' : '1.5'}
            className="shadow-sm"
          />
          {/* Top colored border */}
          <rect
            x={x - nodeWidth / 2}
            y={y}
            width={nodeWidth}
            height="5"
            rx="2"
            fill={
              member.packageId === 4
                ? '#8B5CF6'
                : member.packageId === 3
                ? '#F59E0B'
                : member.packageId === 2
                ? '#3B82F6'
                : '#10B981'
            }
          />
          {/* Member Name */}
          <text
            x={x}
            y={y + 25}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="#1E293B"
          >
            {member.name.length > 15 ? member.name.substring(0, 13) + '..' : member.name}
          </text>
          {/* Username */}
          <text
            x={x}
            y={y + 42}
            textAnchor="middle"
            fontSize="10"
            fill="#64748B"
          >
            @{member.username}
          </text>
          {/* Package Badge */}
          <rect
            x={x - 45}
            y={y + 52}
            width="90"
            height="14"
            rx="7"
            fill={
              member.packageId === 4
                ? '#EDE9FE'
                : member.packageId === 3
                ? '#FEF3C7'
                : member.packageId === 2
                ? '#DBEAFE'
                : '#D1FAE5'
            }
          />
          <text
            x={x}
            y={y + 62}
            textAnchor="middle"
            fontSize="8"
            fontWeight="bold"
            fill={
              member.packageId === 4
                ? '#6D28D9'
                : member.packageId === 3
                ? '#B45309'
                : member.packageId === 2
                ? '#1D4ED8'
                : '#047857'
            }
          >
            {getPackageName(member.packageId)}
          </text>
          {/* Volumes under card */}
          <text
            x={x - 40}
            y={y + 80}
            textAnchor="middle"
            fontSize="8"
            fill="#EF4444"
            fontWeight="600"
          >
            L: {member.leftCarryForward}
          </text>
          <text
            x={x + 40}
            y={y + 80}
            textAnchor="middle"
            fontSize="8"
            fill="#10B981"
            fontWeight="600"
          >
            R: {member.rightCarryForward}
          </text>
        </g>
      );
    };

    const renderEmptyNode = (parentId: number, position: 'left' | 'right', x: number, y: number) => {
      return (
        <g
          className="cursor-pointer transition-all hover:scale-105"
          onClick={() => clickEmptySlot(parentId, position)}
          key={`empty-${parentId}-${position}`}
        >
          <rect
            x={x - nodeWidth / 2}
            y={y}
            width={nodeWidth}
            height={nodeHeight}
            rx="10"
            fill="#F8FAFC"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={x}
            y={y + 35}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="#64748B"
          >
            + Slot Kosong
          </text>
          <text
            x={x}
            y={y + 52}
            textAnchor="middle"
            fontSize="8"
            fill="#94A3B8"
          >
            Klik untuk tambah
          </text>
        </g>
      );
    };

    return (
      <svg
        viewBox="0 0 800 450"
        width="100%"
        height="100%"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        className="transition-transform duration-200"
        id="genealogy-svg"
      >
        {/* Connection Lines Level 0 to Level 1 */}
        {rootNode && renderLine(coords.root.x, coords.root.y + nodeHeight, coords.l1.left.x, coords.l1.left.y)}
        {rootNode && renderLine(coords.root.x, coords.root.y + nodeHeight, coords.l1.right.x, coords.l1.right.y)}

        {/* Connection Lines Level 1 to Level 2 */}
        {l1_left && renderLine(coords.l1.left.x, coords.l1.left.y + nodeHeight, coords.l2.left_left.x, coords.l2.left_left.y)}
        {l1_left && renderLine(coords.l1.left.x, coords.l1.left.y + nodeHeight, coords.l2.left_right.x, coords.l2.left_right.y)}

        {l1_right && renderLine(coords.l1.right.x, coords.l1.right.y + nodeHeight, coords.l2.right_left.x, coords.l2.right_left.y)}
        {l1_right && renderLine(coords.l1.right.x, coords.l1.right.y + nodeHeight, coords.l2.right_right.x, coords.l2.right_right.y)}

        {/* Root Node */}
        {renderNodeBox(rootNode, coords.root.x, coords.root.y)}

        {/* Level 1 Nodes */}
        {l1_left ? renderNodeBox(l1_left, coords.l1.left.x, coords.l1.left.y) : renderEmptyNode(rootNode.id, 'left', coords.l1.left.x, coords.l1.left.y)}
        {l1_right ? renderNodeBox(l1_right, coords.l1.right.x, coords.l1.right.y) : renderEmptyNode(rootNode.id, 'right', coords.l1.right.x, coords.l1.right.y)}

        {/* Level 2 Nodes */}
        {l1_left && (
          l2_left_left ? renderNodeBox(l2_left_left, coords.l2.left_left.x, coords.l2.left_left.y) : renderEmptyNode(l1_left.id, 'left', coords.l2.left_left.x, coords.l2.left_left.y)
        )}
        {l1_left && (
          l2_left_right ? renderNodeBox(l2_left_right, coords.l2.left_right.x, coords.l2.left_right.y) : renderEmptyNode(l1_left.id, 'right', coords.l2.left_right.x, coords.l2.left_right.y)
        )}

        {l1_right && (
          l2_right_left ? renderNodeBox(l2_right_left, coords.l2.right_left.x, coords.l2.right_left.y) : renderEmptyNode(l1_right.id, 'left', coords.l2.right_left.x, coords.l2.right_left.y)
        )}
        {l1_right && (
          l2_right_right ? renderNodeBox(l2_right_right, coords.l2.right_right.x, coords.l2.right_right.y) : renderEmptyNode(l1_right.id, 'right', coords.l2.right_right.x, coords.l2.right_right.y)
        )}
      </svg>
    );
  };

  // Unilevel Grid renderer
  const renderUnilevelTree = () => {
    const rootNode = activeRoot;
    if (!rootNode) return null;

    const directReferrals = members.filter(m => m.sponsorId === rootNode.id);

    return (
      <div className="p-4" id="unilevel-view">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 text-white rounded-lg px-6 py-3 shadow-md flex items-center space-x-3">
            <Users className="w-5 h-5 text-emerald-200" />
            <div>
              <p className="text-xs text-emerald-200">Upline Leader (Root)</p>
              <h5 className="font-bold text-sm">@{rootNode.username} ({rootNode.name})</h5>
            </div>
          </div>
          <div className="w-0.5 h-10 bg-slate-300"></div>
          <div className="h-0.5 w-4/5 bg-slate-300"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {directReferrals.map(ref => (
            <div
              key={ref.id}
              onClick={() => {
                setSelectedMember(ref);
                setRootId(ref.id);
              }}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all text-center flex flex-col items-center"
              id={`unilevel-member-${ref.id}`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2 text-xs">
                {ref.name.substring(0, 2).toUpperCase()}
              </div>
              <p className="font-bold text-xs text-slate-800">{ref.name}</p>
              <p className="text-[10px] text-slate-500 mb-2">@{ref.username}</p>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full">
                {getPackageName(ref.packageId)}
              </span>
              <div className="mt-2 text-[9px] text-slate-500 flex justify-between w-full border-t border-slate-100 pt-2">
                <span>Downlines: {ref.downlineCount}</span>
                <span>Direct: {ref.sponsorCount}</span>
              </div>
            </div>
          ))}

          {directReferrals.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-400 text-sm">
              Belum memiliki downline langsung yang disponsori.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="genealogy-module">
      {/* Topology Toolbar */}
      <div className="lg:col-span-12 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200/80 gap-4" id="genealogy-toolbar">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Visualisasi Jaringan MLM (Genealogy)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Navigasi silsilah member dengan format Binary Tree maupun Unilevel Network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Tree view options */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setTreeType('binary')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                treeType === 'binary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Binary (Kiri/Kanan)
            </button>
            <button
              onClick={() => setTreeType('unilevel')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                treeType === 'unilevel' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unilevel (Direct Sponsor)
            </button>
          </div>

          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-white text-xs">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1.5 hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {rootId !== 1 && (
            <button
              onClick={() => setRootId(1)}
              className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              Kembali ke Root (ID 1)
            </button>
          )}
        </div>
      </div>

      {/* Main interactive Tree */}
      <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden min-h-[450px] relative shadow-inner" id="genealogy-canvas-container">
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200/60 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 z-10">
          Upline Aktif: <span className="text-emerald-600">@{activeRoot.username}</span>
        </div>

        {treeType === 'binary' ? (
          <div className="w-full h-full p-4 overflow-auto flex justify-center items-start">
            <div className="min-w-[800px]">
              {renderBinaryTreeSVG()}
            </div>
          </div>
        ) : (
          renderUnilevelTree()
        )}
      </div>

      {/* Sidebar: Detail Panel */}
      <div className="lg:col-span-4 flex flex-col space-y-4" id="genealogy-sidebar">
        {selectedMember ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                {selectedMember.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight">{selectedMember.name}</h4>
                <p className="text-xs text-slate-500">@{selectedMember.username}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Peringkat:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {getRankName(selectedMember.rankId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Paket Aktif:</span>
                <span className="font-bold text-emerald-600">{getPackageName(selectedMember.packageId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">KYC Status:</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                  selectedMember.kycStatus === 'verified'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selectedMember.kycStatus === 'pending'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {selectedMember.kycStatus === 'verified' ? 'Terverifikasi' : 'Belum Verifikasi'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sponsor Langsung:</span>
                <span className="font-semibold text-slate-800">
                  {selectedMember.sponsorId ? `@${members.find(m => m.id === selectedMember.sponsorId)?.username}` : 'Perusahaan'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Gabung:</span>
                <span className="text-slate-600">{new Date(selectedMember.created_at).toLocaleDateString('id-ID')}</span>
              </div>
            </div>

            {/* Leg Volume Metrics (Binary details) */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-2">
              <p className="font-bold text-slate-700 border-b border-slate-200/60 pb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Kaki Biner (Carry Forward)
              </p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white border border-slate-100 p-2 rounded-lg">
                  <p className="text-[10px] text-slate-400">Kiri (Left)</p>
                  <p className="font-extrabold text-red-600 text-sm mt-0.5">{selectedMember.leftCarryForward} PV</p>
                </div>
                <div className="bg-white border border-slate-100 p-2 rounded-lg">
                  <p className="text-[10px] text-slate-400">Kanan (Right)</p>
                  <p className="font-extrabold text-emerald-600 text-sm mt-0.5">{selectedMember.rightCarryForward} PV</p>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-1">
                <span>Total Downlines: {selectedMember.downlineCount}</span>
                <span>Referral: {selectedMember.sponsorCount}</span>
              </div>
            </div>

            {selectedMember.id !== rootId && (
              <button
                onClick={() => setRootId(selectedMember.id)}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs rounded-xl shadow-sm hover:shadow transition-all text-center cursor-pointer"
              >
                Fokus ke Jaringan Member Ini
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
            Pilih salah satu node member di kanvas untuk memunculkan profil detail jaringan.
          </div>
        )}

        {/* Legend Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5">
          <h5 className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            Panduan Legenda Warna Paket
          </h5>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-slate-600">Basic Package</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="font-medium text-slate-600">Silver Package</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="font-medium text-slate-600">Gold Package</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
              <span className="font-medium text-slate-600">Platinum Package</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Tambah Downline Baru */}
      {showAddModal && modalPlacement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" id="add-downline-modal">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-warning" />
                Registrasi Downline Baru
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={submitAddMember} className="p-5 space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 space-y-1">
                <p className="font-semibold text-emerald-800">Upline Node & Posisi Penempatan:</p>
                <p className="text-slate-600">
                  Upline: <span className="font-bold">@{members.find(m => m.id === modalPlacement.parentId)?.username}</span>
                </p>
                <p className="text-slate-600">
                  Kaki Penempatan: <span className="font-bold uppercase text-emerald-700">{modalPlacement.position} Leg</span>
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">Sponsor Langsung (Referral):</label>
                <select
                  value={sponsorSelectId}
                  onChange={(e) => setSponsorSelectId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      @{m.username} ({m.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">Username Baru:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: andi88"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Andi Wijaya"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] text-slate-500">
                Pendaftaran baru ini akan mensimulasikan penempatan kaki, mengupdate genealogy, dan menambahkan volume leg upline di atasnya secara rekursif!
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm cursor-pointer"
                >
                  Daftarkan Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
