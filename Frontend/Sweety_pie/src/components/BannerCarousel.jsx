import { useEffect, useState } from "react";
import { getBanners } from "../Routes/ServerBanner.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await getBanners();
        console.log("API Response:", res.data); // Debug log
        
        const bannerData = res.data?.banner || [];
        setBanners(bannerData);
        
        if (bannerData.length === 0) {
          console.warn("No banners found in response");
        }
      } catch (error) {
        console.error("Failed to load banners:", error);
        setError(error.message);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBanners();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] bg-slate-100 flex items-center justify-center rounded-2xl animate-pulse">
        <span className="text-slate-400 font-semibold">Loading banners...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] bg-red-50 border border-red-100 flex items-center justify-center rounded-2xl">
        <span className="text-red-500 font-medium">Failed to load banners: {error}</span>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] bg-slate-100 flex items-center justify-center rounded-2xl">
        <span className="text-slate-400 font-medium">No banners available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-2xl shadow-xl bg-slate-200">
      {/* Slide Container */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", banner.image);
                e.target.src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"; // Clean wellness fallback
              }}
            />
            {/* Legibility Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent z-10" />

            {/* Banner Text Content */}
            <div className="absolute inset-0 flex items-center z-20 px-8 sm:px-16 md:px-24">
              <div className="max-w-md md:max-w-xl text-left text-white space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-sm sm:text-lg md:text-xl text-slate-200/90 font-medium line-clamp-2 max-w-lg drop-shadow-sm">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link && (
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-1 sm:mt-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm md:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all duration-200"
                  >
                    Learn More
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/35 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 cursor-pointer active:scale-90"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/35 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 cursor-pointer active:scale-90"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex 
                  ? "bg-white w-6" 
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}