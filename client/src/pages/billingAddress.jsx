import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, User, Phone, Home } from "lucide-react";
const jordanianCities = [
  "عمان",
  "إربد",
  "الزرقاء",
  "العقبة",
  "المداب",
  "الجرش",
];

const BillingAddressForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error when the user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }
    if (!formData.address.trim()) {
      newErrors.address = "العنوان مطلوب";
    }
    if (!formData.city) {
      newErrors.city = "المدينة مطلوبة";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "رقم الهاتف يجب أن يتكون من 10 أرقام";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <Card className="max-w-xl mx-auto mt-36 bg-sand-100 shadow-lg rounded-lg overflow-hidden border-2 border-customBrown mb-16">
        <CardHeader className="bg-customBrown text-white p-6">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
            <MapPin className="mr-2" size={28} />
            العنوان
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Label
                htmlFor="fullName"
                className="text-right block mb-2 font-semibold text-customBrown"
              >
                الاسم الكامل
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 rounded-md text-right pr-10 ${
                    errors.fullName
                      ? "border-red-500"
                      : "border-customBrown/50 focus:border-customGreen"
                  }`}
                  dir="rtl"
                />
                <User
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-customBrown/50"
                  size={20}
                />
              </div>
              {errors.fullName && (
                <Alert
                  variant="destructive"
                  className="mt-2 bg-red-100 text-red-800 border border-red-300"
                >
                  <AlertDescription>{errors.fullName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="relative">
              <Label
                htmlFor="address"
                className="text-right block mb-2 font-semibold text-customBrown"
              >
                العنوان
              </Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 rounded-md text-right pr-10 ${
                    errors.address
                      ? "border-red-500"
                      : "border-customBrown/50 focus:border-customGreen"
                  }`}
                  dir="rtl"
                />
                <Home
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-customBrown/50"
                  size={20}
                />
              </div>
              {errors.address && (
                <Alert
                  variant="destructive"
                  className="mt-2 bg-red-100 text-red-800 border border-red-300"
                >
                  <AlertDescription>{errors.address}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="relative">
              <Label
                htmlFor="city"
                className="text-right block mb-2 font-semibold text-customBrown"
              >
                المدينة
              </Label>
              <Select
                name="city"
                onValueChange={value =>
                  handleChange({ target: { name: "city", value } })
                }
                dir="rtl"
              >
                <SelectTrigger
                  className={`w-full p-3 text-right border-2 ${
                    errors.city
                      ? "border-red-500"
                      : "border-customBrown/50 focus:border-customGreen"
                  }`}
                >
                  <SelectValue
                    placeholder="اختر المدينة"
                    className="text-right"
                  />
                </SelectTrigger>
                <SelectContent>
                  {jordanianCities.map(city => (
                    <SelectItem className="text-right" key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <Alert
                  variant="destructive"
                  className="mt-2 bg-red-100 text-red-800 border border-red-300"
                >
                  <AlertDescription>{errors.city}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="relative">
              <Label
                htmlFor="phoneNumber"
                className="text-right block mb-2 font-semibold text-customBrown"
              >
                رقم الهاتف
              </Label>
              <div className="relative">
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 rounded-md text-right pr-10 ${
                    errors.phoneNumber
                      ? "border-red-500"
                      : "border-customBrown/50 focus:border-customGreen"
                  }`}
                  dir="rtl"
                />
                <Phone
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-customBrown/50"
                  size={20}
                />
              </div>
              {errors.phoneNumber && (
                <Alert
                  variant="destructive"
                  className="mt-2 bg-red-100 text-red-800 border border-red-300"
                >
                  <AlertDescription>{errors.phoneNumber}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-customGreen text-white py-3 px-4 rounded-md hover:bg-customGreen/90 transition duration-300 text-lg font-semibold shadow-md"
            >
              الانتقال إلى الدفع
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default BillingAddressForm;
