import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FiUsers, FiEye, FiActivity, FiTrendingUp } from "react-icons/fi";

const StatCard = ({ icon: Icon, title, value, change, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-semibold">
            {typeof value === "number" ? value.toLocaleString("ar-EG") : value}
          </p>
        )}
      </div>
      <Icon className="text-3xl text-brown-500" />
    </div>
    {!loading && (
      <p
        className={`text-sm mt-2 flex items-center ${
          change?.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
        <span className="ml-1">{change?.startsWith("+") ? "↑" : "↓"}</span>
      </p>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-gray-600 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number"
              ? entry.value.toLocaleString("ar-EG")
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const OverviewTab = ({
  activitySummaryData = [],
  dashboardStats = {
    totalUsers: 0,
    pageViews: 0,
    newActivities: 0,
    totalAmount: 0,
    userGrowth: "+0%",
    pageViewsGrowth: "+0%",
    activitiesGrowth: "+0%",
    amountGrowth: "+0%",
  },
  loading = false,
}) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={FiUsers}
        title="إجمالي المستخدمين"
        value={dashboardStats.totalUsers}
        change={dashboardStats.userGrowth}
        loading={loading}
      />
      <StatCard
        icon={FiEye}
        title="مشاهدات الصفحة"
        value={dashboardStats.pageViews}
        change={dashboardStats.pageViewsGrowth}
        loading={loading}
      />
      <StatCard
        icon={FiActivity}
        title="النشاطات الجديدة"
        value={dashboardStats.newActivities}
        change={dashboardStats.activitiesGrowth}
        loading={loading}
      />
      <StatCard
        icon={FiTrendingUp}
        title="إجمالي عمولات المنصة"
        value={`${dashboardStats.totalAmount} د.أ`}
        change={dashboardStats.amountGrowth}
        loading={loading}
      />
    </div>

    {/* Activity Summary Chart */}
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FiActivity className="ml-2 text-brown-600" />
        ملخص النشاط
      </h2>
      <div className="h-96">
        {" "}
        {/* Increased height for better visibility */}
        {loading ? (
          <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <BarChart data={activitySummaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#666" }}
                axisLine={{ stroke: "#ccc" }}
              />
              <YAxis
                tick={{
                  fill: "#666",
                  dx: 10, // Add some horizontal padding
                  textAnchor: "start", // Align text to start (right in RTL)
                }}
                axisLine={{ stroke: "#ccc" }}
                orientation="right" // Position the axis on the right
                width={60}
                tickMargin={8} // Add margin between tick and axis line
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="count"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                name="العدد"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  </div>
);

export default OverviewTab;
