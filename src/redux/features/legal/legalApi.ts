import { baseApi } from "../api/baseApi";

export const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalDocuments: builder.query({
      query: () => "/legal",
      providesTags: ["Legal"],
    }),
    getLegalByType: builder.query({
      query: (type) => `/legal/${type}`,
      providesTags: (result, error, type) => [{ type: "Legal", id: type }, "Legal"],
    }),
    createOrUpdateLegal: builder.mutation({
      query: (data) => ({
        url: "/legal",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { type }) => ["Legal", { type: "Legal", id: type }],
    }),
  }),
});

export const {
  useGetLegalDocumentsQuery,
  useGetLegalByTypeQuery,
  useCreateOrUpdateLegalMutation,
} = legalApi;
