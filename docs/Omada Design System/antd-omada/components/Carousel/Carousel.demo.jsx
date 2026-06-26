/* components/Carousel/Carousel.demo.jsx — window.OmadaDemos.Carousel */
(function () {
  const { Carousel } = window.Omada;
  const OmadaIcon = window.OmadaIcon;

  function Slide({ icon, title, body }) {
    return (
      <div>
        <div className="omada-news-slide">
          <span className="omada-news-disc"><OmadaIcon name={icon} size={26} /></span>
          <div className="omada-news-copy">
            <div className="omada-news-title">{title}</div>
            <div className="omada-news-body">{body}</div>
          </div>
        </div>
      </div>
    );
  }

  function CarouselDemo() {
    const { t } = window.useOmada();

    const slides = [
      { icon: 'adopt',     title: t('carousel.s1t'), body: t('carousel.s1b') },
      { icon: 'insights',  title: t('carousel.s2t'), body: t('carousel.s2b') },
      { icon: 'download',  title: t('carousel.s3t'), body: t('carousel.s3b') },
    ];

    return (
      <>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div className="row"><span className="label">{t('carousel.news')}</span></div>
            <Carousel>
              {slides.map((s, i) => <Slide key={i} {...s} />)}
            </Carousel>
          </div>
          <div>
            <div className="row"><span className="label">{t('carousel.fade')}</span></div>
            <Carousel effect="fade" autoplay autoplaySpeed={3200} arrows={false}>
              {slides.map((s, i) => <Slide key={i} {...s} />)}
            </Carousel>
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Carousel = CarouselDemo;
})();
