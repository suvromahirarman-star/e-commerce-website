import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Image as ImageIcon,
  Star,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { mockCategories } from '../../data/mockCategories';
import { useToast } from '../../context/ToastContext';
import { LoadingSkeleton } from '../../components/common';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '24', '26', '28', '30', '38mm', '41mm', '45L'];

const SAMPLE_PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
];

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'AURA Atelier',
    category: "Men's Atelier",
    categorySlug: 'mens',
    price: 6500,
    originalPrice: 7800,
    stock: 15,
    sku: `AUR-ATL-${Math.floor(1000 + Math.random() * 9000)}`,
    badge: 'New',
    description: '',
    overview: '',
    images: [SAMPLE_PRESET_IMAGES[0]],
    colors: [
      { name: 'Camel Tan', hex: '#C29B7F' },
      { name: 'Obsidian Noir', hex: '#1C1C1E' },
    ],
    sizes: ['S', 'M', 'L'],
    specifications: {
      Material: '100% Australian Merino Wool (480gsm)',
      Origin: 'Porto, Portugal',
      Care: 'Dry clean only',
      Buttons: 'Natural Horn buttons',
    },
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    isFlashSale: false,
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#C45B32');

  useEffect(() => {
    if (isEditing) {
      async function loadProduct() {
        setLoading(true);
        try {
          const found = await productService.getProductById(id);
          if (found) {
            setFormData(found);
          } else {
            showToast('Product not found', 'error');
            navigate('/admin/products');
          }
        } catch (err) {
          showToast('Failed to load product', 'error');
        } finally {
          setLoading(false);
        }
      }
      loadProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const slug = e.target.value;
    const catObj = mockCategories.find((c) => c.slug === slug);
    setFormData((prev) => ({
      ...prev,
      categorySlug: slug,
      category: catObj ? catObj.name : slug,
    }));
  };

  // Image helpers
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData((prev) => {
      const copy = [...prev.images];
      const [chosen] = copy.splice(index, 1);
      return { ...prev, images: [chosen, ...copy] };
    });
  };

  // Color helpers
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), { name: newColorName.trim(), hex: newColorHex }],
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (idx) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  // Size toggle
  const toggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes?.includes(size);
      const nextSizes = exists
        ? prev.sizes.filter((s) => s !== size)
        : [...(prev.sizes || []), size];
      return { ...prev, sizes: nextSizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please provide a garment name', 'warning');
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      showToast('Please add at least one product image URL', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
      };

      if (isEditing) {
        await productService.updateProduct(id, payload);
        showToast(`Updated "${formData.name}" successfully!`, 'success');
      } else {
        await productService.createProduct(payload);
        showToast(`Published "${formData.name}" to atelier archive!`, 'success');
      }

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      showToast('Failed to save product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <LoadingSkeleton className="h-8 w-64 rounded" />
        <LoadingSkeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-editorial text-neutral-950">
              {isEditing ? `Edit: ${formData.name}` : 'Create New Atelier Product'}
            </h1>
            <p className="text-xs text-neutral-500 font-mono">
              SKU: {formData.sku} • Manage visual gallery, pricing &amp; specifications
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-[#C45B32] disabled:opacity-50 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <span>Saving Archive...</span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Multi-Image Uploader Studio */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold font-editorial text-neutral-950">
                Visual Photography Gallery
              </h2>
              <p className="text-xs text-neutral-500">
                Add high-resolution multi-angle photography. The first image will be the primary catalog thumbnail.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {formData.images?.length || 0} photos attached
            </span>
          </div>

          {/* Current Gallery Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {formData.images?.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-inner"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />

                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-neutral-950 text-white shadow-xs">
                    Primary Cover
                  </span>
                )}

                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="w-full py-1 text-[10px] font-mono font-semibold bg-white/90 text-neutral-900 rounded hover:bg-white"
                    >
                      Make Primary
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Image Input Bar */}
          <div className="flex gap-2 pt-2">
            <input
              type="url"
              placeholder="Paste public image URL (e.g. Unsplash or Cloudinary)..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              + Add Image URL
            </button>
          </div>

          {/* Quick presets for convenience */}
          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-neutral-400">
            <span>Or quick select preset samples:</span>
            {SAMPLE_PRESET_IMAGES.slice(0, 3).map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, images: [...prev.images, preset] }))}
                className="text-neutral-700 hover:text-[#C45B32] underline"
              >
                Sample 0{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Core Details & Department */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-editorial text-neutral-950 pb-3 border-b border-neutral-100">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Product Name *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Soren Oversized Wool Trench Coat"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Brand / Atelier Line
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Department Category
              </label>
              <select
                value={formData.categorySlug}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 bg-white"
              >
                {mockCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing, Inventory & Badges */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-editorial text-neutral-950 pb-3 border-b border-neutral-100">
            Commercial Pricing &amp; Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Current Price (৳ BDT) *
              </label>
              <input
                type="number"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Original Price (Strikethrough)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Storefront Badge
              </label>
              <select
                name="badge"
                value={formData.badge || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 bg-white"
              >
                <option value="">None</option>
                <option value="New">New Arrival</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Limited">Limited Edition</option>
                <option value="Flash Sale">Flash Sale</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                SKU Identifier
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Variants (Colors & Sizes) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-editorial text-neutral-950 pb-3 border-b border-neutral-100">
            Garment Variants (Colors &amp; Sizes)
          </h2>

          {/* Sizes Selection */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
              Available Sizes
            </span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((sz) => {
                const isSelected = formData.sizes?.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`min-w-10 py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors List */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
              Color Finishes
            </span>
            <div className="flex flex-wrap gap-3">
              {formData.colors?.map((col, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-mono"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-neutral-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Color inputs */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="text"
                placeholder="Color Name (e.g. Sage Olive)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-9 h-9 rounded-xl border border-neutral-200 cursor-pointer p-0.5 bg-white"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-xs font-mono font-semibold transition-colors"
              >
                + Add Color
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Descriptions & Specifications */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-editorial text-neutral-950 pb-3 border-b border-neutral-100">
            Copywriting &amp; Atelier Specifications
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Short Description (Catalog Summary)
              </label>
              <textarea
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Double-breasted trench coat tailored from double-faced Australian merino wool..."
                className="w-full p-3.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                Detailed Product Overview
              </label>
              <textarea
                rows={3}
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="An enduring outerwear staple reimagined with generous proportions..."
                className="w-full p-3.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default ProductForm;
