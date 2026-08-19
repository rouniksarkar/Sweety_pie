import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  FileImage,
  DollarSign,
  Boxes
} from "lucide-react";

const Product = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    shipping: false,
    category: "",
    image: null,
    discountType: "",
    discountValue: 0
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/read-category");
      setCategories(data?.category || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data?.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllProducts();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit new product
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
      productData.append("shipping", formData.shipping);
      if (formData.image) {
        productData.append("image", formData.image);
      }
      productData.append("discountType", formData.discountType);
      productData.append("discountValue", formData.discountValue);

      const { data } = await axios.post("/api/v1/product/create-product", productData, {
        headers: {
          Authorization: auth?.token,
        },
        withCredentials: true,
      });

      if (data?.success) {
        alert("Product Created Successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          shipping: false,
          category: "",
          image: null,
          discountType: "",
          discountValue: 0
        });
        setImagePreview(null);
        getAllProducts();
      } else {
        alert("Failed to create product");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/v1/product/delete-product/${id}`, {
        headers: {
          Authorization: auth?.token,
        },
        withCredentials: true,
      });
      alert("Deleted successfully!");
      getAllProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product");
    }
  };

  const handleEdit = (slug) => {
    navigate(`/dashboard/admin/update-product/${slug}`);
  };

  return (
    <AdminLayout
      title="Products"
      subtitle="Manage your catalog, stock levels, and store inventory"
      onRefresh={getAllProducts}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Create Product (1/3 width) */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Create Product</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Product characteristics, details..."
                required
                rows="3"
                className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                  min="0"
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium font-mono"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock count"
                  required
                  min="0"
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
              </div>
            </div>

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

            {/* Discount configurations */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
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
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Image upload area */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-indigo-400 transition-colors relative overflow-hidden group">
                {imagePreview ? (
                  <div className="text-center relative z-10 w-full h-full flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-auto object-cover rounded-xl shadow-sm mb-3"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: null });
                        setImagePreview(null);
                      }}
                      className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Remove & Choose Another
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-10 w-10 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Toggle */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <input
                id="shipping-checkbox"
                type="checkbox"
                name="shipping"
                checked={formData.shipping}
                onChange={handleChange}
                className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label htmlFor="shipping-checkbox" className="text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer">
                Shipping Available
              </label>
            </div>

            {/* Submit */}
            <button
              id="btn-product-submit"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Right Table: Products List (2/3 width) */}
        <section className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">All Products</h2>
              <p className="text-slate-400 text-xs mt-0.5">Total active products: {products.length}</p>
            </div>

            <div className="overflow-x-auto">
              {products.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">No products found. Add some products!</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-100">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {products.map((p) => {
                      // stock level indicator
                      let stockBadge = "bg-emerald-50 text-emerald-700 border-emerald-100";
                      if (p.stock === 0) {
                        stockBadge = "bg-rose-50 text-rose-700 border-rose-100";
                      } else if (p.stock < 10) {
                        stockBadge = "bg-amber-50 text-amber-700 border-amber-100";
                      }

                      // Check discount prices
                      const finalPrice = p.finalPrice ?? p.price;
                      const hasDiscount = finalPrice < p.price;

                      return (
                        <tr key={p._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                {p.productImage ? (
                                  <img
                                    src={p.productImage}
                                    alt={p.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <FileImage className="h-5 w-5 text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-800 truncate max-w-xs">{p.name}</div>
                                <div className="text-slate-400 text-xs truncate max-w-xs">{p.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md text-xs font-semibold">
                              {p.category?.name || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-semibold">
                            {hasDiscount ? (
                              <div className="flex flex-col">
                                <span className="text-xs line-through text-slate-400">₹{p.price}</span>
                                <span className="text-emerald-600 font-bold">₹{finalPrice}</span>
                              </div>
                            ) : (
                              <span className="text-slate-800">₹{p.price}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${stockBadge}`}>
                              {p.stock === 0 ? "Out of Stock" : `Stock: ${p.stock}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                id={`btn-edit-prod-${p._id}`}
                                onClick={() => handleEdit(p.slug)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent rounded-lg transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                id={`btn-delete-prod-${p._id}`}
                                onClick={() => handleDelete(p._id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default Product;
