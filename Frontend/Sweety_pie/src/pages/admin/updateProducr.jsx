import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import {
  ShoppingBag,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  FileImage,
  DollarSign,
  Boxes,
  AlertTriangle
} from 'lucide-react';

const UpdateProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    discountType: '',
    discountValue: 0
  });

  // Load categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/v1/category/read-category');
      setCategories(res.data?.category || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Load product
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/product/single-product/${slug}`);
      const prod = res.data?.product;

      if (!prod) {
        console.error("No product found for slug:", slug);
        return;
      }

      setProduct(prod);
      setFormData({
        name: prod.name || '',
        description: prod.description || '',
        price: prod.price || '',
        stock: prod.stock || '',
        category: prod.category?._id || '',
        discountType: prod.discountType || '',
        discountValue: prod.discountValue || 0
      });
      if (prod.productImage) {
        setImagePreview(prod.productImage);
      }
    } catch (err) {
      console.error('Error loading product', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(product?.productImage || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("price", formData.price);
      productData.append("stock", formData.stock);
      productData.append("category", formData.category);
      productData.append("discountType", formData.discountType);
      productData.append("discountValue", formData.discountValue);
      if (imageFile) {
        productData.append("image", imageFile);
      }

      const config = {
        headers: {
          Authorization: auth?.token,
        },
        withCredentials: true,
      };

      await axios.put(`/api/v1/product/update-product/${product._id}`, productData, config);
      toast.success("Product updated successfully! 🎉");
      navigate('/admin/product');
    } catch (err) {
      console.error('❌ Error: Error in product update', err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Update Product"
      subtitle="Modify name, descriptions, inventory metrics, prices, and imagery"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-500 font-medium">Fetching product data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Details (2/3 width) */}
          <section className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Product Details</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/product')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Catalog</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product title"
                  required
                  disabled={submitting}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product specs, features, details..."
                  required
                  disabled={submitting}
                  rows="4"
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                    min="0"
                    disabled={submitting}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium font-mono"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Stock count *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock count"
                    required
                    min="0"
                    disabled={submitting}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Replace Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={submitting}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* Discounts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium bg-white"
                  >
                    <option value="">No Discount</option>
                    <option value="percentage">Percentage %</option>
                    <option value="flatOff">Flat Off</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    disabled={submitting}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                id="btn-update-product-submit"
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Save className="h-4.5 w-4.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Right Column: Visual Preview Card (1/3 width) */}
          <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-indigo-500" />
              Live Card Preview
            </h3>

            {/* Product Card simulation */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col bg-white">
              <div className="h-48 w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileImage className="h-10 w-10 text-slate-300" />
                )}
                {formData.discountType && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-sm">
                    Sale
                  </span>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {categories.find(c => c._id === formData.category)?.name || "Category Preview"}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug truncate">
                    {formData.name || "Product Name Placeholder"}
                  </h4>
                </div>

                <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                  {formData.description || "The product descriptions detail spec features and size values to consumers."}
                </p>

                <div className="flex justify-between items-end pt-2 border-t border-slate-50">
                  <div>
                    <span className="text-[9px] text-slate-400 font-semibold block uppercase tracking-wider">Price</span>
                    <div className="flex items-baseline gap-1.5">
                      {formData.discountType ? (
                        <>
                          <span className="text-xs line-through text-slate-400 font-medium">₹{formData.price}</span>
                          <span className="text-sm font-bold text-emerald-600 font-mono">
                            ₹
                            {formData.discountType === "percentage"
                              ? Math.max(0, formData.price - (formData.price * formData.discountValue) / 100)
                              : Math.max(0, formData.price - formData.discountValue)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-slate-800 font-mono">₹{formData.price || 0}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 font-semibold block uppercase tracking-wider text-right">Inventory</span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      formData.stock == 0
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : formData.stock < 10
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                      {formData.stock == 0 ? "Out of Stock" : `In Stock: ${formData.stock}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
};

export default UpdateProduct;
