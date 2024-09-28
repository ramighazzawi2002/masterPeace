import React, { useState } from "react";
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

const initialWebsiteStatsData = [
  { name: "يناير", visitors: 4000, pageViews: 24000 },
  { name: "فبراير", visitors: 3000, pageViews: 18000 },
  { name: "مارس", visitors: 2000, pageViews: 12000 },
  { name: "أبريل", visitors: 2780, pageViews: 16680 },
  { name: "مايو", visitors: 1890, pageViews: 11340 },
  { name: "يونيو", visitors: 2390, pageViews: 14340 },
];

const initialActivitySummaryData = [
  { name: "مقالات", count: 152 },
  { name: "ورشات", count: 24 },
  { name: "منتجات", count: 87 },
  { name: "تعليقات", count: 543 },
];

const initialArticles = [
  {
    id: 1,
    title: "تاريخ الأردن القديم",
    author: "أحمد محمد",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "الحرف اليدوية الأردنية",
    author: "سارة خالد",
    date: "2024-03-10",
  },
  {
    id: 3,
    title: "المطبخ الأردني التقليدي",
    author: "ليلى عمر",
    date: "2024-03-05",
  },
];

const initialWorkshops = [
  {
    id: 1,
    title: "صناعة الفخار الأردني",
    date: "2024-04-20",
    participants: 15,
  },
  {
    id: 2,
    title: "الطبخ التقليدي الأردني",
    date: "2024-05-05",
    participants: 20,
  },
];

const initialProducts = [
  { id: 1, name: "ثوب أردني تقليدي", price: 150, stock: 10 },
  { id: 2, name: "مجوهرات بدوية", price: 80, stock: 25 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [websiteStatsData, setWebsiteStatsData] = useState(
    initialWebsiteStatsData
  );
  const [activitySummaryData, setActivitySummaryData] = useState(
    initialActivitySummaryData
  );
  const [articles, setArticles] = useState(initialArticles);
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = items => {
    return items.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleAddItem = type => {
    const newItem = { id: Date.now() };
    switch (type) {
      case "article":
        newItem.title = "مقالة جديدة";
        newItem.author = "المؤلف";
        newItem.date = new Date().toISOString().split("T")[0];
        setArticles([...articles, newItem]);
        break;
      case "workshop":
        newItem.title = "ورشة جديدة";
        newItem.date = new Date().toISOString().split("T")[0];
        newItem.participants = 0;
        setWorkshops([...workshops, newItem]);
        break;
      case "product":
        newItem.name = "منتج جديد";
        newItem.price = 0;
        newItem.stock = 0;
        setProducts([...products, newItem]);
        break;
    }
    // Update activity summary
    setActivitySummaryData(
      activitySummaryData.map(item =>
        item.name === type + "s" ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const handleDeleteItem = (type, id) => {
    switch (type) {
      case "article":
        setArticles(articles.filter(article => article.id !== id));
        break;
      case "workshop":
        setWorkshops(workshops.filter(workshop => workshop.id !== id));
        break;
      case "product":
        setProducts(products.filter(product => product.id !== id));
        break;
    }
    // Update activity summary
    setActivitySummaryData(
      activitySummaryData.map(item =>
        item.name === type + "s" ? { ...item, count: item.count - 1 } : item
      )
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            websiteStatsData={websiteStatsData}
            activitySummaryData={activitySummaryData}
          />
        );
      case "articles":
        return (
          <ArticlesTab
            articles={handleSearch(articles)}
            onAddArticle={() => handleAddItem("article")}
            onDeleteArticle={id => handleDeleteItem("article", id)}
          />
        );
      case "workshops":
        return (
          <WorkshopsTab
            workshops={handleSearch(workshops)}
            onAddWorkshop={() => handleAddItem("workshop")}
            onDeleteWorkshop={id => handleDeleteItem("workshop", id)}
          />
        );
      case "products":
        return (
          <ProductsTab
            products={handleSearch(products)}
            onAddProduct={() => handleAddItem("product")}
            onDeleteProduct={id => handleDeleteItem("product", id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-amber-50 to-amber-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-brown-800">
        لوحة التحكم الإدارية للتراث الأردني
      </h1>
      <div className="mb-6 flex space-x-2 rtl:space-x-reverse">
        {["overview", "articles", "workshops", "products"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? "bg-brown-700 text-white"
                : "bg-brown-200 text-brown-800"
            } hover:bg-brown-600 hover:text-white transition duration-300`}
          >
            {tab === "overview"
              ? "نظرة عامة"
              : tab === "articles"
              ? "المقالات"
              : tab === "workshops"
              ? "الورشات"
              : "المنتجات"}
          </button>
        ))}
      </div>
      {activeTab !== "overview" && (
        <input
          type="text"
          placeholder="بحث..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />
      )}
      {renderContent()}
    </div>
  );
};

const OverviewTab = ({ websiteStatsData, activitySummaryData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">إحصائيات الموقع</h2>
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
      <h2 className="text-xl font-semibold mb-4">ملخص النشاط</h2>
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
  </div>
);

const ArticlesTab = ({ articles, onAddArticle, onDeleteArticle }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">إدارة المقالات</h2>
    <button
      onClick={onAddArticle}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 mb-4"
    >
      إضافة مقالة جديدة
    </button>
    <table className="w-full">
      <thead className="bg-brown-100">
        <tr>
          <th className="p-3 text-right">العنوان</th>
          <th className="p-3 text-right">الكاتب</th>
          <th className="p-3 text-right">التاريخ</th>
          <th className="p-3 text-right">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {articles.map(article => (
          <tr key={article.id} className="border-b">
            <td className="p-3">{article.title}</td>
            <td className="p-3">{article.author}</td>
            <td className="p-3">{article.date}</td>
            <td className="p-3">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600 transition duration-300">
                تعديل
              </button>
              <button
                onClick={() => onDeleteArticle(article.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const WorkshopsTab = ({ workshops, onAddWorkshop, onDeleteWorkshop }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">إدارة الورشات</h2>
    <button
      onClick={onAddWorkshop}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 mb-4"
    >
      إضافة ورشة جديدة
    </button>
    <table className="w-full">
      <thead className="bg-brown-100">
        <tr>
          <th className="p-3 text-right">العنوان</th>
          <th className="p-3 text-right">التاريخ</th>
          <th className="p-3 text-right">عدد المشاركين</th>
          <th className="p-3 text-right">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {workshops.map(workshop => (
          <tr key={workshop.id} className="border-b">
            <td className="p-3">{workshop.title}</td>
            <td className="p-3">{workshop.date}</td>
            <td className="p-3">{workshop.participants}</td>
            <td className="p-3">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600 transition duration-300">
                تعديل
              </button>
              <button
                onClick={() => onDeleteWorkshop(workshop.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProductsTab = ({ products, onAddProduct, onDeleteProduct }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">إدارة المنتجات</h2>
    <button
      onClick={onAddProduct}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 mb-4"
    >
      إضافة منتج جديد
    </button>
    <table className="w-full">
      <thead className="bg-brown-100">
        <tr>
          <th className="p-3 text-right">اسم المنتج</th>
          <th className="p-3 text-right">السعر</th>
          <th className="p-3 text-right">الكمية المتوفرة</th>
          <th className="p-3 text-right">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id} className="border-b">
            <td className="p-3">{product.name}</td>
            <td className="p-3">{product.price}</td>
            <td className="p-3">{product.stock}</td>
            <td className="p-3">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600 transition duration-300">
                تعديل
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;
