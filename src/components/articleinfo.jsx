function ArticleInfo() {
  return (
    <div class="bg-background text-foreground min-h-screen p-4">
      <header class="flex justify-between items-center py-4 border-b border-border">
        <button class="bg-secondary text-secondary-foreground px-4 py-2 rounded">
          تسجيل الدخول
        </button>
        <nav class="flex space-x-4">
          <a href="#" class="text-muted-foreground">
            الصفحة الرئيسية
          </a>
          <a href="#" class="text-muted-foreground">
            قصص
          </a>
          <a href="#" class="text-muted-foreground">
            ثقافة
          </a>
          <a href="#" class="text-muted-foreground">
            تواصل معنا
          </a>
        </nav>
        <div class="w-8 h-8 bg-muted rounded-full"></div>
      </header>
      <main class="max-w-4xl mx-auto mt-8">
        <h1 class="text-3xl font-bold text-center mb-4">فن النسيج في الأردن</h1>
        <img
          src="https://placehold.co/800x400"
          alt="Embroidery art in Jordan"
          class="w-full mb-4"
        />
        <p class="text-lg leading-relaxed mb-8">
          فن النسيج هو أحد أقدم الفنون في الأردن. يتمثل هذا الفن في عمل قطع
          منسوجة بألوان زاهية وأشكال فنية تعكس تراث وثقافة البلاد. وقد ازدهرت
          هذه الحرفة على مر العصور، حيث كانت النساء في القرى يعملن على إنتاج
          الأقمشة والأغطية المطرزة بأيديهن. وتعتبر هذه الحرفة من الفنون
          التقليدية التي تعبر عن الهوية الوطنية الأردنية.
        </p>
        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-4">التعليقات</h2>
          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 bg-muted rounded-full"></div>
              <div>
                <p class="font-bold">علي</p>
                <p>هذا مقال رائع عن النسيج، أحببت التفاصيل المقدمة!</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 bg-muted rounded-full"></div>
              <div>
                <p class="font-bold">سارة</p>
                <p>شكراً للمعلومات المفيدة، النسيج فن له مكانة خاصة.</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 bg-muted rounded-full"></div>
              <div>
                <p class="font-bold">محمد</p>
                <p>
                  أحببت الصور المرفوعة في المقال، تعكس جمال التراث الأردني في فن
                  النسيج.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <textarea
            class="w-full p-4 border border-border rounded mb-4"
            rows="4"
            placeholder="أضف تعليقك"
          ></textarea>
          <button class="bg-primary text-primary-foreground px-4 py-2 rounded">
            إرسال تعليق
          </button>
        </section>
      </main>
      <footer class="text-center py-4 border-t border-border mt-8">
        <p class="text-sm text-muted-foreground">
          © 2023 Jordanian Heritage Site. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
export default ArticleInfo;
