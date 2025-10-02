import { apiRequest, withApiFallback } from "./client";
import { getMockCart } from "./mockData";

export const fetchCart = async ({ signal } = {}) =>
  withApiFallback(
    () => apiRequest("/cart", { signal }),
    () => getMockCart()
  );

export const addCartItem = async (payload) =>
  withApiFallback(
    () =>
      apiRequest("/cart/items", {
        method: "POST",
        body: payload,
      }),
    () => Promise.resolve({ success: true })
  );

export const updateCartItem = async (itemId, payload) =>
  withApiFallback(
    () =>
      apiRequest(`/cart/items/${itemId}`, {
        method: "PATCH",
        body: payload,
      }),
    () => Promise.resolve({ success: true })
  );

export const removeCartItem = async (itemId) =>
  withApiFallback(
    () =>
      apiRequest(`/cart/items/${itemId}`, {
        method: "DELETE",
      }),
    () => Promise.resolve({ success: true })
  );
