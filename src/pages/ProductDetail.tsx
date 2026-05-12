import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Share2, Star, Shield, Truck, RotateCcw, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice, cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'products', id));
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Product not found");
          navigate('/shop');
        }
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Images */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative group"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <button className="absolute top-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-2xl text-slate-400 hover:text-brand transition-colors shadow-lg">
               <Share2 size={20} />
            </button>
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300",
                  selectedImage === idx ? "border-brand scale-105" : "border-slate-50 opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
               <span className="px-5 py-2 bg-brand-light text-brand rounded-full">{product.category}</span>
               <div className="flex items-center text-slate-400 bg-slate-50 px-5 py-2 rounded-full">
                  <Star size={12} className="mr-2 fill-yellow-400 text-yellow-400" />
                  <span>4.9 Customer Rating</span>
               </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-4xl font-display font-black text-brand">{formatPrice(product.price)}</p>
          </div>

          <p className="text-slate-500 leading-relaxed text-xl font-medium">
            {product.description}
          </p>

          <div className="space-y-10 border-y-4 border-slate-50 py-12">
             <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Inventory Status</span>
                <span className={cn(
                  "text-[11px] font-black uppercase tracking-widest",
                  product.stock > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {product.stock > 0 ? `Ready to ship: ${product.stock} left` : 'Out of stock'}
                </span>
             </div>
             
             <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center bg-slate-50 rounded-2xl h-16 px-6 border-2 border-transparent focus-within:border-brand transition-all">
                   <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 text-slate-400 hover:text-brand transition-colors"
                   >
                      <Minus size={20} strokeWidth={3} />
                   </button>
                   <span className="w-12 text-center font-black text-xl text-slate-900">{quantity}</span>
                   <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="p-3 text-slate-400 hover:text-brand transition-colors"
                   >
                      <Plus size={20} strokeWidth={3} />
                   </button>
                </div>
                
                <button 
                  onClick={() => {
                    for(let i=0; i<quantity; i++) addItem({ ...product, image: product.images[0] });
                    toast.success(`Cool! Added ${quantity} to your box`);
                  }}
                  disabled={product.stock === 0}
                  className="flex-1 w-full bg-brand text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-brand-dark transition-all flex items-center justify-center space-x-4 shadow-2xl shadow-brand/30 disabled:bg-slate-300 disabled:shadow-none"
                >
                   <ShoppingCart size={20} />
                   <span>Add to My Box</span>
                </button>
                
                <button className="h-16 w-16 bg-slate-50 border-2 border-slate-50 rounded-2xl flex items-center justify-center hover:text-red-500 transition-all text-slate-400 group">
                   <Heart size={22} className="group-hover:fill-red-500 group-hover:text-red-500" />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
             <div className="flex items-center space-x-6 p-6 bg-slate-50 rounded-3xl">
                <div className="w-12 h-12 bg-white flex items-center justify-center text-brand rounded-xl shadow-sm">
                   <Truck size={20} />
                </div>
                <div className="space-y-1">
                   <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Free Shipping</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Logistics</p>
                </div>
             </div>
             <div className="flex items-center space-x-6 p-6 bg-slate-50 rounded-3xl">
                <div className="w-12 h-12 bg-white flex items-center justify-center text-brand rounded-xl shadow-sm">
                   <RotateCcw size={20} />
                </div>
                <div className="space-y-1">
                   <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Love it or Swap</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">30-Day Guarantee</p>
                </div>
             </div>
          </div>

          <div className="bg-brand rounded-[2.5rem] p-10 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-brand/20">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <div className="flex items-center space-x-4">
                <Shield size={22} />
                <span className="text-[11px] font-black uppercase tracking-widest">Built for Real Life</span>
             </div>
             <p className="text-base text-white/90 leading-relaxed font-bold">
               Every piece is rigorously tested for durability and comfort. We believe your home should handle everything life throws at it.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
