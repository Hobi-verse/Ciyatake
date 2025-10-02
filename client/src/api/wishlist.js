import { apiRequest, withApiFallback } from "./client";
import { getMockWishlist } from "./mockData";

export const fetchWishlist = async ({ signal } = {}) =>
  withApiFallback(
    () => apiRequest("/wishlist", { signal }),
    () => getMockWishlist()
  );

export const addWishlistItem = async (payload) =>
  withApiFallback(
    () =>
      apiRequest("/wishlist", {
        method: "POST",
        body: payload,
      }),
    () => Promise.resolve({ success: true })
  );

export const removeWishlistItem = async (itemId) =>
  withApiFallback(
    () =>
      apiRequest(`/wishlist/${itemId}`, {
        method: "DELETE",
      }),
    () => Promise.resolve({ success: true })
  );
