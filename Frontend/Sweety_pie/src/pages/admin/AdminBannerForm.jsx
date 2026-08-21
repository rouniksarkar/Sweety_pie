import React, { useState } from "react";
import { createBanner } from "../../Routes/ServerBanner.js";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import { PlusCircle, Image as ImageIcon, Check, FileImage, Link as LinkIcon, Sparkles } from "lucide-react";

export default function AdminBannerForm() {
  const [auth] = useAuth();
  const token = auth?.token;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("link", link);
    if (image) formData.append("image", image);

    try {
      
      const res = await createBanner(formData, token);
      toast.success("Banner created successfully! 🎉");
      // Reset form
      setTitle("");
      setSubtitle("");
      setLink("");
      setImage(null);
      setImagePreview(null);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create banner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <AdminLayout
      title="Add Banner"
      subtitle="Upload and link new promotional slides for the store homepage"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form (2/3 width) */}
        <section className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <PlusCircle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Banner Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Banner Title
              </label>
              <input
                type="text"
                placeholder="e.g. Summer Health Special"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={submitting}
                className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Banner Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Save up to 40% off on all immunity boosters & supplements"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                disabled={submitting}
                className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
              />
            </div>

            {/* Redirect link destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Click Destination / URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. /product/supplement-name or /categories"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={submitting}
                  className="w-full border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium font-mono"
                />
              </div>
            </div>

            {/* Image Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Banner Background Image *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-indigo-400 transition-colors relative overflow-hidden group">
                {imagePreview ? (
                  <div className="text-center relative z-10 w-full h-full flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="Banner Preview"
                      className="h-32 w-auto object-cover rounded-xl shadow-sm mb-3"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
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
                        <span>Upload banner slide file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          required
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-400">Desktop banner size (1920x600 recommended)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action button */}
            <button
              id="btn-banner-submit"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span>Publish Slide</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Right Column: Live Mock Preview (1/3 width) */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-amber-50 p-2 rounded-xl text-amber-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Live Slide Mock</h2>
          </div>
          <p className="text-slate-400 text-xs mb-4">This simulates how the banner slide will be presented to storefront clients.</p>

          <div className="w-full bg-slate-950 rounded-2xl overflow-hidden shadow-md relative aspect-video flex flex-col justify-end p-4 text-white">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Live Slide Mock Preview"
                className="absolute inset-0 h-full w-full object-cover opacity-60 z-0"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-900/80 z-0 flex items-center justify-center border border-slate-800">
                <FileImage className="h-10 w-10 text-slate-700" />
              </div>
            )}

            <div className="relative z-10 space-y-1 text-left">
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase inline-block">
                Exclusive Deal
              </span>
              <h3 className="text-sm font-black truncate drop-shadow-md">
                {title || "Promo Title Placeholder"}
              </h3>
              <p className="text-[10px] text-slate-200 line-clamp-2 leading-relaxed opacity-90 drop-shadow">
                {subtitle || "This is a brief tagline description that acts as the slide's promotional narrative."}
              </p>
              {link && (
                <div className="pt-1.5">
                  <span className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer inline-flex items-center gap-1">
                    Shop Now &rarr;
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
