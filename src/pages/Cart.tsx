import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Your cart is empty.</h1>
          <p className="text-stone-500 max-w-md mx-auto">
            It looks like you haven't added anything to your cart yet. Explore our collection to find something you love.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-block bg-stone-900 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-all shadow-xl"
        >
          Discover Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Cart Items */}
        <div className="flex-1 space-y-12">
          <div className="flex items-end justify-between border-b-4 border-slate-50 pb-8">
            <h1 className="text-5xl md:text-6xl font-display font-black text-slate-900 tracking-tight">My Box.</h1>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[11px]">{items.length} Items Found</p>
          </div>

          <div className="space-y-8">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex flex-col sm:flex-row gap-8 pb-8 border-b-2 border-slate-50"
                >
                  <div className="w-full sm:w-48 aspect-square bg-slate-100 rounded-[2rem] overflow-hidden relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] text-brand font-black uppercase tracking-widest">{item.category}</p>
                        <h3 className="text-2xl font-display font-black text-slate-900">{item.name}</h3>
                      </div>
                      <p className="text-2xl font-display font-black text-brand">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-50 rounded-2xl h-14 px-4 border-2 border-slate-50 focus-within:border-brand transition-all">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-slate-400 hover:text-brand transition-colors disabled:opacity-20"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={18} strokeWidth={3} />
                        </button>
                        <span className="w-12 text-center font-black text-lg text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-slate-400 hover:text-brand transition-colors disabled:opacity-20"
                          disabled={item.quantity >= (item.stock || 99)}
                        >
                          <Plus size={18} strokeWidth={3} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest"
                      >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Link to="/shop" className="inline-flex items-center space-x-3 text-slate-400 hover:text-brand transition-colors font-black uppercase tracking-widest text-[11px] group">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            <span>Keep Shopping</span>
          </Link>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-[420px]">
          <div className="bg-white rounded-[3rem] p-10 md:p-12 space-y-10 sticky top-32 border-4 border-slate-50 shadow-2xl shadow-slate-100">
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight border-b-2 border-slate-50 pb-6 uppercase">Order Summary</h2>
            
            <div className="space-y-6 text-[11px] font-black uppercase tracking-widest">
              <div className="flex justify-between items-center text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Service Fee</span>
                <span className="text-slate-900">{formatPrice(total * 0.05)}</span>
              </div>
            </div>

            <div className="pt-8 border-t-2 border-slate-50 flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total</span>
              <span className="text-4xl font-display font-black text-brand tracking-tight">{formatPrice(total * 1.05)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-[12px] hover:bg-brand-dark transition-all flex items-center justify-center space-x-4 group shadow-2xl shadow-brand/20"
            >
              <span>Go to Checkout</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>

            <div className="space-y-4 pt-6 border-t-2 border-slate-50">
               <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest font-black text-slate-400">
                  <ShieldCheck size={16} className="text-brand" />
                  <span>Secure Checkout</span>
               </div>
               <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest font-black text-slate-400">
                  <Truck size={16} className="text-brand" />
                  <span>Fast Global Shipping</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
