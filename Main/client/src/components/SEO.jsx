import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords }) => {
  return (
    <Helmet>
      {/* Character Set */}
      <meta charset="UTF-8" />

      {/* Title */}
      <title>{title ? `${title} | التراث الأردني` : "التراث الأردني"}</title>

      {/* Meta Tags */}
      <meta
        name="description"
        content={
          description ||
          "موقع التراث الأردني - اكتشف جمال وعراقة التراث الأردني من خلال الورش والمنتجات والمقالات"
        }
      />
      <meta
        name="keywords"
        content={
          keywords ||
          "التراث الأردني, الحرف اليدوية, الثقافة الأردنية, ورش عمل, منتجات تراثية"
        }
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph / Social Media */}
      <meta
        property="og:title"
        content={title ? `${title} | التراث الأردني` : "التراث الأردني"}
      />
      <meta
        property="og:description"
        content={
          description ||
          "موقع التراث الأردني - اكتشف جمال وعراقة التراث الأردني"
        }
      />
      <meta property="og:type" content="website" />

      {/* Security Headers */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      <meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self' http://localhost:5000 https: data: 'unsafe-inline' 'unsafe-eval';"
      />

      {/* Cache Control */}
      <meta
        http-equiv="Cache-Control"
        content="no-cache, no-store, must-revalidate"
      />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="0" />
    </Helmet>
  );
};

export default SEO;
