"use client";

import { OverviewMetrics } from "@/components/dashboard/overview-metrics";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { PlatformDistributionChart } from "@/components/dashboard/platform-distribution-chart";
import { SubscriptionStatusChart } from "@/components/dashboard/subscription-status-chart";
import { UserActivityChart } from "@/components/dashboard/user-activity-chart";
import { useGetDashboardAnalyticsQuery } from "@/redux/features/system/systemApi";

const DashboardPage = () => {
  const { data: analyticsData, isLoading } = useGetDashboardAnalyticsQuery({});
  const analytics = analyticsData?.data;

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      {/* Title */}
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time platform metrics and user analytics</p>
      </div>

      {/* Metrics Section */}
      <OverviewMetrics data={analytics?.metrics} isLoading={isLoading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
        <div className="h-[450px]">
          <UserGrowthChart data={analytics?.userGrowth} />
        </div>
        <div className="h-[450px]">
          <PlatformDistributionChart data={analytics?.platformDistribution} />
        </div>
        <div className="h-[450px]">
          <SubscriptionStatusChart data={analytics?.subscriptionStatus} />
        </div>
        <div className="h-[450px]">
          <UserActivityChart data={analytics?.userActivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
