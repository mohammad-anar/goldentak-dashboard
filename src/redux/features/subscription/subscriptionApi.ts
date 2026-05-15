import { baseApi } from "../api/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "/subscription/plans",
      providesTags: ["Subscription"],
    }),
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription", "User"],
    }),
    createPlan: builder.mutation({
      query: (data) => ({
        url: "/subscription/plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscription/plans/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const { 
  useGetPlansQuery, 
  useCreateSubscriptionMutation,
  useCreatePlanMutation,
  useUpdatePlanMutation
} = subscriptionApi;


