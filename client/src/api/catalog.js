import { apiRequest, withApiFallback } from "./client";
import { getMockProductDetail, getMockProducts } from "./mockData";

export const fetchProducts = async (filters = {}, { signal } = {}) =>
  withApiFallback(
    () =>
      apiRequest("/products", {
        method: "GET",
        query: filters,
        signal,
      }),
    () => getMockProducts()
  );

export const fetchProductById = async (productId, { signal } = {}) => {
  if (!productId) {
    throw new Error("fetchProductById requires a productId");
  }

  return withApiFallback(
    () => apiRequest(`/products/${productId}`, { signal }),
    () => getMockProductDetail(productId)
  );
};
