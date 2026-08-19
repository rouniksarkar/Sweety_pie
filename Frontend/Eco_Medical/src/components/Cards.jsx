import React from 'react';

const Cards = ({ title, image, price }) => {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 px-2">
      {/* Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center w-full">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xl">Image Here</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title || 'Product Name'}</h2>

        <div className="flex items-center justify-between">
          <span className="text-green-600 font-bold text-lg">
            ₹{price || '199'}
          </span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
