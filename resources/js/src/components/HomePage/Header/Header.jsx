import "./Header.css";
// import "../../assets/css/custom.css";

const Header = () => {
  return (
    <header className="hero-section d-flex align-items-center text-end text-white">
      <div className="overlay"></div>
      <div className="text container position-relative d-flex flex-column flex-lg-row align-items-center justify-content-center gap-4">
        <div className="ms-auto" style={{ maxWidth: "705px" }}>
          <h1 className="display-4 fw-bold mb-4">
            صيانة احترافية، تعديل دقيق، وقطع غيار أصلية
          </h1>
          <p className="lead mb-4">
            خبرتنا الممتدة وخدماتنا المتخصصة تضمن لك راحة البال وجودة عالية بكل
            تفصيل، من أول الفحص، إلى التركيب والتعديل، نستخدم أحدث الأجهزة
            ونعتمد على فريق فاهم في سيارات مثل: مرسيدس، BMW، أودي وغيرها. احجز
            موعدك اليوم وخلك مطمّن إن سيارتك بأيدٍ أمينة.
          </p>
          <div className="d-flex gap-3 justify-content-end">
            <a href="#" className="btn btn-outline-light px-4 py-2">
              إكتشف المزيد
            </a>
            <a href="#" className="btn btn-primary px-4 py-2">
              إحجز موعدك الآن
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
