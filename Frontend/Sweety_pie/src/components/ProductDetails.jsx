import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import RatingStars from "./RatingStars";

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

    const getProductPageData = async () => {
      try {
        const [relatedResponse, reviewsResponse] = await Promise.all([
          axios.get(`/api/v1/product/related-product/${product._id}/${product.category?._id}`),
          axios.get(`/api/v1/products/${product._id}/reviews`),
        ]);
        setRelatedProducts(relatedResponse.data?.products || []);
        setReviews(reviewsResponse.data || []);
      } catch (error) {
        console.error("Unable to load product reviews:", error);
      }
    };

    getProductPageData();
  }, [product?._id, product?.category?._id]);

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewError("");

    if (!auth?.token) {
      setReviewError("Please sign in to leave a review.");
      return;
    }
    if (!rating || !comment.trim()) {
      setReviewError("Choose a rating and add a comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(
        `/api/v1/products/${product._id}/reviews`,
        { rating, comment: comment.trim() },
        { headers: { Authorization: `Bearer ${auth.token}` }, withCredentials: true }
      );

      const [productResponse, reviewsResponse] = await Promise.all([
        axios.get(`/api/v1/product/single-product/${slug}`),
        axios.get(`/api/v1/products/${product._id}/reviews`),
      ]);
      setProduct(productResponse.data?.product || product);
      setReviews(reviewsResponse.data || []);
      setRating(0);
      setComment("");
    } catch (error) {
      setReviewError(error.response?.data?.message || "Unable to submit your review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) return <div className="p-6">Loading...</div>;

  const finalPrice = product.finalPrice ?? product.price;
  const hasDiscount = finalPrice < product.price;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <img src={product.productImage} alt={product.name} className="h-80 w-full rounded-xl object-cover shadow-sm" />

        <div>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <div className="mt-3">
            <RatingStars rating={product.averageRating} count={product.ratingsCount} size="text-xl" />
          </div>
          <p className="mt-4 text-slate-600">{product.description}</p>
          <div className="mt-5 font-semibold">
            {hasDiscount ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 line-through">₹{product.price}</span>
                <span className="text-xl text-green-600">₹{finalPrice}</span>
              </div>
            ) : <span className="text-xl">₹{product.price}</span>}
          </div>
          <button onClick={() => addToCart(product._id, 1)} className="mt-6 rounded-lg bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600">
            Add to Cart
          </button>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
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

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Similar products</h2>
        {relatedProducts.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <button key={item._id} onClick={() => navigate(`/product/${item.slug}`)} className="rounded-xl border border-slate-200 p-4 text-left shadow-sm transition hover:shadow-md">
                <img src={item.productImage} alt={item.name} className="h-40 w-full rounded-lg object-cover" />
                <h3 className="mt-3 text-lg font-bold text-slate-900">{item.name}</h3>
                <div className="mt-1"><RatingStars rating={item.averageRating} count={item.ratingsCount} /></div>
                <p className="mt-2 font-semibold">₹{item.finalPrice ?? item.price}</p>
              </button>
            ))}
          </div>
        ) : <p className="text-slate-500">No similar products found.</p>}
      </section>
    </div>
  );
};

export default ProductDetails;
