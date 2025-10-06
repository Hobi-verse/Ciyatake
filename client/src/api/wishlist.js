import { apiRequest } from "./client";

export const fetchWishlist = async ({ signal } = {}) => {
  const payload = await apiRequest("/wishlist", { signal });
  const wishlist = payload?.data?.wishlist;

  return {
    ...(wishlist ?? {}),
    items: Array.isArray(wishlist?.items) ? wishlist.items : [],
  };
};

export const addWishlistItem = async (payload) =>
  apiRequest("/wishlist", {
    method: "POST",
    body: payload,
  });

export const removeWishlistItem = async (itemId) =>
  apiRequest(`/wishlist/${itemId}`, {
    method: "DELETE",
  });
