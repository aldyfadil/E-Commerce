import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { formatPrice, cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { Lock, MapPin, CreditCard, ChevronRight } from 'lucide-react';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'bank_transfer'
  });

  if (items.length === 0) {
    navigate('/shop');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        items: items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        totalAmount: total * 1.1, // includes tax in this demo
        status: 'pending',
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/track/${docRef.id}`);
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Form */}
        <div className="flex-1 space-y-16">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 tracking-tight leading-none capitalize">Final <span className="text-brand">Step.</span></h1>
            <p className="text-slate-400 font-bold text-lg">Almost there! Just tell us where to send your new favorite pieces.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-16">
            {/* Delivery */}
            <section className="space-y-8">
              <div className="inline-flex items-center space-x-4 border-b-4 border-slate-50 pb-4 pr-8">
                <MapPin size={20} className="text-brand" />
                <h3 className="font-black uppercase tracking-widest text-[11px] text-slate-400">Shipping Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 col-span-1 md:col-span-2 group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand transition-colors">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-50 px-8 py-5 rounded-2xl focus:outline-none focus:border-brand focus:bg-white transition-all font-bold text-slate-900"
                    placeholder="e.g. Alex River"
                  />
                </div>
                <div className="space-y-3 col-span-1 md:col-span-2 group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand transition-colors">Delivery Address</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-50 px-8 py-6 rounded-[2rem] focus:outline-none focus:border-brand focus:bg-white transition-all resize-none font-bold text-slate-900"
                    placeholder="123 Cozy Lane, Comfort City"
                  ></textarea>
                </div>
                <div className="space-y-3 group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand transition-colors">City</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-50 px-8 py-5 rounded-2xl focus:outline-none focus:border-brand focus:bg-white transition-all font-bold text-slate-900"
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-3 group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand transition-colors">Postal Code</label>
                  <input
                    required
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-50 px-8 py-5 rounded-2xl focus:outline-none focus:border-brand focus:bg-white transition-all font-bold text-slate-900"
                    placeholder="e.g. 10101"
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="space-y-10">
              <div className="inline-flex items-center space-x-4 border-b-4 border-slate-50 pb-4 pr-8">
                <CreditCard size={20} className="text-brand" />
                <h3 className="font-black uppercase tracking-widest text-[11px] text-slate-400">Payment Method</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { id: 'bank_transfer', name: 'Bank Transfer' },
                  { id: 'qris', name: 'QRIS Scan' },
                  { id: 'e_wallet', name: 'E-Wallet' },
                  { id: 'cod', name: 'Pay at Delivery' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    className={cn(
                      "p-8 rounded-[2rem] border-4 transition-all text-left space-y-2 relative group overflow-hidden",
                      formData.paymentMethod === method.id 
                        ? "border-brand bg-brand-light" 
                        : "border-slate-50 hover:border-slate-200 bg-slate-50"
                    )}
                  >
                    {formData.paymentMethod === method.id && (
                       <motion.div layoutId="activePayment" className="absolute top-0 right-0 p-6">
                          <div className="w-3 h-3 bg-brand rounded-full shadow-lg shadow-brand/30"></div>
                       </motion.div>
                    )}
                    <h4 className={cn("text-xl font-display font-black transition-colors", formData.paymentMethod === method.id ? "text-brand" : "text-slate-400 group-hover:text-slate-600")}>
                       {method.name}
                    </h4>
                    <p className={cn("text-[10px] uppercase font-black tracking-widest", formData.paymentMethod === method.id ? "text-brand/60" : "text-slate-300")}>
                      Secure & Fast
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-7 rounded-[1.5rem] font-black uppercase tracking-widest text-[12px] hover:bg-brand-dark transition-all shadow-2xl shadow-brand/30 flex items-center justify-center space-x-6 group disabled:bg-slate-200 disabled:shadow-none"
            >
              {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <span>Place Your Order</span>}
              {!loading && <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />}
            </button>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="w-full lg:w-[420px]">
           <div className="bg-white rounded-[3rem] p-10 md:p-12 space-y-10 sticky top-32 border-4 border-slate-50 shadow-2xl shadow-slate-100">
              <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight border-b-2 border-slate-50 pb-6 uppercase">Order Review</h3>
              <div className="space-y-8 max-h-[350px] overflow-y-auto pr-4 scrollbar-hide">
                 {items.map((item) => (
                   <div key={item.id} className="flex space-x-6 items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                         <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 space-y-1">
                         <h4 className="text-lg font-display font-black text-slate-900 tracking-tight leading-tight">{item.name}</h4>
                         <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{item.quantity} Unit(s)</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="space-y-6 pt-8 border-t-2 border-slate-50">
                 <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <span>Items Subtotal</span>
                    <span className="text-slate-900">{formatPrice(total)}</span>
                 </div>
                 <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                 </div>
                 <div className="flex justify-between items-center bg-brand p-8 rounded-[2rem] text-white shadow-xl shadow-brand/20">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/70">Total to Pay</span>
                    <span className="text-3xl font-display font-black">{formatPrice(total * 1.05)}</span>
                 </div>
                 <div className="flex items-center space-x-4 text-[10px] font-black tracking-widest uppercase text-slate-400 justify-center pt-4">
                    <Lock size={16} className="text-brand" />
                    <span>Secure Payment Enabled</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
