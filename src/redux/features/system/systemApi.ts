import { baseApi } from "../api/baseApi";

export const systemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => "/system/analytics",
      providesTags: ["System"],
    }),
    getLockdownStatus: builder.query({
      query: () => "/system/lockdown",
      providesTags: ["System"],
    }),
    enableLockdown: builder.mutation({
      query: () => ({
        url: "/system/lockdown/enable",
        method: "POST",
      }),
      invalidatesTags: ["System"],
    }),
    disableLockdown: builder.mutation({
      query: () => ({
        url: "/system/lockdown/disable",
        method: "POST",
      }),
      invalidatesTags: ["System"],
    }),
    getApiStats: builder.query({
      query: () => "/system/api-stats",
      providesTags: ["System"],
    }),
    getRaceResultsStats: builder.query({
      query: () => "/system/race-results-stats",
      providesTags: ["System", "Race"],
    }),
  }),
});

export const { 
  useGetDashboardAnalyticsQuery,
  useGetLockdownStatusQuery,
  useEnableLockdownMutation,
  useDisableLockdownMutation,
  useGetApiStatsQuery,
  useGetRaceResultsStatsQuery,
} = systemApi;
