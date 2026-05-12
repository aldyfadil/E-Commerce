import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy, doc, updateDoc, writeBatch, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Plus, Edit2, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { formatPrice, formatDate, cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
          getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
        ]);

        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile, navigate]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Management Console...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 border-b-4 border-slate-50 pb-10">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-display font-black text-slate-900 tracking-tight capitalize">Design <span className="text-brand">Hub.</span></h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[11px]">Business Command Center</p>
        </div>
        <div className="flex flex-wrap gap-3 bg-slate-50 p-3 rounded-[2rem] border-2 border-slate-50 shadow-inner">
          {[
            { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Metrics' },
            { id: 'products', icon: <Package size={18} />, label: 'Catalog' },
            { id: 'orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
            { id: 'users', icon: <Users size={18} />, label: 'Users' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-3 px-6 py-4 rounded-[1.5rem] transition-all text-[11px] font-black uppercase tracking-widest",
                activeTab === tab.id ? "bg-white text-brand shadow-xl" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab.icon}
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-16">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: <DollarSign size={22} />, color: 'bg-brand text-white' },
                { label: 'Orders Handled', value: orders.length, icon: <ShoppingCart size={22} />, color: 'bg-green-500 text-white' },
                { label: 'catalog items', value: products.length, icon: <Package size={22} />, color: 'bg-orange-500 text-white' },
                { label: 'Happy Customers', value: users.length, icon: <Users size={22} />, color: 'bg-purple-500 text-white' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border-4 border-slate-50 p-10 rounded-[3rem] shadow-2xl shadow-slate-100 flex flex-col justify-between space-y-8 hover:border-brand/20 transition-all group">
                   <div className={cn("w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-lg", stat.color)}>
                      {stat.icon}
                   </div>
                   <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                      <h4 className="text-4xl font-display font-black text-slate-900 tracking-tight">{stat.value}</h4>
                   </div>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 bg-white border-4 border-slate-50 rounded-[3rem] p-12 space-y-10 shadow-2xl shadow-slate-100">
                 <div className="flex items-center justify-between border-b-2 border-slate-50 pb-8">
                    <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Recent Activity</h3>
                    <TrendingUp size={22} className="text-brand" />
                 </div>
                 <div className="space-y-6">
                    {orders.slice(0, 6).map(o => (
                      <div key={o.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-3xl transition-colors">
                         <div className="flex items-center space-x-6">
                            <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center text-brand font-black text-sm">
                               {o.id.slice(-2)}
                            </div>
                            <div className="space-y-1">
                               <p className="text-xl font-display font-black text-slate-900">{formatPrice(o.totalAmount)}</p>
                               <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{formatDate(o.createdAt)}</p>
                            </div>
                         </div>
                         <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">{o.status}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-brand rounded-[3rem] p-12 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-brand/20">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                 <h3 className="text-3xl font-display font-black tracking-tight relative z-10">Sales are <br/>looking good!</h3>
                 <div className="space-y-6 relative z-10">
                    <p className="text-white/80 font-bold leading-relaxed">You've reached <span className="text-white">85%</span> of this month's growth goal. Keep it up!</p>
                    <button className="w-full bg-white text-brand py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[12px] hover:scale-105 transition-all shadow-xl">
                       View Reports
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {(activeTab === 'products' || activeTab === 'orders') && (
        <div className="space-y-12">
           <div className="flex items-center justify-between px-6">
              <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">
                {activeTab === 'products' ? 'Product Catalog' : 'Active Orders'}
              </h2>
              {activeTab === 'products' && (
                <button className="bg-brand text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[12px] flex items-center space-x-4 hover:bg-brand-dark transition-all shadow-2xl shadow-brand/20">
                   <Plus size={20} strokeWidth={3} />
                   <span>Add New Piece</span>
                </button>
              )}
           </div>
           <div className="bg-white border-4 border-slate-50 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b-2 border-slate-100">
                      <tr className="text-[11px] uppercase tracking-widest font-black text-slate-400">
                         {activeTab === 'products' ? (
                            <>
                               <th className="px-12 py-8">Vibe</th>
                               <th className="px-12 py-8">Name</th>
                               <th className="px-12 py-8">Category</th>
                               <th className="px-12 py-8">Price</th>
                               <th className="px-12 py-8 text-right">Stock</th>
                               <th className="px-12 py-8 text-right">Settings</th>
                            </>
                         ) : (
                            <>
                               <th className="px-12 py-8">Order ID</th>
                               <th className="px-12 py-8">Customer</th>
                               <th className="px-12 py-8">Revenue</th>
                               <th className="px-12 py-8">Current State</th>
                               <th className="px-12 py-8 text-right">Actions</th>
                            </>
                         )}
                      </tr>
                   </thead>
                   <tbody className="divide-y-2 divide-slate-50">
                      {activeTab === 'products' ? products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-12 py-8">
                              <img src={p.images[0]} className="w-16 h-16 rounded-2xl object-cover transition-all border-4 border-white shadow-md" />
                           </td>
                           <td className="px-12 py-8 font-black text-lg text-slate-900">{p.name}</td>
                           <td className="px-12 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                              <span className="px-4 py-1.5 bg-slate-100 rounded-full">{p.category}</span>
                           </td>
                           <td className="px-12 py-8 font-display font-black text-brand">{formatPrice(p.price)}</td>
                           <td className="px-12 py-8 text-right font-black text-slate-900">{p.stock}</td>
                           <td className="px-12 py-8 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                 <button className="p-4 text-slate-400 hover:text-brand hover:bg-white hover:shadow-lg rounded-2xl transition-all"><Edit2 size={18} /></button>
                                 <button className="p-4 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-2xl transition-all"><Trash2 size={18} /></button>
                              </div>
                           </td>
                        </tr>
                      )) : orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-12 py-8 font-black text-slate-900 tracking-tight">#{o.id.slice(-8).toUpperCase()}</td>
                           <td className="px-12 py-8 text-sm font-bold text-slate-500">{o.shippingAddress.fullName}</td>
                           <td className="px-12 py-8 font-display font-black text-brand">{formatPrice(o.totalAmount)}</td>
                           <td className="px-12 py-8">
                              <span className={cn(
                                "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2",
                                o.status === 'delivered' ? "border-green-500 text-green-500 bg-green-50" : 
                                o.status === 'shipped' ? "border-blue-500 text-blue-500 bg-blue-50" :
                                "border-slate-200 text-slate-400 bg-slate-50"
                              )}>
                                {o.status}
                              </span>
                           </td>
                           <td className="px-12 py-8 text-right">
                              <select 
                                 className="text-[11px] font-black uppercase tracking-widest bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-3 outline-none text-slate-600 focus:border-brand transition-all cursor-pointer"
                                 value={o.status}
                                 onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                              >
                                 <option value="pending">Pending</option>
                                 <option value="paid">Processing</option>
                                 <option value="shipped">On Route</option>
                                 <option value="delivered">Completed</option>
                              </select>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
