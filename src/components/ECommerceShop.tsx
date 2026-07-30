/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Member, Wallet } from '../types';
import { ShoppingCart, Tag, ShoppingBag, Plus, Minus, Trash, Truck, ClipboardList, CheckCircle } from 'lucide-react';

interface ECommerceShopProps {
  products: Product[];
  member: Member;
  wallet: Wallet;
  onCheckout: (items: { productId: number; quantity: number; price: number }[], totalAmount: number, totalPv: number) => void;
}

export default function ECommerceShop({
  products,
  member,
  wallet,
  onCheckout
}: ECommerceShopProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ productId: number; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<string>('');

  const categories = ['All', 'Suplemen', 'Herbal', 'Kosmetik'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const addToCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === 'MLMINDONESIA') {
      setDiscountAmount(50000); // Rp 50.000 flat discount
      alert('Voucher berhasil dipasang! Potongan Rp 50.000 telah dihitung.');
    } else {
      alert('Kode voucher tidak valid!');
    }
  };

  // Totals calculations
  const cartDetails = cart.map(item => {
    const prod = products.find(p => p.id === item.productId)!;
    return {
      product: prod,
      quantity: item.quantity,
      subtotal: prod.price * item.quantity,
      totalPv: prod.pv * item.quantity
    };
  });

  const rawTotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  const totalAmount = Math.max(0, rawTotal - discountAmount);
  const totalPv = cartDetails.reduce((sum, item) => sum + item.totalPv, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (wallet.deposit < totalAmount) {
      alert('Maaf, Saldo Deposit Anda tidak mencukupi untuk melakukan pembelian produk ini.');
      return;
    }

    onCheckout(
      cart.map(i => ({ productId: i.productId, quantity: i.quantity, price: products.find(p => p.id === i.productId)!.price })),
      totalAmount,
      totalPv
    );

    setCart([]);
    setDiscountAmount(0);
    setVoucherCode('');
    setCheckoutSuccess(true);
    setTimeout(() => setCheckoutSuccess(false), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ecommerce-module">
      {/* Category selector & Info banner */}
      <div className="lg:col-span-12 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            E-Commerce Store & Repeat Order (RO)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Belanja suplemen premium perusahaan MLM untuk mengumpulkan poin PV/BV pribadi Anda.
          </p>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-600 transition-all self-stretch md:self-auto text-center justify-center relative cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Keranjang Belanja ({cart.length})</span>
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-extrabold w-4 h-4 rounded-full text-[9px] flex items-center justify-center border border-white">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Category Horizontal Filter bar */}
      <div className="lg:col-span-12 flex space-x-1.5 pb-1 border-b border-slate-100">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === cat ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Display Columns (Left) */}
      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" id="products-grid-container">
        {filteredProducts.map(prod => (
          <div
            key={prod.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            id={`product-card-${prod.id}`}
          >
            <div>
              <div className="w-full h-32 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden mb-3 relative flex items-center justify-center">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{prod.category}</span>
                <span className="absolute top-2 right-2 bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                  +{prod.pv} PV / {prod.bv} BV
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{prod.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{prod.description}</p>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
              <div>
                <p className="text-[9px] text-slate-400 font-semibold">Harga Member</p>
                <p className="font-extrabold text-slate-900 mt-0.5">Rp {prod.price.toLocaleString('id-ID')}</p>
              </div>
              <button
                onClick={() => addToCart(prod.id)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors text-[10px] cursor-pointer"
              >
                + Beli
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-out Cart Panel / Drawer (Right) */}
      <div className="lg:col-span-4 flex flex-col space-y-4" id="cart-sidebar">
        {checkoutSuccess && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl text-xs space-y-2 animate-fade-in" id="order-success-banner">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="font-bold">Checkout Belanja Sukses!</p>
            </div>
            <p className="text-[11px] text-emerald-700">
              Uang berhasil didebit dari saldo deposit Anda. Poin PV & BV pribadi telah dikreditkan ke statistik downline Anda, dan resi pengiriman kurir telah diterbitkan.
            </p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            Rincian Belanja Anda
          </h4>

          {cart.length > 0 ? (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              {/* Cart items list */}
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {cartDetails.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-[9px] text-slate-400">Rp {item.product.price.toLocaleString('id-ID')} | +{item.product.pv} PV</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 hover:bg-slate-200 rounded-lg"
                      >
                        <Minus className="w-3 h-3 text-slate-600" />
                      </button>
                      <span className="font-bold text-slate-800 text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 hover:bg-slate-200 rounded-lg"
                      >
                        <Plus className="w-3 h-3 text-slate-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg ml-1"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <label className="block text-slate-600 font-semibold">Kode Voucher Promo:</label>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    placeholder="Contoh: MLMINDONESIA"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={applyVoucher}
                    className="px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-100 cursor-pointer"
                  >
                    Pasang
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">Alamat Pengiriman Fisik:</label>
                <textarea
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Masukkan alamat pengiriman paket..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Checkout Financial Calculations panel */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Belanja:</span>
                  <span className="font-semibold text-slate-800">Rp {rawTotal.toLocaleString('id-ID')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Diskon Voucher:</span>
                    <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 border-t border-slate-200/60 pt-1.5 font-bold">
                  <span>Total Tagihan:</span>
                  <span className="text-slate-900 text-xs">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Poin Diperoleh:</span>
                  <span>+{totalPv} PV / {totalPv} BV</span>
                </div>
              </div>

              {/* Check balance warns */}
              <div className="flex justify-between text-[10px] px-1 text-slate-500">
                <span>Saldo Deposit Anda:</span>
                <span className={wallet.deposit >= totalAmount ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                  Rp {wallet.deposit.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition-all text-center cursor-pointer"
              >
                Bayar & Selesaikan Transaksi
              </button>
            </form>
          ) : (
            <div className="text-slate-400 italic text-center py-16 text-xs">
              Keranjang belanja Anda kosong. Klik "+ Beli" pada daftar produk di sebelah kiri untuk memasukkan suplemen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
