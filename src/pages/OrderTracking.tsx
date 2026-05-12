import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, ReceiptText, MapPin } from 'lucide-react';
import { formatPrice, formatDate, cn } from '../lib/utils';

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'orders', id), (doc) => {
      if (doc.exists()) {
        setOrder({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Tracking order...</div>;
  if (!order) return <div className="h-screen flex items-center justify-center">Order not found.</div>;

  const steps = [
    { id: 'pending', label: 'Order Placed', desc: 'We have received your order.', icon: <Clock size={20} /> },
    { id: 'paid', label: 'Payment Verified', desc: 'Your payment has been confirmed.', icon: <ReceiptText size={20} /> },
    { id: 'shipped', label: 'Shipped', desc: 'Your items are on the way.', icon: <Truck size={20} /> },
    { id: 'delivered', label: 'Delivered', desc: 'Enjoy your new furniture!', icon: <CheckCircle size={20} /> },
  ];

  const currentStepIdx = steps.findIndex(s => s.id === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 space-y-12">
      <div className="space-y-6">
        <Link to="/profile" className="inline-flex items-center space-x-3 text-slate-400 hover:text-brand transition-colors text-[11px] font-black uppercase tracking-wider">
          <ArrowLeft size={16} />
          <span>Back to My Profile</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-slate-50 pb-8">
          <h1 className="text-5xl md:text-6xl font-display font-black text-slate-900 tracking-tight">Track Order.</h1>
          <div className="flex items-center space-x-4">
             <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">ID: #{order.id.slice(-8).toUpperCase()}</p>
             <span className="px-5 py-2 bg-brand-light rounded-full text-[10px] font-black uppercase tracking-wider text-brand">
               {order.status}
             </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 md:p-16 space-y-20 border-2 border-slate-50 shadow-2xl shadow-slate-100 relative overflow-hidden">
        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-50 hidden md:block"></div>
          <div className="space-y-12 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.id} className="flex items-start gap-10 group">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 border-4",
                    isCompleted ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" : "bg-white border-slate-100 text-slate-300"
                  )}>
                    {step.icon}
                  </div>
                  <div className="space-y-1 pt-1">
                    <h3 className={cn("text-xl font-display font-black transition-colors", isCompleted ? "text-slate-900" : "text-slate-300")}>
                      {step.label}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">{step.desc}</p>
                    {isCurrent && (
                       <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-3 mt-4"
                       >
                          <div className="w-2 h-2 bg-brand rounded-full animate-ping"></div>
                          <span className="text-[10px] font-black text-brand uppercase tracking-widest">Currently Here</span>
                       </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t-4 border-slate-50">
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-3">
               <Package size={16} className="text-brand" />
               <span>Order Details</span>
            </h4>
            <div className="space-y-5">
               {order.items.map((item: any, i: number) => (
                 <div key={i} className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-600">{item.quantity} × {item.name}</span>
                    <span className="text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                 </div>
               ))}
               <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Charged</span>
                  <span className="text-3xl font-display font-black text-brand">{formatPrice(order.totalAmount)}</span>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-3">
               <MapPin size={16} className="text-brand" />
               <span>Shipping Info</span>
            </h4>
            <div className="bg-slate-50 p-10 rounded-[2rem] space-y-3">
               <p className="font-display text-xl text-slate-900 font-black">{order.shippingAddress.fullName}</p>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
               </p>
               <div className="pt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-200">
                  <span>Payment:</span>
                  <span className="text-slate-900">{order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
