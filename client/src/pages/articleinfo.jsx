import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Rating, Textarea, Button } from "@material-tailwind/react";
import { Pencil, Trash2 } from "lucide-react";
import Footer from "../components/footer";
import profileImage from "../img/profile-circle-icon-512x512-zxne30hp.png";
import cardImage from "../img/card-img.jpg";

function ArticleInfo() {
  const textArea = useRef();
  const [ratingValue, setRatingValue] = useState(0);
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleWithComment = await axios.get(
          `http://localhost:5000/article/get-with-comments/${id}`,
          { withCredentials: true }
        );
        setArticle(articleWithComment.data);
        setComments(articleWithComment.data.Comments);
      } catch (error) {
        console.error("Error fetching article:", error);
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء جلب المقال. الرجاء المحاولة مرة أخرى.",
          confirmButtonText: "حسناً",
        });
      }
    };
    fetchArticle();
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
      const response = await axios.post(
        "http://localhost:5000/article/add-comment",
        {
          content: commentContent,
          rating: ratingValue,
          commentable_id: id,
          commentable_type: "ARTICLE",
        },
        { withCredentials: true }
      );

      setComments([...comments, response.data]);
      textArea.current.querySelector("textarea").value = "";
      setRatingValue(0);
      Swal.fire({
        icon: "success",
        title: "تم",
        text: "تمت إضافة التعليق بنجاح",
        confirmButtonText: "حسناً",
      });
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
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen">
        جاري التحميل...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[80rem] my-28 mx-auto">
        <article className="rounded-lg p-4 sm:p-8">
          <h1 className="text-4xl font-bold text-customBrown mb-7">
            {article.title}
          </h1>

          <div className="flex gap-5 items-center mb-8">
            <img
              src={profileImage}
              alt="صورة الملف الشخصي"
              className="h-12 w-12 rounded-full"
            />
            <h2 className="text-xl font-bold text-customBrown">
              {article.author}
            </h2>
          </div>

          <img
            src={cardImage}
            alt="صورة المقال"
            className="h-[28rem] w-full object-cover rounded-lg mb-7"
          />

          <p className="text-xl text-right mb-7">{article.content}</p>

          <section className="mt-12">
            <h2 className="text-4xl mb-7">التعليقات</h2>
            {comments.map(comment => (
              <div className="p-4 rounded-lg my-7 bg-gray-100" key={comment.id}>
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={profileImage}
                    alt="صورة الملف الشخصي"
                    className="h-12 w-12 rounded-full"
                  />
                  <h3 className="text-2xl font-bold">
                    {comment.User?.username}
                  </h3>
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
                {article.user_id === comment.User?.id &&
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
        </article>
      </div>
      <Footer />
    </>
  );
}

export default ArticleInfo;
