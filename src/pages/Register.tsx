import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, { displayName: fullName });

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        fullName,
        role: 'user',
        wishlist: [],
        createdAt: serverTimestamp(),
      });

      toast.success('Registration successful! Welcome to Veloura.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col lg:row">
      {/* imagery hidden on mobile */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"
          alt="Premium Furniture"
          className="w-full h-full object-cover scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex flex-col justify-end p-20 text-white space-y-6">
          <h2 className="text-5xl font-bold tracking-tighter leading-none">Crafted for life. <br />Designed for you.</h2>
          <p className="text-stone-200 max-w-sm font-light leading-relaxed">
            Create an account to track your orders, save your wishlist, and receive early access to new collections.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-24 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-16"
        >
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-display font-light text-white tracking-tighter italic leading-none">The Circle.</h1>
            <p className="text-stone-500 font-light italic leading-relaxed">Join our inner circle to experience priority access and bespoke services.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-600 ml-1">Legal Identity</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-700 group-focus-within:text-gold transition-colors" size={16} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-900/30 border border-stone-900 pl-16 pr-6 py-5 rounded-full focus:outline-none focus:border-gold/50 transition-all text-sm font-light italic text-stone-200"
                    placeholder="Enter your full legal name"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-600 ml-1">Archive Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-700 group-focus-within:text-gold transition-colors" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-900/30 border border-stone-900 pl-16 pr-6 py-5 rounded-full focus:outline-none focus:border-gold/50 transition-all text-sm font-light italic text-stone-200"
                    placeholder="name@archivedomain.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-600 ml-1">Seal Key</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-700 group-focus-within:text-gold transition-colors" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-900/30 border border-stone-900 pl-16 pr-6 py-5 rounded-full focus:outline-none focus:border-gold/50 transition-all text-sm font-light italic text-stone-200"
                    placeholder="Establish a secure seal"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-black py-6 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-[0_20px_40px_rgba(197,160,89,0.1)] flex items-center justify-center space-x-4 disabled:opacity-50"
              >
                {loading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <span>Complete Induction</span>}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-stone-600 font-light italic">
            Already in the circle?{' '}
            <Link to="/login" className="font-bold text-gold hover:text-white transition-colors underline underline-offset-4 decoration-gold/30">Identify</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
