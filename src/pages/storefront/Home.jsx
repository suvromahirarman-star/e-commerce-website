import React, { useState, useEffect } from 'react';
import { HeroSection } from '../../components/home/HeroSection';
import { FeaturedCategories } from '../../components/home/FeaturedCategories';
import { BestsellersSection } from '../../components/home/BestsellersSection';
import { FlashSaleSection } from '../../components/home/FlashSaleSection';
import { CampaignBanner } from '../../components/home/CampaignBanner';
import { ProductShowcase } from '../../components/home/ProductShowcase';
import { WhyChooseUs } from '../../components/home/WhyChooseUs';
import { ReviewsSection } from '../../components/home/ReviewsSection';
import { SocialGallery } from '../../components/home/SocialGallery';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { productService } from '../../services/productService';

export function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadData() {
      try {
        const prods = await productService.getProducts();
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load products for Home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const heroProduct = products.find((p) => p.id === 'prod-01') || products[0];
  const flashSaleProducts = products.filter((p) => p.isFlashSale || p.originalPrice > p.price);
  const showcaseProduct = products.find((p) => p.id === 'prod-01') || products[0];

  return (
    <div className="relative">
      {/* 1. Asymmetric Editorial Hero Section */}
      <HeroSection heroProduct={heroProduct} />

      {/* 2. Curated Department Categories */}
      <FeaturedCategories />

      {/* 3. Bestsellers with Category Tabs */}
      <BestsellersSection products={products} onQuickView={handleOpenQuickView} />

      {/* 4. Live Ticking Flash Sale Event */}
      <FlashSaleSection flashProducts={flashSaleProducts} onQuickView={handleOpenQuickView} />

      {/* 5. Editorial Lookbook Campaign Banner */}
      <CampaignBanner />

      {/* 6. Deep Dive Signature Product Showcase */}
      <ProductShowcase showcaseProduct={showcaseProduct} />

      {/* 7. Why Choose Us (Pillars of Excellence) */}
      <WhyChooseUs />

      {/* 8. Patron Testimonials & Reviews */}
      <ReviewsSection />

      {/* 9. Visual Social Lookbook Gallery */}
      <SocialGallery />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  );
}
export default Home;
