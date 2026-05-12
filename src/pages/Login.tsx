import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Ensure user document exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          fullName: user.displayName || 'Anonymous User',
          role: 'user',
          wishlist: [],
          createdAt: serverTimestamp(),
        });
      }
      
      toast.success('Welcome to Veloura!');
      navigate('/');
    } catch (error) {
      console.error('Google Login Error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Sign in successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col lg:row">
      {/* Left: Imagery */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200"
          alt="Premium Furniture"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex flex-col justify-end p-20 text-white space-y-6">
          <h2 className="text-5xl font-bold tracking-tighter leading-none">The standard of <br />modern living.</h2>
          <p className="text-stone-200 max-w-sm font-light leading-relaxed">
            Join the Veloura circle and experience the intersection of design and comfort.
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
            <h1 className="text-5xl md:text-6xl font-display font-light text-white tracking-tighter italic leading-none">Identify Yourself.</h1>
            <p className="text-stone-500 font-light italic leading-relaxed">Enter your credentials to access the Veloura collection and your private archives.</p>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleEmailLogin} className="space-y-8">
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
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-600">Seal Key</label>
                  <Link to="/forgot" className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-700 hover:text-gold transition-colors italic">Recovery</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-700 group-focus-within:text-gold transition-colors" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-900/30 border border-stone-900 pl-16 pr-6 py-5 rounded-full focus:outline-none focus:border-gold/50 transition-all text-sm font-light italic text-stone-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-black py-6 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-[0_20px_40px_rgba(197,160,89,0.1)] flex items-center justify-center space-x-4 disabled:opacity-50"
              >
                {loading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <span>Enter Archive</span>}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-900"></div></div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-bold text-stone-800 bg-black px-6 italic">Alternative Access</div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full border border-stone-900 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] text-stone-500 hover:border-stone-700 hover:text-stone-300 transition-all flex items-center justify-center space-x-4"
            >
              <Chrome size={18} />
              <span>Identity Provider</span>
            </button>
          </div>

          <p className="text-center text-sm text-stone-600 font-light italic">
            First time in the circle?{' '}
            <Link to="/register" className="font-bold text-gold hover:text-white transition-colors underline underline-offset-4 decoration-gold/30">Join Us</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
