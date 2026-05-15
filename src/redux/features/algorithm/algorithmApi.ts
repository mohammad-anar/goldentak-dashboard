import { baseApi } from "../api/baseApi";

export const algorithmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlgorithmSettings: builder.query({
      query: () => "/system/algorithm",
      providesTags: ["Algorithm"],
    }),
    updateAlgorithmSettings: builder.mutation({
      query: (data) => ({
        url: "/system/algorithm",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Algorithm"],
    }),
    syncRaces: builder.mutation({
      query: () => ({
        url: "/system/sync",
        method: "POST",
      }),
      invalidatesTags: ["Race", "Sync"],
    }),
  }),
});

export const { 
  useGetAlgorithmSettingsQuery, 
  useUpdateAlgorithmSettingsMutation,
  useSyncRacesMutation
} = algorithmApi;
