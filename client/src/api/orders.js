import { apiRequest, withApiFallback } from "./client";
import {
  getMockCheckoutSummary,
  getMockOrderConfirmation,
} from "./mockData";

export const fetchCheckoutSummary = async ({ signal } = {}) =>
  withApiFallback(
    () => apiRequest("/checkout/summary", { signal }),
    () => getMockCheckoutSummary()
  );

export const placeOrder = async (payload) =>
  withApiFallback(
    () =>
      apiRequest("/orders", {
        method: "POST",
        body: payload,
      }),
    () =>
      Promise.resolve({
        success: true,
        order: payload,
        message: "Order placed (mock)",
      })
  );

export const fetchOrderById = async (orderId) => {
  if (!orderId) {
    throw new Error("fetchOrderById requires an orderId");
  }

  return withApiFallback(
    () => apiRequest(`/orders/${orderId}`),
    () => getMockOrderConfirmation()
  );
};
