import {Review} from "../models/review.model.js";
import { Product } from "../models/products.model.js";


async function updateProductRating(productId) {
  const reviews = await Review.find({ product: productId });
 
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      ratingsCount: 0,
    });
    return;
  }
 
  // add up all the ratings
  let sum = 0;
  for (let i = 0; i < reviews.length; i++) {
    sum += reviews[i].rating;
  }
 
  const average = sum / reviews.length;
 
  await Product.findByIdAndUpdate(productId, {
    averageRating: average.toFixed(1), // e.g. 4.3
    ratingsCount: reviews.length,
  });
}

async function getUserReviews(req,res){
    try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId })
      .populate('product', 'name price') // show which product each comment was about
      .sort('-createdAt'); // newest first
 
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createReview (req, res) {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
 
    const review = await Review.create({
      product: productId,
      user: req.user._id, 
      rating,
      comment,
    });
 
    await updateProductRating(productId);
 
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


async function getProductReviews (req,res){
    try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "username")
      .sort({ createdAt: -1 });
 
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getReview(req,res){
    try {
    const review = await Review.findById(req.params.id);
 
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
 
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateReview(req,res){
    try {
    const review = await Review.findById(req.params.id);
 
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
 
    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.comment) review.comment = req.body.comment;
 
    await review.save();
    await updateProductRating(review.product);
 
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteReview(req,res){
    try {
    const review = await Review.findById(req.params.id);
 
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
 
    await Review.findByIdAndDelete(req.params.id);
    await updateProductRating(review.product);
 
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {getProductReviews,getReview,createReview,updateReview,deleteReview, getUserReviews};
