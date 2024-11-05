import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiUsers, FiEye, FiActivity, FiTrendingUp } from "react-icons/fi";

const OverviewTab = ({ websiteStatsData, activitySummaryData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FiUsers className="mr-2 text-brown-600" />
        إحصائيات الزوار
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={websiteStatsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="visitors"
              stroke="#8884d8"
              name="الزوار"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pageViews"
              stroke="#82ca9d"
              name="مشاهدات الصفحات"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FiActivity className="mr-2 text-brown-600" />
        ملخص النشاط
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activitySummaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    {/* <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={FiUsers}
        title="إجمالي المستخدمين"
        value="1,234"
        change="+5.3%"
      />
      <StatCard
        icon={FiEye}
        title="مشاهدات الصفحة"
        value="45,678"
        change="+2.7%"
      />
      <StatCard
        icon={FiActivity}
        title="النشاطات الجديدة"
        value="789"
        change="+12.1%"
      />
      <StatCard
        icon={FiTrendingUp}
        title="معدل التحويل"
        value="3.2%"
        change="+0.8%"
      />
    </div> */}
  </div>
);

// const StatCard = ({ icon: Icon, title, value, change }) => (
//   <div className="bg-white p-6 rounded-lg shadow">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-500 mb-1">{title}</p>
//         <p className="text-2xl font-semibold">{value}</p>
//       </div>
//       <Icon className="text-3xl text-brown-500" />
//     </div>
//     <p
//       className={`text-sm mt-2 ${
//         change.startsWith("+") ? "text-green-500" : "text-red-500"
//       }`}
//     >
//       {change}
//     </p>
//   </div>
// );

export default OverviewTab;
