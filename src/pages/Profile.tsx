import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, Heart, Settings, ChevronRight, User as UserIcon } from 'lucide-react';
import { formatDate, formatPrice, cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user, profile } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
      <div className="flex flex-col lg:row gap-24">
        {/* Sidebar */}
        <aside className="w-full lg:w-[380px] space-y-12">
          <div className="bg-[#050505] rounded-sm p-12 space-y-12 border border-stone-900 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="w-32 h-32 bg-stone-900 rounded-full flex items-center justify-center text-gold text-4xl font-display font-light italic border border-stone-800 shadow-[0_0_30px_rgba(197,160,89,0.1)]">
                {profile.fullName.charAt(0)}
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-display font-light text-white tracking-tight italic">{profile.fullName}</h2>
                <p className="text-[10px] text-stone-600 font-bold uppercase tracking-[0.5em]">{profile.role} membership</p>
              </div>
            </div>

            <nav className="space-y-4">
              <button className="w-full flex items-center justify-between p-6 rounded-sm bg-stone-900/50 text-gold font-bold text-[10px] uppercase tracking-[0.3em] border border-gold/20 shadow-[0_10px_30px_rgba(197,160,89,0.05)]">
                <div className="flex items-center space-x-4">
                  <Package size={16} />
                  <span>Acquisitions</span>
                </div>
                <ChevronRight size={14} />
              </button>
              <button className="w-full flex items-center justify-between p-6 rounded-sm text-stone-600 hover:bg-stone-900/50 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.3em] border border-transparent hover:border-stone-800">
                <div className="flex items-center space-x-4">
                  <Heart size={16} />
                  <span>Curations</span>
                </div>
                <ChevronRight size={14} />
              </button>
              <button className="w-full flex items-center justify-between p-6 rounded-sm text-stone-600 hover:bg-stone-900/50 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.3em] border border-transparent hover:border-stone-800">
                <div className="flex items-center space-x-4">
                  <Settings size={16} />
                  <span>Protocols</span>
                </div>
                <ChevronRight size={14} />
              </button>
              {profile.role === 'admin' && (
                <Link to="/admin" className="w-full flex items-center justify-between p-6 rounded-sm text-stone-600 hover:bg-stone-900/50 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.3em] border border-transparent hover:border-stone-800">
                  <div className="flex items-center space-x-4">
                    <UserIcon size={16} />
                    <span>Control Panel</span>
                  </div>
                  <ChevronRight size={14} />
                </Link>
              )}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full mt-12 flex items-center justify-center space-x-4 text-stone-700 hover:text-red-900 font-bold uppercase tracking-[0.4em] text-[9px] transition-colors pt-10 border-t border-stone-900"
            >
              <LogOut size={14} />
              <span>Relinquish Session</span>
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-20">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-display font-light text-white tracking-tighter italic leading-none">Archives.</h1>
            <p className="text-stone-500 font-light italic text-xl">Chronicles of your acquisitions and interactions.</p>
          </div>

          {loading ? (
             <div className="space-y-10">
               {[1,2,3].map(i => <div key={i} className="h-40 bg-stone-950 border border-stone-900 rounded-sm animate-pulse"></div>)}
             </div>
          ) : orders.length > 0 ? (
            <div className="space-y-10">
              {orders.map((order) => (
                <div key={order.id} className="bg-stone-950 border border-stone-900 rounded-sm p-10 hover:border-gold/30 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl -mr-12 -mt-12 group-hover:bg-gold/10 transition-colors"></div>
                  <div className="flex flex-col md:row items-center justify-between gap-10">
                    <div className="flex items-center space-x-8">
                      <div className="w-24 h-24 bg-stone-900 rounded-sm flex items-center justify-center text-stone-700 border border-stone-800/50">
                        <Package size={32} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-5">
                           <h3 className="font-serif text-2xl text-white italic tracking-tight">Archive #{order.id.slice(-6).toUpperCase()}</h3>
                           <span className={cn(
                             "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] border",
                             order.status === 'delivered' ? "border-gold/30 text-gold bg-gold/5" : "border-stone-800 text-stone-600 bg-stone-900/50"
                           )}>
                             {order.status}
                           </span>
                        </div>
                        <p className="text-[10px] text-stone-600 font-bold uppercase tracking-[0.3em]">Vaulted on {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-16">
                       <div className="text-center md:text-right space-y-2">
                          <p className="text-[9px] text-stone-700 font-bold uppercase tracking-[0.4em]">Investment</p>
                          <p className="font-serif text-3xl text-stone-200 italic">{formatPrice(order.totalAmount)}</p>
                       </div>
                       <Link
                         to={`/track/${order.id}`}
                         className="bg-stone-900 text-stone-400 p-5 rounded-full hover:bg-gold hover:text-black transition-all flex items-center justify-center shadow-sm"
                       >
                         <ChevronRight size={20} />
                       </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#050505] border border-stone-900 rounded-sm py-32 text-center space-y-8">
              <Package size={48} className="mx-auto text-stone-800 stroke-[1px]" />
              <div className="space-y-3">
                <h3 className="text-3xl font-display font-light text-white italic tracking-tight">The archives are void.</h3>
                <p className="text-stone-600 font-light italic">Your journey of curation is yet to begin.</p>
              </div>
              <Link to="/shop" className="inline-block mt-6 text-gold font-bold uppercase tracking-[0.4em] text-[10px] border-b border-gold/30 pb-2 hover:border-gold transition-all">Begin Curation</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
