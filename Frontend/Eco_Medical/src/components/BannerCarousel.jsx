import { useEffect, useState } from "react";
import { getBanners } from "../Routes/ServerBanner.js";

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error("Error details:", error.response?.data);
        setError(error.message);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBanners();
  }, []);

  if (loading) {
    return <div className="banner-container">Loading banners...</div>;
  }

  if (error) {
    return <div className="banner-container">Error: {error}</div>;
  }

  return (
    <div className="banner-container">
      {banners.length > 0 ? (
        banners.map((banner) => (
          <div className="banner" key={banner._id}>
            <img
              src={banner.image}
              alt={banner.title}
              style={{ width: "100%", height: "auto" }}
              onError={(e) => {
                console.error("Image failed to load:", banner.image);
                e.target.src = "/placeholder-image.jpg"; // Fallback image
              }}
            />
            <div className="banner-text">
              <h2>{banner.title}</h2>
              {banner.subtitle && <p>{banner.subtitle}</p>}
              {banner.link && (
                <a href={banner.link} target="_blank" rel="noreferrer">
                  Learn More
                </a>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No banners available</p>
      )}
    </div>
  );
}