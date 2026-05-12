import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { items } = useCartStore();
  const { user, profile } = useAuthStore();
  const location = useLocation();

  const cartCount = items.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-700">
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center px-4"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-4 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all"
            >
              <X size={32} />
            </button>
            <div className="w-full max-w-4xl space-y-12">
              <div className="space-y-4">
                <p className="text-brand font-black uppercase tracking-[0.3em] text-[12px] text-center">Inquire Repository</p>
                <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 text-center tracking-tight">Search Catalog.</h2>
              </div>
              <form onSubmit={handleSearch} className="relative group">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-4 border-slate-50 px-10 py-10 rounded-[3rem] text-3xl font-display font-black text-slate-900 placeholder:text-slate-200 focus:outline-none focus:border-brand focus:bg-white transition-all shadow-2xl shadow-slate-100"
                />
                <button 
                  type="submit"
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-brand text-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-brand/20"
                >
                  <ArrowRight size={32} />
                </button>
              </form>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 w-full text-center mb-2">Popular Searches</p>
                {['Living', 'Bedroom', 'Modern', 'Sale'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => {
                      navigate(`/shop?q=${tag}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-8 py-3 bg-slate-50 hover:bg-brand hover:text-white rounded-full text-[11px] font-black uppercase tracking-widest transition-all text-slate-500"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          isScrolled ? 'bg-white/80 backdrop-blur-md py-4 border-slate-100 shadow-sm' : 'bg-transparent py-6 border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link to="/" className="text-3xl font-display font-extrabold tracking-tight text-slate-900 group">
            VELOURA<span className="text-brand group-hover:rotate-12 inline-block transition-transform">!</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Link to="/" className="hover:text-brand hover:scale-105 transition-all">Home</Link>
            <Link to="/shop" className="hover:text-brand hover:scale-105 transition-all">Shop All</Link>
            <Link to="/shop?category=living" className="hover:text-brand hover:scale-105 transition-all">Living</Link>
            <Link to="/shop?category=bedroom" className="hover:text-brand hover:scale-105 transition-all">Bedroom</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 hover:bg-brand-light hover:text-brand rounded-xl transition-all hidden md:block text-slate-400"
            >
              <Search size={20} />
            </button>
            <Link to="/profile" className="p-2.5 hover:bg-brand-light hover:text-brand rounded-xl transition-all relative text-slate-400">
              <User size={20} />
              {user && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>}
            </Link>
            <Link to="/cart" className="p-2.5 hover:bg-brand-light hover:text-brand rounded-xl transition-all relative text-slate-400">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg shadow-brand/20">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2.5 hover:bg-brand-light hover:text-brand rounded-xl transition-all text-slate-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col space-y-6 text-3xl font-display font-bold text-slate-900">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop All</Link>
              <Link to="/shop?category=living">Living</Link>
              <Link to="/shop?category=bedroom">Bedroom</Link>
              <div className="pt-8 flex flex-col space-y-4">
                <Link to="/profile" className="text-xl text-slate-400">My Profile</Link>
                <Link to="/cart" className="text-xl text-slate-400">My Cart ({cartCount})</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 text-slate-600 pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-slate-200 pb-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900">VELOURA<span className="text-brand">!</span></h2>
            <p className="max-w-sm leading-relaxed text-slate-500">
              Bringing modern design and comfort to your home. We believe furniture should be fun, functional, and full of personality.
            </p>
            <div className="flex space-x-8 uppercase tracking-wider text-[11px] font-extrabold text-slate-400">
              <span className="hover:text-brand cursor-pointer transition-colors">Inquiries</span>
              <span className="hover:text-brand cursor-pointer transition-colors">Contact</span>
              <span className="hover:text-brand cursor-pointer transition-colors">About</span>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-extrabold uppercase tracking-widest text-[11px] text-brand">Shop</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/shop" className="hover:text-slate-900 transition-colors">All Furniture</Link></li>
              <li><Link to="/shop?category=living" className="hover:text-slate-900 transition-colors">Living Room</Link></li>
              <li><Link to="/shop?category=bedroom" className="hover:text-slate-900 transition-colors">Bedroom</Link></li>
              <li><Link to="/shop?category=dining" className="hover:text-slate-900 transition-colors">Dining Room</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-extrabold uppercase tracking-widest text-[11px] text-brand">Connect</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Pinterest</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <p>© 2026 Veloura Modern Home. Made with love.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
             <span className="hover:text-slate-600 transition-colors cursor-pointer">Privacy Policy</span>
             <span className="hover:text-slate-600 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
