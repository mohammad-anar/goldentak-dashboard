import { baseApi } from "../api/baseApi";

export const raceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRaces: builder.query({
      query: (params) => ({
        url: "/race",
        params,
      }),
      providesTags: ["Race"],
    }),
    getRaceById: builder.query({
      query: (id) => `/race/${id}`,
      providesTags: (result, error, id) => [{ type: "Race", id }],
    }),
    calculateRaceScores: builder.mutation({
      query: (id) => `/race/${id}/calculate`,
      invalidatesTags: (result, error, id) => [{ type: "Race", id }, "Race"],
    }),
  }),
});

export const { 
  useGetRacesQuery, 
  useGetRaceByIdQuery, 
  useCalculateRaceScoresMutation 
} = raceApi;
