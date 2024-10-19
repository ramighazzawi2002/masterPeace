import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiFileText,
  FiTool,
  FiPackage,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import Swal from "sweetalert2";
import OverviewTab from "../components/OverviewTab";
import ArticlesTab from "../components/ArticlesTab";
import WorkshopsTab from "../components/WorkshopsTab";
import ProductsTab from "../components/ProductsTab";
import UsersTab from "../components/UsersTab";
import SettingsTab from "../components/SettingsTab";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [websiteStatsData, setWebsiteStatsData] = useState([]);
  const [activitySummaryData, setActivitySummaryData] = useState([]);
  const [articles, setArticles] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "articles") fetchArticles();
    if (activeTab === "workshops") fetchWorkshops();
    if (activeTab === "products") fetchProducts();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/dashboard`, {
        withCredentials: true,
      });
      setWebsiteStatsData(response.data.websiteStatsData);
      setActivitySummaryData(response.data.activitySummaryData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/articles`, {
        withCredentials: true,
      });
      setArticles(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchWorkshops = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/workshops`, {
        withCredentials: true,
      });
      setWorkshops(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching workshops:", error);
      setError("Failed to fetch workshops. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/products`, {
        withCredentials: true,
      });
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
      setIsLoading(false);
    }
  };

  const handleAddItem = async (type, formData) => {
    try {
      let response;
      switch (type) {
        case "article":
          response = await axios.post(`${BASE_URL}/admin/articles`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          });
          setArticles([...articles, response.data]);
          break;
        case "workshop":
          newItem = {
            title: "ورشة جديدة",
            description: "",
            start_time: new Date().toISOString(),
            max_participants: 10,
            owner_id: 1,
          };
          const workshopResponse = await axios.post(
            `${BASE_URL}/admin/workshops`,
            newItem,
            { withCredentials: true }
          );
          setWorkshops([...workshops, workshopResponse.data]);
          break;
        case "product":
          newItem = {
            name: "منتج جديد",
            description: "",
            price: 0,
            stock: 0,
            author_id: 1,
          };
          const productResponse = await axios.post(
            `${BASE_URL}/admin/products`,
            newItem,
            {
              withCredentials: true,
            }
          );
          setProducts([...products, productResponse.data]);
          break;
      }
      Swal.fire({
        icon: "success",
        title: "تمت الإضافة بنجاح",
        text: `تم إضافة ${
          type === "article" ? "مقالة" : type === "workshop" ? "ورشة" : "منتج"
        } جديد`,
        confirmButtonText: "حسناً",
      });
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: `فشل في إضافة ${
          type === "article" ? "مقالة" : type === "workshop" ? "ورشة" : "منتج"
        } جديد`,
        confirmButtonText: "حسناً",
      });
    }
  };

  const handleDeleteItem = async (type, id) => {
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من التراجع عن هذا!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفه!",
        cancelButtonText: "إلغاء",
      });

      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/admin/${type}s/${id}`, {
          withCredentials: true,
        });

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
        Swal.fire("تم الحذف!", "تم حذف العنصر بنجاح.", "success");
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: `فشل في حذف ${
          type === "article"
            ? "المقالة"
            : type === "workshop"
            ? "الورشة"
            : "المنتج"
        }`,
        confirmButtonText: "حسناً",
      });
    }
  };

  const handleSearch = items => {
    return items.filter(item =>
      Object.values(item).some(
        value =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل في تسجيل الخروج. يرجى المحاولة مرة أخرى.",
        confirmButtonText: "حسناً",
      });
    }
  };

  const handleEditItem = async (type, id, formData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/${type}s/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (type === "article") {
        setArticles(
          articles.map(article => (article.id === id ? response.data : article))
        );
      }
      // Add similar logic for workshops and products if needed
      return response.data;
    } catch (error) {
      console.error(`Error editing ${type}:`, error);
      throw error;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brown-900"></div>
        </div>
      );
    }

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
            onAddArticle={formData => handleAddItem("article", formData)}
            onDeleteArticle={id => handleDeleteItem("article", id)}
            onEditArticle={(id, formData) =>
              handleEditItem("article", id, formData)
            }
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
      case "users":
        return <UsersTab users={handleSearch(users)} />;
      case "settings":
        return <SettingsTab />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: "overview", name: "نظرة عامة", icon: FiHome },
    { id: "articles", name: "المقالات", icon: FiFileText },
    { id: "workshops", name: "الورشات", icon: FiTool },
    { id: "products", name: "المنتجات", icon: FiPackage },
    { id: "users", name: "المستخدمون", icon: FiUsers },
    { id: "settings", name: "الإعدادات", icon: FiSettings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-brown-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>
          <nav>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full p-2 rounded-lg mb-2 ${
                  activeTab === tab.id
                    ? "bg-brown-700 text-white"
                    : "text-brown-300 hover:bg-brown-700 hover:text-white"
                } transition duration-300`}
              >
                <tab.icon className="mr-2" />
                {tab.name}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 rounded-lg mb-2 text-brown-300 hover:bg-brown-700 hover:text-white transition duration-300"
            >
              <FiLogOut className="mr-2" />
              تسجيل الخروج
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-brown-900">
              لوحة التحكم الإدارية للتراث الأردني
            </h1>
            <div className="flex items-center">
              <FiUsers className="text-brown-500 mr-2" />
              <span className="text-brown-700">مرحباً، الإدارة</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab !== "overview" && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="بحث..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
              />
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
