import { baseApi } from "../api/baseApi";

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewsletters: builder.query({
      query: (params) => ({
        url: "/newsletter",
        params,
      }),
      providesTags: ["Newsletter"],
    }),
    createNewsletter: builder.mutation({
      query: (formData) => ({
        url: "/newsletter",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Newsletter"],
    }),
    updateNewsletter: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/newsletter/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Newsletter"],
    }),
    deleteNewsletter: builder.mutation({
      query: (id) => ({
        url: `/newsletter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Newsletter"],
    }),
  }),
});

export const {
  useGetNewslettersQuery,
  useCreateNewsletterMutation,
  useUpdateNewsletterMutation,
  useDeleteNewsletterMutation,
} = newsletterApi;
