import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import { FolderKanban, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const Category = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/read-category');
      if (data.success) {
        setCategories(data.category);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    const config = {
      headers: {
        Authorization: `Bearer ${auth?.token}`
      },
      withCredentials: true
    };

    if (editMode && selectedCategory) {
      // Update category
      try {
        const { data } = await axios.put(
          `/api/v1/category/update-category/${selectedCategory._id}`,
          { name },
          config
        );
        if (data.success) {
          resetForm();
          getAllCategories();
        } else {
          alert(data.message || 'Update failed');
        }
      } catch (err) {
        console.error(err);
        alert('Error updating category');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Create category
      try {
        const { data } = await axios.post(
          '/api/v1/category/create-category',
          { name },
          config
        );
        if (data.success) {
          setName('');
          getAllCategories();
        } else {
          alert(data.message || 'Creation failed');
        }
      } catch (err) {
        console.error(err);
        alert('Error creating category');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${id}`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`
        },
        withCredentials: true
      });
      if (data.success) {
        getAllCategories();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting category');
    }
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setEditMode(false);
    setSelectedCategory(null);
  };

  return (
    <AdminLayout
      title="Categories"
      subtitle="Manage product groups, taxonomy, and store organization"
      onRefresh={getAllCategories}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel (1/3 size) */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <FolderKanban className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {editMode ? 'Edit Category' : 'Create Category'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="category-name-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Category Name
              </label>
              <input
                id="category-name-input"
                type="text"
                className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400 font-medium"
                placeholder="e.g. Tablets, Wellness, Skincare"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                id="btn-category-submit"
                type="submit"
                disabled={submitting}
                className="flex-grow flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {editMode ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Update</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Add Category</span>
                  </>
                )}
              </button>

              {editMode && (
                <button
                  id="btn-category-cancel"
                  type="button"
                  onClick={resetForm}
                  className="flex items-center justify-center p-2.5 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Categories Table (2/3 size) */}
        <section className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">All Categories</h2>
            <p className="text-slate-400 text-xs mt-0.5">Total active categories: {categories.length}</p>
          </div>

          <div className="overflow-x-auto">
            {categories.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                No categories found. Create a category to get started.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-100">
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">slug / ID</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {categories.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                            <FolderKanban className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-slate-800">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {c.slug || c._id}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            id={`btn-edit-cat-${c._id}`}
                            onClick={() => {
                              setName(c.name);
                              setSelectedCategory(c);
                              setEditMode(true);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent rounded-lg transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            id={`btn-delete-cat-${c._id}`}
                            onClick={() => handleDelete(c._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent rounded-lg transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default Category;
