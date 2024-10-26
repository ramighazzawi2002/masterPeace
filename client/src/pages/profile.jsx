import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileHeader from "../components/profile/ProfileHeader";
import WorkshopsSection from "../components/profile/WorkshopsSection";
import ArticlesSection from "../components/profile/ArticlesSection";
import OrderItemsSection from "../components/profile/OrderItemsSection";
import WorkshopRegistrationsSection from "../components/profile/WorkshopRegistrationsSection";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { User, Book, ShoppingBag, Clipboard } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    id: 0,
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    is_admin: false,
    auth_type: "",
    createdAt: "",
    updatedAt: "",
    image: "",
  });
  const [articles, setArticles] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [workshopRegistrations, setWorkshopRegistrations] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchArticles();
    fetchWorkshops();
    getOrderItems();
    getWorkshopRegistrations();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/article/get-by-user"
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/workshop/get-by-user"
      );
      setWorkshops(response.data);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    }
  };

  const getOrderItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/orderItem/get");
      setOrderItems(response.data);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const getWorkshopRegistrations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/workshopregistration/get"
      );
      setWorkshopRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching workshop registrations:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen mt-16 flex flex-col">
      <main className="flex-grow container mx-auto mt-8 p-4">
        <div className="max-w-6xl mx-auto">
          <ProfileHeader
            profile={profile}
            setProfile={setProfile}
            fetchProfile={fetchProfile}
          />

          <div className="mt-12">
            <Tabs className="bg-white rounded-lg shadow-lg p-6">
              <TabList className="flex border-b border-gray-200 mb-6">
                <Tab className="px-4 py-2 font-semibold text-gray-600 hover:text-customBrown cursor-pointer focus:outline-none">
                  <div className="flex items-center">
                    <User className="ml-2" size={18} />
                    <span>الملف الشخصي</span>
                  </div>
                </Tab>
                <Tab className="px-4 py-2 font-semibold text-gray-600 hover:text-customBrown cursor-pointer focus:outline-none">
                  <div className="flex items-center">
                    <Book className="ml-2" size={18} />
                    <span>المحتوى الخاص بك</span>
                  </div>
                </Tab>
                <Tab className="px-4 py-2 font-semibold text-gray-600 hover:text-customBrown cursor-pointer focus:outline-none">
                  <div className="flex items-center">
                    <ShoppingBag className="ml-2" size={18} />
                    <span>الطلبات</span>
                  </div>
                </Tab>
                <Tab className="px-4 py-2 font-semibold text-gray-600 hover:text-customBrown cursor-pointer focus:outline-none">
                  <div className="flex items-center">
                    <Clipboard className="ml-2" size={18} />
                    <span>تسجيلات الورش</span>
                  </div>
                </Tab>
              </TabList>

              <TabPanel>
                <h2 className="text-2xl font-bold text-customBrown mb-6">
                  معلومات الملف الشخصي
                </h2>
                <div className="space-y-4">
                  <p>
                    <strong>اسم المستخدم:</strong> {profile.username}
                  </p>
                  <p>
                    <strong>البريد الإلكتروني:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>تاريخ الانضمام:</strong>{" "}
                    {new Date(profile.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                  {/* Add more profile information as needed */}
                </div>
              </TabPanel>

              <TabPanel>
                <h2 className="text-2xl font-bold text-customBrown mb-6">
                  المحتوى الخاص بك
                </h2>
                <div className="space-y-12">
                  <WorkshopsSection
                    workshops={workshops}
                    setWorkshops={setWorkshops}
                  />
                  <ArticlesSection
                    articles={articles}
                    setArticles={setArticles}
                  />
                </div>
              </TabPanel>

              <TabPanel>
                <OrderItemsSection
                  orderItems={orderItems}
                  getOrderItems={getOrderItems}
                />
              </TabPanel>

              <TabPanel>
                <WorkshopRegistrationsSection
                  registrations={workshopRegistrations}
                  getRegistrations={getWorkshopRegistrations}
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
