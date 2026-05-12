import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Chrome, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register';
  
  const [isRegistering, setIsRegistering] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
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
      toast.error('Authentication failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          email,
          fullName,
          role: 'user',
          wishlist: [],
          createdAt: serverTimestamp(),
        });
        toast.success('Registration successful!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Sign in successful!');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left: Imagery */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden h-screen sticky top-0">
        <img
          src={isRegistering 
            ? "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1200" 
            : "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200"
          }
          alt="Premium Furniture"
          className="w-full h-full object-cover transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] flex flex-col justify-end p-20 text-white space-y-6">
          <motion.div
            key={isRegistering ? 'reg' : 'log'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-6xl font-display font-black tracking-tight leading-none">
              {isRegistering ? "Join the \ninner circle." : "The standard of \nmodern living."}
            </h2>
            <p className="text-white/80 max-w-sm font-medium leading-relaxed text-lg">
              {isRegistering 
                ? "Start your journey with thoughtfully curated pieces for your sanctuary." 
                : "Enter your space and resume building your dream home with Veloura."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-24 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-12"
        >
          {/* Form Header */}
          <div className="space-y-6">
            <div className="inline-flex bg-slate-50 p-2 rounded-2xl border-2 border-slate-50">
               <button 
                  onClick={() => setIsRegistering(false)}
                  className={cn(
                    "px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center space-x-3",
                    !isRegistering ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
                  )}
               >
                  <LogIn size={14} />
                  <span>Sign In</span>
               </button>
               <button 
                  onClick={() => setIsRegistering(true)}
                  className={cn(
                    "px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center space-x-3",
                    isRegistering ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
                  )}
               >
                  <UserPlus size={14} />
                  <span>Register</span>
               </button>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-slate-900 tracking-tight leading-none capitalize">
               {isRegistering ? "Get Started." : "Welcome Back."}
            </h1>
            <p className="text-slate-400 font-bold text-lg leading-relaxed">
               {isRegistering ? "Create your account and start your collection." : "Identify yourself to access your private archives."}
            </p>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="popLayout">
                {isRegistering && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 group"
                  >
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand transition-colors">Legal Identity</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 px-8 py-5 rounded-2xl focus:outline-none focus:border-brand focus:bg-white transition-all font-bold text-slate-900"
                      placeholder="e.g. Alex River"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 group">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand transition-colors">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:border-brand focus:bg-white transition-all font-bold text-slate-900"
                    placeholder="name@archivedomain.com"
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
                  {!isRegistering && <Link to="/forgot" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-brand transition-colors">Recovery?</Link>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 pl-16 pr-6 py-5 rounded-2xl focus:outline-none focus:border-brand focus:bg-white transition-all font-bold text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-[12px] hover:bg-brand-dark transition-all shadow-2xl shadow-brand/20 flex items-center justify-center space-x-4 disabled:bg-slate-100"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <span>{isRegistering ? 'Initialize Account' : 'Resume Session'}</span>}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-50"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-slate-300 bg-white px-6">Fast Track</div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full border-2 border-slate-50 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] text-slate-400 hover:border-slate-200 hover:text-slate-900 transition-all flex items-center justify-center space-x-4 group"
            >
              <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-slate-400 font-bold uppercase tracking-wider">
            {isRegistering ? 'Already have an account?' : 'New here?'}
            {' '}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-black text-brand hover:underline underline-offset-4"
            >
              {isRegistering ? 'Sign In Now' : 'Join the Inner Circle'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
