import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AlertCircle,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  X,
  Calendar,
  Users,
  ArrowRight,
  Book,
  Target,
  Award,
} from "lucide-react";
import { useWorkshopContext } from "../components/context/workShopAmount";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function WorkshopInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setWorkshopAmount, setWorkshopId } = useWorkshopContext();
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setWorkshopId(id);
      try {
        const workshopResponse = await axios.get(
          `http://localhost:5000/workshop/get/${id}`
        );
        setWorkshop(workshopResponse.data);
        setWorkshopAmount(workshopResponse.data.cost);

        const isRegisteredResponse = await axios.post(
          "http://localhost:5000/workshopregistration/check",
          { workshop_id: id }
        );
        setIsRegistered(isRegisteredResponse.data.userRegistered);
        setToken(true);
      } catch (err) {
        console.error("Error fetching data:", err);
        setToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, setWorkshopAmount, setWorkshopId]);

  const formatDate = dateString => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  const handleRegistration = () => {
    if (!token) {
      setAlert({
        type: "warning",
        title: "تنبيه",
        description: "يرجى تسجيل الدخول أولاً للتسجيل في الورشة",
        action: (
          <Button variant="outline" onClick={() => navigate("/login")}>
            تسجيل الدخول
          </Button>
        ),
      });
    } else if (isRegistered) {
      setAlert({
        type: "info",
        title: "تم التسجيل مسبقاً",
        description: "لقد قمت بالتسجيل في هذه الورشة بالفعل",
      });
    } else {
      navigate("/checkout");
    }
  };

  const closeAlert = () => {
    setAlert(null);
  };

  if (isLoading) {
    return <WorkshopSkeleton />;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen mt-20">
      <div className="container mx-auto px-4 py-8">
        {alert && (
          <Alert
            variant={alert.type}
            className="mb-6 fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg shadow-lg mt-10 bg-gradient-to-r from-green-400 to-blue-500"
          >
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 ml-2" />
              <div className="flex-grow">
                <AlertTitle className="font-bold mb-1 mt-1">
                  {alert.title}
                </AlertTitle>
                <AlertDescription className="flex gap-4 items-center">
                  <div>{alert.description}</div>
                  <div>{alert.action}</div>
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 -mr-2 -mt-2 hover:bg-opacity-20 hover:bg-gray-500 rounded-full p-1"
                onClick={closeAlert}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}
        {workshop && (
          <div className="space-y-12">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={`http://localhost:5000/uploads/${workshop.image}`}
                alt={workshop.title}
                className="w-full h-[60vh] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end">
                <div className="p-8 text-white w-full">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {workshop.title}
                  </h1>
                  <p className="text-xl opacity-90 mb-6">
                    {workshop.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {renderInfoBadge(
                      <Calendar className="w-5 h-5" />,
                      formatDate(workshop.date)
                    )}
                    {renderInfoBadge(
                      <Clock className="w-5 h-5" />,
                      `${workshop.start_time} - ${workshop.end_time}`
                    )}
                    {renderInfoBadge(
                      <MapPin className="w-5 h-5" />,
                      workshop.location
                    )}
                    {renderInfoBadge(
                      <DollarSign className="w-5 h-5" />,
                      `${workshop.cost} دينار أردني`
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {renderFeatureCard(
                "المواضيع",
                <Book className="w-8 h-8 text-green-500" />,
                workshop.topics_covered.split("،")
              )}
              {renderFeatureCard(
                "المتطلبات",
                <Target className="w-8 h-8 text-blue-500" />,
                workshop.requirements.split(",")
              )}
              {renderFeatureCard(
                "المزايا",
                <Award className="w-8 h-8 text-yellow-500" />,
                workshop.benefits.split("،")
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                تفاصيل الورشة
              </h2>
              <div className="prose prose-lg max-w-none">
                {/* Add more detailed content about the workshop here */}
                <p>
                  هذه الورشة ستوفر لك فرصة فريدة للتعلم والتطور في مجال{" "}
                  {workshop.title}. ستتعلم من خبراء في المجال وستكتسب مهارات
                  عملية يمكنك تطبيقها فوراً في حياتك المهنية.
                </p>
                <h3 className="text-xl font-bold mt-4 mb-4">ماذا ستتعلم؟</h3>
                <ol className="list-decimal list-inside mr-4">
                  {workshop.topics_covered.split("،").map((topic, index) => (
                    <li key={index} className="mb-2">
                      {topic}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">
                سجل الآن وابدأ رحلة التعلم!
              </h2>
              <p className="text-xl mb-6">
                لا تفوت هذه الفرصة الرائعة للتطور والنمو في مجال{" "}
                {workshop.title}.
              </p>
              <Button
                onClick={handleRegistration}
                className={`w-full py-6 text-xl rounded-full bg-white text-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-105`}
              >
                {isRegistered ? "تم التسجيل" : "سجل الآن"}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderInfoBadge(icon, text) {
  return (
    <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 flex items-center space-x-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function renderFeatureCard(title, icon, items) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 flex items-center space-x-4">
        <div className="bg-white p-3 rounded-full">{icon}</div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>
      <ul className="p-6 space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2 mt-1 flex-shrink-0" />
            <span className="text-lg text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkshopSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-[60vh] w-full rounded-xl mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl mb-12" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default WorkshopInfo;
