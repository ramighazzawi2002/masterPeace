import React from "react";
import {
  FaHome,
  FaUser,
  FaChartBar,
  FaUsers,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

const Test = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-gray-800 text-white w-64 px-6 py-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <nav className="flex flex-col space-y-4">
          <a
            href="#"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
          >
            <FaHome />
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
          >
            <FaUser />
            <span>Users</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
          >
            <FaChartBar />
            <span>Analytics</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white h-16 shadow-sm px-6 flex items-center justify-between">
          <div className="text-2xl font-semibold">Dashboard</div>
          <div className="space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Notifications
            </button>
            <button className="bg-gray-300 px-4 py-2 rounded">Logout</button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
            <div className="text-blue-500 text-4xl">
              <FaUsers />
            </div>
            <div>
              <div className="text-lg font-semibold">Total Users</div>
              <div className="text-2xl font-bold">1,200</div>
            </div>
          </div>

          {/* Dashboard Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
            <div className="text-green-500 text-4xl">
              <FaShoppingCart />
            </div>
            <div>
              <div className="text-lg font-semibold">Revenue</div>
              <div className="text-2xl font-bold">$34,000</div>
            </div>
          </div>

          {/* Dashboard Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
            <div className="text-yellow-500 text-4xl">
              <FaChartLine />
            </div>
            <div>
              <div className="text-lg font-semibold">Visits</div>
              <div className="text-2xl font-bold">12,500</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Test;
