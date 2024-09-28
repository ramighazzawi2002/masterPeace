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

const jordanianCities = [
  "Amman",
  "Irbid",
  "Zarqa",
  "Aqaba",
  "Madaba",
  "Jerash",
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
    <Card className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-blue-600 text-white p-6">
        <CardTitle className="text-2xl font-bold text-center">
          عنوان الفواتير
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="fullName"
              className="text-right block mb-1 font-semibold"
            >
              الاسم الكامل
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md text-right ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              dir="rtl"
            />
            {errors.fullName && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.fullName}</AlertDescription>
              </Alert>
            )}
          </div>
          <div>
            <Label
              htmlFor="address"
              className="text-right block mb-1 font-semibold"
            >
              العنوان
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md text-right ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              dir="rtl"
            />
            {errors.address && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.address}</AlertDescription>
              </Alert>
            )}
          </div>
          <div>
            <Label
              htmlFor="city"
              className="text-right block mb-1 font-semibold"
            >
              المدينة
            </Label>
            <Select
              name="city"
              onValueChange={value =>
                handleChange({ target: { name: "city", value } })
              }
            >
              <SelectTrigger
                className={`w-full ${errors.city ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                {jordanianCities.map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.city}</AlertDescription>
              </Alert>
            )}
          </div>
          <div>
            <Label
              htmlFor="phoneNumber"
              className="text-right block mb-1 font-semibold"
            >
              رقم الهاتف
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md text-right ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              dir="rtl"
            />
            {errors.phoneNumber && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.phoneNumber}</AlertDescription>
              </Alert>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            الانتقال إلى الدفع
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BillingAddressForm;
