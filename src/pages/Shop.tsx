import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store/cartStore';
import { formatPrice, cn } from '../lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  description: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All Collection' },
  { id: 'living', name: 'Living Room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'dining', name: 'Dining' },
  { id: 'office', name: 'Office' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const { addItem } = useCartStore();

  // Sync state with URL params
  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'));
        
        if (activeCategory !== 'all') {
          q = query(q, where('category', '==', activeCategory));
        }

        if (sortBy === 'price-asc') {
          q = query(q, orderBy('price', 'asc'));
        } else if (sortBy === 'price-desc') {
          q = query(q, orderBy('price', 'desc'));
        } else {
          q = query(q, orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        
        // Filter by search locally for better UX in this demo
        const filteredData = data.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setProducts(filteredData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, sortBy, searchQuery]);

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 space-y-20">
      {/* Header */}
      <div className="space-y-6 text-center max-w-3xl mx-auto pb-12">
        <div className="flex items-center justify-center space-x-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <span className="text-slate-200">/</span>
          <span className="text-brand">Curated Drop</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-black text-slate-900 tracking-tight leading-none capitalize">The <span className="text-brand">Catalog.</span></h1>
        <p className="text-slate-500 font-medium text-lg">Fun, functional, and full of personality pieces for every room.</p>
      </div>

      {/* Toolbar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md py-6 border-y border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm rounded-2xl px-6">
        <div className="flex items-center space-x-6 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "whitespace-nowrap px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all",
                activeCategory === cat.id 
                  ? "bg-brand text-white shadow-lg shadow-brand/20" 
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={16} />
            <input
              type="text"
              placeholder="Find your vibe..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val) {
                  searchParams.set('q', val);
                } else {
                  searchParams.delete('q');
                }
                setSearchParams(searchParams);
              }}
              className="w-full bg-slate-50 border-2 border-slate-50 pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-brand focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="relative group">
            <button className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-brand transition-all shadow-xl">
              <span>Sort</span>
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full right-0 mt-4 bg-white border border-slate-100 shadow-2xl rounded-2xl py-3 w-56 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
              {[
                { id: 'newest', name: 'Latest Arrivals' },
                { id: 'price-asc', name: 'Price: Low-High' },
                { id: 'price-desc', name: 'Price: High-Low' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={cn(
                    "w-full text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wide transition-colors",
                    sortBy === option.id ? "text-brand bg-brand/5" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="space-y-6 animate-pulse">
              <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem]"></div>
              <div className="h-6 bg-slate-50 rounded-full w-2/3"></div>
              <div className="h-4 bg-slate-50 rounded-full w-1/3"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group p-4 bg-white hover:bg-slate-50 rounded-[3rem] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-100"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden relative mb-8">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                       <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addItem({ ...product, image: product.images[0] });
                          }}
                          className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-wider text-[11px] hover:bg-brand transition-all shadow-2xl"
                        >
                          Add to Box
                        </button>
                    </div>
                    {product.stock < 5 && (
                       <div className="absolute top-6 left-6 px-4 py-1.5 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                          Hot Item
                       </div>
                    )}
                  </div>
                </Link>
                <div className="flex justify-between items-start px-4 pb-4">
                  <div className="space-y-2">
                    <p className="text-[10px] text-brand font-black uppercase tracking-[0.2em]">{product.category}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-brand transition-colors">{product.name}</h3>
                    </Link>
                  </div>
                  <p className="font-display font-black text-xl text-slate-900">{formatPrice(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 text-center space-y-8 bg-slate-50 rounded-[3rem]">
          <div className="mx-auto w-24 h-24 bg-brand-light rounded-full flex items-center justify-center text-brand">
            <Search size={32} />
          </div>
          <div className="space-y-3 px-4">
            <h3 className="text-3xl font-display font-black text-slate-900">Oops! Nothing here.</h3>
            <p className="text-slate-500 font-medium">We couldn't find any pieces matching that search.</p>
          </div>
          <button 
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="px-8 py-4 bg-brand text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-xl shadow-brand/20 hover:scale-105 transition-all"
          >
            Show Everything
          </button>
        </div>
      )}
    </div>
  );
}
