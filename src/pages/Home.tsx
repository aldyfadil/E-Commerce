import { motion } from 'motion/react';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatPrice, cn } from '../lib/utils';

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Minimalist Velvet Sofa',
    price: 12500000,
    category: 'Living Room',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    stock: 5,
  },
  {
    id: '2',
    name: 'Scandinavian Dining Chair',
    price: 1850000,
    category: 'Dining',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
    stock: 12,
  },
  {
    id: '3',
    name: 'Walnut Bed Frame',
    price: 8900000,
    category: 'Bedroom',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
    stock: 3,
  },
  {
    id: '4',
    name: 'Marble Coffee Table',
    price: 4200000,
    category: 'Living Room',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
    stock: 8,
  }
];

export default function Home() {
  const { addItem } = useCartStore();

  return (
    <div className="space-y-24 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-brand-light -mt-20 overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 py-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10 relative z-10"
          >
            <div className="inline-block px-4 py-1.5 bg-brand text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand/20">
              New Collection 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-extrabold text-slate-900 tracking-tight leading-[0.9]">
              Live <br />
              <span className="text-brand">Louder.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
              Design isn't just about furniture—it's about the energy of your space. Discover pieces that pop, comfort that lasts, and style that speaks for itself.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link
                to="/shop"
                className="group px-10 py-5 bg-brand text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand/40 hover:scale-105 transition-all flex items-center space-x-4"
              >
                <span>Shop the Pulse</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
                The Lookbook
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-[120px] opacity-60"></div>
            <div className="relative aspect-square md:aspect-[4/5] bg-brand/10 rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000"
                alt="Modern Interior"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Playful Floating Elements */}
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full flex items-center justify-center p-8 text-center text-[10px] font-black uppercase tracking-wider text-black shadow-xl"
            >
               Best Seller 2026
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories / Grid Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'The Lounge', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600', color: 'bg-brand' },
             { title: 'The Suite', image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=600', color: 'bg-orange-400' },
             { title: 'The Dining', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600', color: 'bg-purple-500' },
           ].map((cat, i) => (
             <motion.div
               key={i}
               whileHover={{ y: -10 }}
               className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl"
             >
               <img src={cat.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
               <div className="absolute bottom-10 left-10 space-y-4">
                 <h3 className="text-3xl font-display font-black text-white">{cat.title}</h3>
                 <div className={cn("inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-wider text-white", cat.color)}>
                   Explore +
                 </div>
               </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-brand-light pb-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight">The Weekly <span className="text-brand">Drop.</span></h2>
            <p className="text-slate-500 font-medium">Hand-picked designs that are trending right now.</p>
          </div>
          <Link to="/shop" className="px-6 py-3 bg-brand-light text-brand rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-brand hover:text-white transition-all">
            See Everything
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_PRODUCTS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/product/${item.id}`}>
                <div className="aspect-[3/4] bg-slate-100 rounded-[2rem] overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-brand">
                        <Star size={18} fill="currentColor" />
                     </div>
                  </div>
                </div>
              </Link>
              <div className="mt-6 flex justify-between items-start px-2">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.category}</p>
                   <Link to={`/product/${item.id}`}>
                     <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand transition-colors">{item.name}</h3>
                   </Link>
                </div>
                <p className="text-brand font-black text-lg">{formatPrice(item.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modern Features */}
      <section className="bg-brand py-32 rounded-[4rem] mx-4 md:mx-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: <Truck size={24} />, title: 'Fast & Free', desc: 'Global shipping that doesn\'t keep you waiting.' },
            { icon: <ShieldCheck size={24} />, title: 'Real Quality', desc: 'Pieces built to survive your real life.' },
            { icon: <Star size={24} />, title: 'Curated Look', desc: 'Designs you won\'t find anywhere else.' },
            { icon: <Clock size={24} />, title: '24/7 Energy', desc: 'Styling advice whenever inspiration strikes.' },
          ].map((feature, i) => (
            <div key={i} className="space-y-6 text-center text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-2xl mx-auto border border-white/20">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-2xl font-bold">{feature.title}</h4>
                <p className="text-slate-100 text-sm font-medium leading-relaxed opacity-80">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Pop */}
      <section className="max-w-5xl mx-auto px-4 pt-12">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full -mr-32 -mt-32 blur-[100px] opacity-40"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full -ml-32 -mb-32 blur-[100px] opacity-40"></div>

           <div className="relative z-10 space-y-6">
             <h2 className="text-4xl md:text-7xl font-display font-extrabold text-white tracking-tight">Stay <span className="text-brand">Vibrant.</span></h2>
             <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto">
               Join our list for exclusive drops, design tips, and 10% off your first piece.
             </p>
           </div>
           
           <form className="relative z-10 flex flex-col md:flex-row items-center max-w-lg mx-auto gap-4">
             <input
               type="email"
               placeholder="Your cool email"
               className="w-full bg-white/10 border border-white/20 px-8 py-5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand transition-all font-bold"
             />
             <button className="w-full md:w-auto bg-brand text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-white hover:text-brand transition-all shadow-xl shadow-brand/20">
               Join
             </button>
           </form>
        </div>
      </section>
    </div>
  );
}
