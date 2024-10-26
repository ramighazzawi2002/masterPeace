import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import axios from "axios";
import Swal from "sweetalert2";

const ContactMessagesTab = () => {
  const [messages, setMessages] = useState([]);
  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    message: null,
  });
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchContactMessages();
  }, []);

  const fetchContactMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/contact-messages`, {
        withCredentials: true,
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      Swal.fire("خطأ", "فشل في جلب رسائل الاتصال", "error");
    }
  };

  const handleReply = message => {
    setReplyModal({ isOpen: true, message });
  };

  const sendReply = async () => {
    try {
      await axios.post(
        `${BASE_URL}/admin/reply-contact-message`,
        {
          messageId: replyModal.message.id,
          replyContent,
        },
        { withCredentials: true }
      );

      Swal.fire("نجاح", "تم إرسال الرد بنجاح", "success");
      setReplyModal({ isOpen: false, message: null });
      setReplyContent("");
    } catch (error) {
      console.error("Error sending reply:", error);
      Swal.fire("خطأ", "فشل في إرسال الرد", "error");
    }
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">رسائل الاتصال</h2>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  الاسم
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  البريد الإلكتروني
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  رقم الهاتف
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  الرسالة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  التاريخ
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map(message => (
                <tr key={message.id} className="border-b">
                  <td className="px-6 py-4 text-gray-800">{`${message.firstName} ${message.lastName}`}</td>
                  <td className="px-6 py-4 text-gray-600">{message.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {message.phoneNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{message.message}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(message.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <button
                      onClick={() => handleReply(message)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      الرد
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {replyModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">الرد على الرسالة</h3>
            <textarea
              className="w-full h-32 p-2 border rounded"
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="اكتب ردك هنا..."
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button
                onClick={sendReply}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                إرسال
              </button>
              <button
                onClick={() => setReplyModal({ isOpen: false, message: null })}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesTab;
