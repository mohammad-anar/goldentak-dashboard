import { baseApi } from "../api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: "/auth/users",
        params,
      }),
      providesTags: ["User"],
    }),
    getCurrentLoginUsers: builder.query({
      query: (params) => ({
        url: "/auth/current-login-users",
        params,
      }),
      providesTags: ["User"],
    }),
    getStats: builder.query({
      query: () => "/auth/stats",
      providesTags: ["User"],
    }),
    updateSubscription: builder.mutation({
      query: (data) => ({
        url: "/auth/users/update-subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => `/auth/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetCurrentLoginUsersQuery,
  useGetStatsQuery,
  useUpdateSubscriptionMutation,
  useGetUserByIdQuery
} = userApi;

