/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Member {
  id: number;
  name: string;
  username: string;
  email: string;
  sponsorId: number | null;
  uplineId: number | null;
  placement: 'left' | 'right' | null; // For Binary
  rankId: number;
  packageId: number | null;
  kycStatus: 'unverified' | 'pending' | 'verified';
  ktp?: string;
  npwp?: string;
  selfie?: string;
  bukuRekening?: string;
  created_at: string;
  // Volumes
  leftVolume: number; // Left leg active PV/BV
  rightVolume: number; // Right leg active PV/BV
  leftCarryForward: number;
  rightCarryForward: number;
  sponsorCount: number;
  downlineCount: number;
  isSimulated?: boolean;
}

export interface Package {
  id: number;
  name: string;
  price: number;
  pv: number; // Point Value (for Rank)
  bv: number; // Business Value (for Commissions)
  cv: number; // Commissionable Value (for payouts)
  status: 'active' | 'inactive';
}

export interface Wallet {
  memberId: number;
  bonus: number;
  cashback: number;
  reward: number;
  deposit: number;
  belanja: number;
}

export interface WalletTransaction {
  id: string;
  memberId: number;
  type: 'bonus' | 'cashback' | 'reward' | 'deposit' | 'belanja';
  amount: number;
  direction: 'in' | 'out';
  description: string;
  date: string;
  referenceId?: string;
}

export interface MLMBonus {
  id: string;
  name: string;
  description: string;
  category: 'sponsor' | 'pairing' | 'matching' | 'rank' | 'other';
  isEnabled: boolean;
  type: 'percentage' | 'fixed';
  value: number; // value (e.g. 10% or Rp 100.000)
  minOmzet?: number;
  maxBonus?: number;
}

export interface Rank {
  id: number;
  name: string;
  requirements: {
    sponsorCount: number;
    leftPv: number;
    rightPv: number;
    personalPv: number;
  };
  bonusReward: string;
  rewardItem: string;
  rewardValue: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  pv: number;
  bv: number;
  image: string;
  stock: number;
  description: string;
}

export interface Order {
  id: string;
  memberId: number;
  items: { productId: number; quantity: number; price: number }[];
  totalAmount: number;
  totalPv: number;
  shippingAddress: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed';
  resi?: string;
  date: string;
}

export interface WithdrawalRequest {
  id: string;
  memberId: number;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  adminFee: number;
  taxAmount: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  remarks?: string;
}

export interface DepositRequest {
  id: string;
  memberId: number;
  amount: number;
  method: 'va' | 'qris' | 'bank_transfer' | 'midtrans' | 'stripe';
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface LaravelFile {
  path: string;
  name: string;
  type: 'migration' | 'model' | 'repository' | 'controller' | 'route' | 'installer' | 'view';
  content: string;
}
