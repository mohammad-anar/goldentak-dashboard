import { OverviewMetrics } from "@/components/dashboard/overview-metrics";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { PlatformDistributionChart } from "@/components/dashboard/platform-distribution-chart";
import { SubscriptionStatusChart } from "@/components/dashboard/subscription-status-chart";
import { UserActivityChart } from "@/components/dashboard/user-activity-chart";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      {/* Title */}
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      {/* Metrics Section */}
      <OverviewMetrics />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
        <div className="h-[450px]">
          <UserGrowthChart />
        </div>
        <div className="h-[450px]">
          <PlatformDistributionChart />
        </div>
        <div className="h-[450px]">
          <SubscriptionStatusChart />
        </div>
        <div className="h-[450px]">
          <UserActivityChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
