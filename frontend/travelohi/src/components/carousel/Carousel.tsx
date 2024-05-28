import "./carousel.scss";
interface CarouselProps {
  items: { PromoPicture: string }[];
}

function Carousel({ items }: CarouselProps) {
  return (
    <section className="container">
      <p className="para-container">Ongoing Promos</p>
      <div className="slider-wrapper">
        <div className="slider">
          {items.map((item, index) => (
            <img
              key={index}
              id={`slide-${index}`}
              src={item.PromoPicture}
              alt="carousel"
            />
          ))}
        </div>
        <div className="slider-nav">
          <a href="#slide-0"></a>
          <a href="#slide-1"></a>
          <a href="#slide-2"></a>
          <a href="#slide-3"></a>
        </div>
      </div>
    </section>
  );
}

export default Carousel;
