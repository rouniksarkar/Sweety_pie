import axios from "axios";

// Public
export const getBanners = async () => {
  return await axios.get(`/api/v1/banner/getBanner`);
};

// Admin only
export const createBanner = async (formData, token) => {
  return await axios.post(`/api/v1/banner/createBanner`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateBanner = async (id, formData, token) => {
  return await axios.put(`/api/v1/banner/updateBanner/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteBanner = async (id, token) => {
  return await axios.delete(`/api/v1/banner/deleteBanner/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
