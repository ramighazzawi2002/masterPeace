import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Rating, Textarea, Button } from "@material-tailwind/react";
import profileImage from "../img/profile-circle-icon-512x512-zxne30hp.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import SEO from "../components/SEO";
import Toast from "@/components/ui/Toast";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const textArea = useRef();
  const [ratingValue, setRatingValue] = useState(0);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const { updateCartCount } = useCart();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleAddQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const productWithComments = await axios.get(
          `http://localhost:5000/product/get-by-id/${id}`
        );
        setProduct(productWithComments.data);
        setComments(productWithComments.data.Comments);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [id]);

  const addComment = async () => {
    const commentContent = textArea.current.querySelector("textarea").value;
    if (!commentContent || ratingValue === 0) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه",
        text: "الرجاء كتابة تعليق وتحديد التقييم",
        confirmButtonText: "حسناً",
      });
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/article/add-comment",
        {
          content: commentContent,
          rating: ratingValue,
          commentable_id: id,
          commentable_type: "PRODUCT",
        },
        { withCredentials: true }
      );

      // Fetch updated comments
      const updatedProductResponse = await axios.get(
        `http://localhost:5000/product/get-by-id/${id}`
      );
      setComments(updatedProductResponse.data.Comments);

      textArea.current.querySelector("textarea").value = "";
      setRatingValue(0);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "يجب عليك تسجيل الدخول لإضافة تعليق",
        confirmButtonText: "حسناً",
      });
    }
  };

  const editComment = async commentId => {
    console.log(commentId);
    if (!editedContent || editedRating === 0) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه",
        text: "الرجاء كتابة تعليق وتحديد التقييم",
        confirmButtonText: "حسناً",
      });
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/article/edit-comment/${commentId}`,
        {
          content: editedContent,
          rating: editedRating,
        }
      );

      setComments(
        comments.map(comment =>
          comment.id === commentId
            ? { ...comment, content: editedContent, rating: editedRating }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditedContent("");
      setEditedRating(0);
      Swal.fire({
        icon: "success",
        title: "تم",
        text: "تم تعديل التعليق بنجاح",
        confirmButtonText: "حسناً",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء تعديل التعليق",
        confirmButtonText: "حسناً",
      });
    }
  };

  const deleteComment = async commentId => {
    const result = await Swal.fire({
      title: "هل أنت متأكد أنك تريد الحذف؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "لا",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `http://localhost:5000/article/delete-comment/${commentId}`
        );
        setComments(comments.filter(comment => comment.id !== commentId));
        Swal.fire({
          icon: "success",
          title: "تم",
          text: "تم حذف التعليق بنجاح",
          confirmButtonText: "حسناً",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء حذف التعليق",
          confirmButtonText: "حسناً",
        });
      }
    }
  };

  const addToCart = async () => {
    try {
      await axios.post(
        "http://localhost:5000/cart/add",
        {
          productId: id,
          quantity,
        },
        { withCredentials: true }
      );
      updateCartCount();
      setToast({
        show: true,
        message: "تمت إضافة المنتج إلى السلة بنجاح",
        type: "success",
      });

      // Auto hide toast after 3 seconds
      setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 3000);
    } catch (err) {
      setToast({
        show: true,
        message: "يجب عليك تسجيل الدخول لإضافة المنتج إلى السلة",
        type: "error",
      });

      // Auto hide toast after 3 seconds
      setTimeout(() => {
        setToast({ show: false, message: "", type: "error" });
      }, 3000);
    }
  };

  if (loading) return <p>جاري التحميل...</p>;
  return (
    <>
      <SEO
        title={product?.name}
        description={product?.description}
        keywords={`منتج, ${product?.name}, التراث الأردني`}
      />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast({ show: false, message: "", type: "success" })
          }
        />
      )}
      <div className="container mx-auto px-4 py-8 my-20">
        <div className="flex flex-col items-center  md:flex-row-reverse">
          {/* Product Image */}
          <div className="md:w-1/2  md:pr-8">
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt="فسيفساء أردنية"
              className="h-[500px] w-[100%] rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <div className="flex items-center mt-2">
              <Rating
                value={
                  comments.length > 0
                    ? Math.round(
                        comments.reduce(
                          (total, comment) => total + comment.rating,
                          0
                        ) / comments.length
                      )
                    : 0
                }
                readonly
              />
              <span className="mr-2 text-gray-600">
                ({comments.length} تقييم)
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 mt-4">
              {product.price} دينار أردني
            </p>
            <p className="mt-4 text-gray-600">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center mt-6">
              <span className="ml-3 text-gray-700">الكمية:</span>
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-3 py-1">{quantity}</span>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={handleAddQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
              onClick={addToCart}
            >
              <ShoppingCart className="ml-2" />
              أضف إلى السلة
            </button>
          </div>
        </div>
        <section className="mt-12">
          <h2 className="text-4xl mb-7">التعليقات</h2>
          {comments.map(comment => (
            <div className="p-4 rounded-lg my-7 bg-gray-100" key={comment.id}>
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={
                    comment.User?.image
                      ? comment.User?.auth_type === "local"
                        ? `http://localhost:5000/uploads/${comment.User?.image}`
                        : comment.User?.image
                      : profileImage
                  }
                  alt="صورة الملف الشخصي"
                  className="h-12 w-12 rounded-full"
                />
                <h3 className="text-2xl font-bold">{comment.User?.username}</h3>
              </div>
              {editingCommentId === comment.id ? (
                <div>
                  <div className="flex items-center mb-3">
                    <span className="ml-2 text-gray-600">التقييم:</span>
                    <Rating
                      value={editedRating}
                      onChange={value => setEditedRating(value)}
                    />
                  </div>
                  <Textarea
                    value={editedContent}
                    onChange={e => setEditedContent(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    color="green"
                    onClick={() => editComment(comment.id)}
                    className="mr-2"
                  >
                    حفظ
                  </Button>
                  <Button
                    color="red"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditedContent("");
                      setEditedRating(0);
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex mb-3">
                    <Rating value={comment.rating} readonly />
                  </div>
                  <p className="text-lg">{comment.content}</p>
                </>
              )}
              {product.user_id === comment.User?.id &&
                editingCommentId !== comment.id && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      color="blue"
                      className="flex items-center gap-2"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditedContent(comment.content);
                        setEditedRating(comment.rating);
                      }}
                    >
                      <Pencil size={16} />
                      تعديل
                    </Button>
                    <Button
                      color="red"
                      className="flex items-center gap-2"
                      onClick={() => deleteComment(comment.id)}
                    >
                      <Trash2 size={16} />
                      حذف
                    </Button>
                  </div>
                )}
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-3xl mb-5">أضف تعليقك</h2>
          <Textarea
            label="اكتب تعليقك هنا"
            className="text-[20px] mb-4"
            ref={textArea}
          />
          <div className="flex items-center mb-4">
            <span className="ml-2 text-gray-600">التقييم:</span>
            <Rating
              value={ratingValue}
              onChange={value => setRatingValue(value)}
            />
          </div>
          <Button
            color="green"
            className="px-6 py-3 text-lg"
            onClick={addComment}
          >
            إضافة تعليق
          </Button>
        </section>
      </div>
    </>
  );
};

export default ProductDetails;
