import { baseApi } from "../api/baseApi";

export const languageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLanguageStats: builder.query({
      query: () => "/language/stats",
      providesTags: ["Language"],
    }),
    updateLanguage: builder.mutation({
      query: (data) => ({
        url: "/language",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Language", "User"],
    }),
  }),
});

export const {
  useGetLanguageStatsQuery,
  useUpdateLanguageMutation,
} = languageApi;
