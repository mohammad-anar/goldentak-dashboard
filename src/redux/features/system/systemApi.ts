import { baseApi } from "../api/baseApi";

export const systemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => "/system/analytics",
      providesTags: ["System"],
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = systemApi;
