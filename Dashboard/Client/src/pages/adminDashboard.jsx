import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiLogOut,
  FiBook,
  FiShoppingBag,
  FiCheckSquare,
  FiMail,
} from "react-icons/fi";
import Swal from "sweetalert2";
import OverviewTab from "../Components/OverviewTab";
import ArticlesTab from "../components/ArticlesTab";
import WorkshopsTab from "../components/WorkshopsTab";
import ProductsTab from "../Components/ProductsTab";
import UsersTab from "../components/UsersTab";
import UnapprovedArticlesTab from "../components/UnapprovedArticlesTab";
import UnapprovedWorkshopsTab from "../components/UnapprovedWorkshopsTab";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import ContactMessagesTab from "../components/ContactMessagesTab";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activitySummaryData, setActivitySummaryData] = useState([]);
  const [articles, setArticles] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    pageViews: 0,
    newActivities: 0,
    totalAmount: 0,
    userGrowth: "+0%",
    pageViewsGrowth: "+0%",
    activitiesGrowth: "+0%",
    amountGrowth: "+0%",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

      const stats = {
        totalUsers: response.data.stats?.totalUsers || 0,
        pageViews: response.data.stats?.pageViews || 0,
        newActivities: response.data.stats?.newActivities || 0,
        totalAmount: response.data.stats?.totalAmount || 0,
        userGrowth: response.data.stats?.userGrowth || "+0%",
        pageViewsGrowth: response.data.stats?.pageViewsGrowth || "+0%",
        activitiesGrowth: response.data.stats?.activitiesGrowth || "+0%",
        amountGrowth: response.data.stats?.amountGrowth || "+0%",
      };

      setActivitySummaryData(response.data.activitySummaryData || []);
      setDashboardStats(stats);
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
          console.log("Sending article data:", Object.fromEntries(formData));
          response = await axios.post(`${BASE_URL}/admin/articles`, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Article creation response:", response.data);
          setArticles(prevArticles => [...prevArticles, response.data]);
          break;
        case "workshop":
          const newWorkshop = {
            title: "ورشة جديدة",
            description: "",
            start_time: new Date().toISOString(),
            max_participants: 10,
            owner_id: 1,
          };
          response = await axios.post(
            `${BASE_URL}/admin/workshops`,
            newWorkshop,
            { withCredentials: true }
          );
          setWorkshops([...workshops, response.data]);
          break;
        case "product":
          response = await axios.post(`${BASE_URL}/admin/products`, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setProducts([...products, response.data]);
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
      console.error("Error response:", error.response?.data);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text:
          error.response?.data?.message ||
          `فشل في إضافة ${
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
      navigate("/admin/login");
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

  const handleEditWorkshop = async (id, formData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/workshops/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setWorkshops(
        workshops.map(workshop =>
          workshop.id === id ? response.data : workshop
        )
      );
      return response.data;
    } catch (error) {
      console.error(`Error editing workshop:`, error);
      throw error;
    }
  };

  const handleEditProduct = async (id, formData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/products/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProducts(
        products.map(product => (product.id === id ? response.data : product))
      );
      return response.data;
    } catch (error) {
      console.error(`Error editing product:`, error);
      throw error;
    }
  };

  const handleToggleUserStatus = (userId, newStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, is_active: newStatus } : user
      )
    );
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
            activitySummaryData={activitySummaryData}
            dashboardStats={dashboardStats}
            loading={isLoading}
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
        return <WorkshopsTab />;
      case "products":
        return (
          <ProductsTab
            products={handleSearch(products)}
            onAddProduct={formData => handleAddItem("product", formData)}
            onDeleteProduct={id => handleDeleteItem("product", id)}
            onEditProduct={handleEditProduct}
          />
        );
      case "users":
        return (
          <UsersTab
            users={handleSearch(users)}
            onToggleUserStatus={handleToggleUserStatus}
          />
        );
      case "unapproved-articles":
        return <UnapprovedArticlesTab />;
      case "unapproved-workshops":
        return <UnapprovedWorkshopsTab />;
      case "contact-messages":
        return <ContactMessagesTab />;
      default:
        return null;
    }
  };

  const tabs = [
    { name: "لوحة التحكم", icon: FiHome, value: "overview" },
    { name: "المقالات", icon: FiFileText, value: "articles" },
    { name: "الورش", icon: FiBook, value: "workshops" },
    { name: "المنتجات", icon: FiShoppingBag, value: "products" },
    { name: "المستخدمين", icon: FiUsers, value: "users" },
    {
      name: "المقالات غير المعتمدة",
      icon: FiCheckSquare,
      value: "unapproved-articles",
    },
    {
      name: "الورش غير المعتمدة",
      icon: FiCheckSquare,
      value: "unapproved-workshops",
    },
    { name: "رسائل الاتصال", icon: FiMail, value: "contact-messages" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-brown-800 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        } fixed md:relative w-64 h-full bg-brown-800 text-white transition-transform duration-300 ease-in-out z-40 md:z-0`}
      >
        <div className="p-4 overflow-y-auto h-screen">
          <h1 className="text-xl md:text-2xl font-bold mb-4">لوحة التحكم</h1>
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveTab(tab.value);
                    // Close sidebar on mobile after selecting a tab
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeTab === tab.value
                      ? "bg-brown-700 text-white"
                      : "text-brown-300 hover:bg-brown-700 hover:text-white"
                  } transition duration-300 text-sm md:text-base`}
                >
                  <Icon className="ml-2" />
                  {tab.name}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 rounded-lg text-brown-300 hover:bg-brown-700 hover:text-white transition duration-300 text-sm md:text-base"
            >
              <FiLogOut className="ml-2" />
              تسجيل الخروج
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        <header className="bg-white shadow p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl md:text-3xl font-bold text-brown-900 mr-16 md:mr-0">
              لوحة التحكم الإدارية للتراث الأردني
            </h1>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
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
          <div className="overflow-x-auto">{renderContent()}</div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;
