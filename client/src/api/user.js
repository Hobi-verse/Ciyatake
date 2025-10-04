import { apiRequest, withApiFallback } from "./client";
import { getMockAccountSummary } from "./mockData";

export const fetchAccountSummary = async ({ signal } = {}) =>
  withApiFallback(
    () => apiRequest("/user/account/summary", { signal }),
    () => getMockAccountSummary()
  );

export const updateAccountPreferences = async (preferences) =>
  withApiFallback(
    () =>
      apiRequest("/user/account/preferences", {
        method: "PATCH",
        body: preferences,
      }),
    () =>
      Promise.resolve({
        success: true,
        preferences,
      }),
    { silenceWarnings: true }
  );
