import React from 'react';
import blogsData from '../../data/blogs.json';

const Blogs = () => {
  const [visibleCards, setVisibleCards] = React.useState([]);
  const cardRefs = React.useRef([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => [...new Set([...prev, index])]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="section__container blog__container">
      <h2 className="section__header">Latest From Blog</h2>
      <p className="section__subheader">Elevate your wardrobe with our freshest style tips, trends, and inspiration on our blog.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
        {blogsData.map((blog, index) => (
          <div key={index} ref={(el) => (cardRefs.current[index] = el)} data-index={index} className={`blog__card cursor-pointer transform transition-all duration-700 ${visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} hover:scale-105`}>
            <img src={blog.imageUrl} alt="blog image" />
            <div className="blog__card__content">
              <h6>{blog.subtitle}</h6>
              <h4>{blog.title}</h4>
              <p>{blog.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs;
