import { baseApi } from "../api/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionOverview: builder.query({
      query: () => "/subscription/overview",
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
  }),
});

export const { 
  useGetSubscriptionOverviewQuery,
  useCreateSubscriptionMutation,
} = subscriptionApi;
