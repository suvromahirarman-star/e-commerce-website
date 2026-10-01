import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  ChevronRight,
  ChevronDown,
  Check,
  Share2,
  Sparkles,
  MessageSquarePlus,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { formatPrice, formatDate } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { Badge, LoadingSkeleton } from '../../components/common';
import { ProductCard } from '../../components/product/ProductCard';
import { SizeGuideModal } from '../../components/product/SizeGuideModal';
import { ReviewModal } from '../../components/product/ReviewModal';

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [activeImage, setActiveImage] = useState(0);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Modals state
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Accordions
  const [openAccordions, setOpenAccordions] = useState({
    specs: true,
    shipping: false,
    care: false,
  });

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isCancelled = false;

    async function loadProductData() {
      setLoading(true);
      try {
        const prod = await productService.getProductBySlug(slug);
        if (prod && !isCancelled) {
          setProduct(prod);
          setActiveImage(0);
          setSelectedColor(prod.colors?.[0] || null);
          setSelectedSize(prod.sizes?.[0] || null);
          setQuantity(1);

          // Fetch related products
          const related = await productService.getRelatedProducts(prod.id, prod.categorySlug, 4);
          if (!isCancelled) setRelatedProducts(related);

          // Fetch reviews
          const prodReviews = await reviewService.getReviewsByProductId(prod.id);
          if (!isCancelled) setReviews(prodReviews);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadProductData();
    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <LoadingSkeleton className="h-6 w-48 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <LoadingSkeleton className="aspect-[3/4] w-full rounded-3xl" />
          <div className="space-y-6">
            <LoadingSkeleton className="h-10 w-3/4 rounded" />
            <LoadingSkeleton className="h-6 w-1/3 rounded" />
            <LoadingSkeleton className="h-24 w-full rounded" />
            <LoadingSkeleton className="h-14 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-3xl font-bold font-display text-neutral-900">
          Garment Not Found
        </h2>
        <p className="text-neutral-500">
          The requested atelier piece may have been retired or moved.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 rounded-full bg-neutral-950 hover:bg-[#FF6B2C] text-white text-xs font-mono font-semibold transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedColor?.name, selectedSize);
    showToast(`Added ${quantity} × "${product.name}" to your bag`, 'success');
    setTimeout(() => setIsAdding(false), 900);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor?.name, selectedSize);
    setIsCartOpen(true);
  };

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-neutral-900 transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            to={`/category/${product.categorySlug}`}
            className="hover:text-neutral-900 transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Grid (Left Gallery + Right Purchase Matrix) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Interactive Image Frame with Zoom */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-100 shadow-xl border border-neutral-200/80 group">
              <img
                src={product.images?.[activeImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out cursor-zoom-in"
              />

              {/* Badges Overlay */}
              <div className="absolute top-5 left-5 flex flex-col gap-2 z-10 pointer-events-none">
                {product.badge && (
                  <Badge variant="bestseller">{product.badge}</Badge>
                )}
                {discountPercent && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-rose-600 text-white shadow-xs">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product);
                  showToast(
                    inWishlist
                      ? `Removed "${product.name}" from wishlist`
                      : `Saved "${product.name}" to wishlist`,
                    inWishlist ? 'info' : 'success'
                  );
                }}
                className={`absolute top-5 right-5 p-3 rounded-full transition-all cursor-pointer shadow-md ${
                  inWishlist
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/90 text-neutral-700 hover:bg-white hover:text-neutral-950'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImage === idx
                        ? 'border-[#FF6B2C] ring-2 ring-[#FF6B2C]/20 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Spec & Purchase Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              {/* Brand & Stock */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-semibold">
                  {product.brand}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Only {product.stock || 8} pieces in atelier</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-neutral-300">•</span>
                <a
                  href="#customer-reviews"
                  className="text-neutral-500 hover:text-[#FF6B2C] underline cursor-pointer"
                >
                  {reviews.length || product.reviewCount || 14} Verified Reviews
                </a>
                <span className="text-neutral-300">•</span>
                <span className="text-neutral-400">SKU: {product.sku}</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-2 font-mono">
                <span className="text-3xl font-bold text-neutral-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-rose-600 text-white">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-500">Selected Finish:</span>
                  <span className="font-semibold text-neutral-950">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                        selectedColor?.name === c.name
                          ? 'border-neutral-950 scale-110 shadow-sm ring-2 ring-neutral-300'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedColor?.name === c.name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-500">Size:</span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[#FF6B2C] hover:text-[#E9571F] font-semibold cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-12 py-2.5 px-4 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                        selectedSize === s
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-[#FF6B2C]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-neutral-300 rounded-2xl overflow-hidden bg-white font-mono text-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3.5 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 font-bold text-neutral-950">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-3.5 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] hover:bg-[#FFE6D6] text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
              >
                Instant Guest Checkout (Direct to Cart)
              </button>
            </div>

            {/* Atelier Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200/80">
                <Truck className="w-4 h-4 text-[#FF6B2C] flex-shrink-0" />
                <span>Complimentary express delivery over ৳3,000</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200/80">
                <RotateCcw className="w-4 h-4 text-neutral-800 flex-shrink-0" />
                <span>14-day doorstep returns &amp; exchanges</span>
              </div>
            </div>

            {/* Collapsible Accordions (Specs, Shipping, Care) */}
            <div className="space-y-2 pt-2">
              {/* Specs */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion('specs')}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-xs text-neutral-900 cursor-pointer"
                >
                  <span>Atelier Specifications &amp; Tailoring</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.specs ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.specs && product.specifications && (
                  <div className="p-4 pt-0 border-t border-neutral-100 text-xs text-neutral-600 font-mono space-y-2">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-neutral-50">
                        <span className="text-neutral-400">{k}:</span>
                        <span className="text-neutral-900 font-medium text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-xs text-neutral-900 cursor-pointer"
                >
                  <span>Delivery &amp; Courier Policy</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.shipping ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.shipping && (
                  <div className="p-4 pt-0 border-t border-neutral-100 text-xs text-neutral-600 space-y-2 leading-relaxed">
                    <p>
                      Orders dispatched within 24 hours. Dhaka metro delivery takes 24–48 hours; all other divisions across Bangladesh receive delivery within 3–4 business days via insured express couriers.
                    </p>
                    <p>
                      Every garment is wrapped in recycled unbleached tissue paper and sealed in an archival waterproof presentation box.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="customer-reviews" className="pt-12 border-t border-neutral-200/90 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-semibold">
                Client Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
                Customer Reviews ({reviews.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 hover:bg-[#FF6B2C] text-white text-xs font-mono font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200 text-xs text-neutral-500">
              No reviews yet for this garment. Be the first patron to share your impressions!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {formatDate(rev.date)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-display text-neutral-900">
                      "{rev.title}"
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        {rev.author}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                        Verified Atelier Buyer
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* You May Also Like / Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t border-neutral-200/90 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-semibold">
                  Complementary Wardrobe
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
                  You May Also Like
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-mono font-semibold text-neutral-700 hover:text-[#FF6B2C] transition-colors"
              >
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Review Submission Modal */}
      <ReviewModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewAdded={(newRev) => setReviews((prev) => [newRev, ...prev])}
      />
    </div>
  );
}
export default ProductDetail;
