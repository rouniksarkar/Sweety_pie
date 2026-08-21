import React, { useEffect, useState } from "react";
import { getBanners, deleteBanner } from "../../Routes/ServerBanner.js";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import { Trash2, Link as LinkIcon, Image as ImageIcon, Sparkles } from "lucide-react";

export default function AdminBannerList() {
  const [auth] = useAuth();
  const token = auth?.token;

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getBanners();
      setBanners(res.data.banner || []);
    } catch (err) {
      console.error("❌ Failed to fetch banners:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id, token);
        toast.success("Banner deleted successfully! 🗑️");
        fetchBanners();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete banner. Try again.");
      }
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <AdminLayout
      title="Banners List"
      subtitle="Preview and manage homepage promotional slider advertisements"
      onRefresh={fetchBanners}
      refreshLoading={loading}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-500 font-medium">Fetching banners...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Active Banners ({banners.length})</h2>
          </div>

          {banners.length === 0 ? (
            <div className="bg-white border border-slate-100 p-16 rounded-2xl shadow-sm text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
              <ImageIcon className="h-10 w-10 text-slate-300" />
              <span>No banners configured. Add a banner using the banner form!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300"
                >
                  {/* Banner Image Container */}
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative border-b border-slate-100 flex items-center justify-center">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-slate-300" />
                    )}
                    <span className="absolute top-3 left-3 bg-indigo-600/90 text-white backdrop-blur-sm px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-widest uppercase">
                      PROMO SLIDE
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors">
                        {banner.title || "Untitled slide"}
                      </h3>
                      {banner.subtitle && (
                        <p className="text-xs text-slate-400 font-medium line-clamp-2">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Meta info & Action */}
                    <div className="space-y-3 pt-2">
                      {banner.link && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                          <LinkIcon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate block font-mono text-[10px]">{banner.link}</span>
                        </div>
                      )}

                      <button
                        id={`btn-delete-banner-${banner._id}`}
                        onClick={() => handleDelete(banner._id)}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Banner</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
