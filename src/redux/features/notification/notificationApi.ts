import { baseApi } from "../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentNotifications: builder.query({
      query: () => "/notification/recent",
      providesTags: ["Notification"],
    }),
    getNotificationStats: builder.query({
      query: () => "/notification/stats",
      providesTags: ["Notification"],
    }),
    sendNotification: builder.mutation({
      query: (data) => ({
        url: "/notification/send-custom",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetRecentNotificationsQuery,
  useGetNotificationStatsQuery,
  useSendNotificationMutation,
} = notificationApi;
