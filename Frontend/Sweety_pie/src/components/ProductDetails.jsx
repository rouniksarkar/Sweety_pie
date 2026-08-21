import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import RatingStars from "./RatingStars";
import ProductCard from "./ProductCard";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      setProduct(null);
      try {
        const { data } = await axios.get(`/api/v1/product/single-product/${slug}`);
        setProduct(data?.product || null);
      } catch (error) {
        console.error("Unable to load product:", error);
      }
    };

    if (slug) getProduct();
  }, [slug]);

  useEffect(() => {
    if (!product?._id) return;
    const getRelatedProducts = async () => {
      try {
        const { data } = await axios.get(`/api/v1/product/related-product/${product._id}/${product.category?._id || product.category}`);
        setRelatedProducts(data?.products || []);
      } catch (error) {
        console.error("Unable to load related products:", error);
      }
    };
    const getReviews = async () => {
      try {
        const { data } = await axios.get(`/api/v1/products/${product._id}/reviews`);
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load reviews:", error);
      }
    };
    getRelatedProducts();
    getReviews();
  }, [product]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!auth?.token) {
      setReviewError("Please log in to submit a review.");
      return;
    }
    if (rating === 0) {
      setReviewError("Please choose a star rating.");
      return;
    }
    setReviewError("");
    setSubmittingReview(true);
    try {
      const { data } = await axios.post(
        `/api/v1/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      const { data: updatedReviews } = await axios.get(`/api/v1/products/${product._id}/reviews`);
      setReviews(Array.isArray(updatedReviews) ? updatedReviews : [data, ...reviews]);
      setRating(0);
      setComment("");
    } catch (error) {
      setReviewError(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
      </div>
    );
  }

  const finalPrice = product.finalPrice ?? product.price;
  const hasDiscount = finalPrice < product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Product Details Section */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative pt-[75%] md:pt-[100%] overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
          <img
            src={product.productImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between py-2">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{product.name}</h1>
            <div className="flex items-center gap-2">
              <RatingStars rating={product.averageRating} count={product.ratingsCount} />
              <span className="text-sm text-slate-500">({product.ratingsCount || 0} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-bold text-slate-900">₹{finalPrice}</span>
                  <span className="text-lg text-slate-400 line-through">₹{product.price}</span>
                  <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                    {product.discountType === "percentage" ? `${product.discountValue}% OFF` : `₹${product.discountValue} OFF`}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed pt-2">{product.description}</p>
          </div>

          <button
            onClick={() => addToCart(product._id, 1)}
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.99] transition-all duration-200"
          >
            Add to Cart
          </button>
        </div>
      </section>

      {/* Review Section */}
      <section className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 border-t border-slate-100 pt-12">
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">Customer reviews</h2>
            <span className="text-sm text-slate-500">{product.ratingsCount || 0} {product.ratingsCount === 1 ? "review" : "reviews"}</span>
          </div>

          <div className="mt-5 space-y-5">
            {reviews.length ? reviews.map((review) => (
              <article key={review._id} className="rounded-xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">{review.user?.username || "Verified customer"}</p>
                  <time className="text-sm text-slate-400" dateTime={review.createdAt}>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </time>
                </div>
                <RatingStars rating={review.rating} size="text-lg" />
                <p className="mt-3 whitespace-pre-wrap text-slate-600">{review.comment}</p>
              </article>
            )) : <p className="py-6 text-slate-500">No reviews yet. Be the first to share your experience.</p>}
          </div>
        </div>

        <form onSubmit={submitReview} className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-bold text-slate-900">Write a review</h2>
          <p className="mt-1 text-sm text-slate-500">Your rating helps other customers.</p>
          <div className="mt-4 flex gap-1" aria-label="Choose your rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} className="text-3xl text-amber-400" aria-label={`${value} stars`}>
                {value <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows="5" maxLength="1000" placeholder="Tell us what you think about this product" className="mt-4 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" />
          {reviewError && <p className="mt-2 text-sm text-red-600">{reviewError}</p>}
          <button type="submit" disabled={submittingReview} className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
            {submittingReview ? "Submitting..." : "Submit review"}
          </button>
        </form>
      </section>

      {/* Similar Products Section */}
      <section className="mt-16 border-t border-slate-100 pt-12">
        <h2 className="mb-8 text-2xl font-extrabold text-slate-900 tracking-tight">Similar products</h2>
        {relatedProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                onAddToCart={(product) => addToCart(product._id, 1)}
              />
            ))}
          </div>
        ) : <p className="text-slate-500">No similar products found.</p>}
      </section>
    </div>
  );
};

export default ProductDetails;
