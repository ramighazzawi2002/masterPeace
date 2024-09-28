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
} from "lucide-react";
import { useWorkshopContext } from "../components/context/workShopAmount";
import Footer from "../components/footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import cardImage from "../img/card-img.jpg";

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
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12 relative">
        {alert && (
          <Alert
            variant={alert.type}
            className={`mb-6 fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg shadow-lg ${
              alert.type === "error"
                ? "bg-red-100 border-red-400 text-red-700"
                : alert.type === "warning"
                ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                : "bg-blue-100 border-blue-400 text-blue-700"
            }`}
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
          <Card className="overflow-hidden mt-16">
            <div className="relative h-80">
              <img
                src={`http://localhost:5000/uploads/${workshop.image}`}
                alt={workshop.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h1 className="text-5xl text-white font-bold">
                  {workshop.title}
                </h1>
              </div>
            </div>
            <CardContent className="p-8 space-y-10">
              <p className="text-gray-600 text-xl leading-relaxed">
                {workshop.description}
              </p>

              {renderSection(
                "المواضيع التي سيتم تغطيتها",
                workshop.topics_covered.split("،")
              )}
              {renderSection("المتطلبات", workshop.requirements.split(","))}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {renderInfoCard("المدة", <Clock className="h-6 w-6" />, [
                  `الورشة تستمر لمدة ${workshop.duration}`,
                  `الوقت: من الساعة ${
                    workshop.start_time.split(":")[0] +
                    ":" +
                    workshop.start_time.split(":")[1]
                  } حتى ${
                    workshop.end_time.split(":")[0] +
                    ":" +
                    workshop.end_time.split(":")[1]
                  }`,
                ])}
                {renderInfoCard("التكلفة", <DollarSign className="h-6 w-6" />, [
                  `${workshop.cost} دينار أردني للشخص الواحد`,
                ])}
                {renderInfoCard("الموقع", <MapPin className="h-6 w-6" />, [
                  workshop.location,
                ])}
              </div>

              {renderSection("المزايا", workshop.benefits.split("،"))}

              <Button
                onClick={handleRegistration}
                className={`w-full py-6 text-xl ${
                  isRegistered
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isRegistered ? "تم التسجيل" : "سجل الآن"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}

function renderSection(title, items) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-green-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-lg text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function renderInfoCard(title, icon, items) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-700 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item, index) => (
          <p key={index} className="text-lg text-gray-700">
            {item}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

function WorkshopSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <Skeleton className="h-80 w-full" />
        <CardContent className="p-8 space-y-10">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default WorkshopInfo;
