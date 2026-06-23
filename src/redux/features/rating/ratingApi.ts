import { baseApi } from "../api/baseApi";

export const ratingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRatings: builder.query({
      query: () => "/rating",
      providesTags: ["Rating"],
    }),
  }),
});

export const { useGetRatingsQuery } = ratingApi;
