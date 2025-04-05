import React from 'react';
import dealsImg from '../../assets/deals.png';
import { useGetAllDealsQuery } from '../../redux/features/deals/dealsApi';

const DealsSection = () => {
  const { data, isLoading, isError } = useGetAllDealsQuery();
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    if (!data || !data.endDate) return;

    const interval = setInterval(() => {
      const difference = new Date(data.endDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  // Observer for scroll-triggered animation
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          console.log('observe');
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  if (isLoading) {
    return (
      <section ref={sectionRef} className="section__container deals__container animate-pulse">
        <div className="deals__image">
          <div className="w-full h-64 bg-gray-300 rounded"></div>
        </div>
        <div className="deals__content space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-8 bg-gray-400 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="flex gap-4 mt-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="w-16 h-16 bg-gray-300 rounded flex flex-col items-center justify-center"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) return <p>No active deals</p>;

  return (
    <section ref={sectionRef} className={`section__container deals__container transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="deals__image">
        <img src={dealsImg} alt="Deals" />
      </div>

      <div className="deals__content">
        <h5>{data.title}</h5>
        <h4>Deals Of This Month</h4>
        <p>{data.description}</p>
        <div className="deals__countdown flex-wrap">
          <div className="deals__countdown__card">
            <h4>{timeLeft.days}</h4>
            <p>Days</p>
          </div>
          <div className="deals__countdown__card">
            <h4>{timeLeft.hours}</h4>
            <p>Hours</p>
          </div>
          <div className="deals__countdown__card">
            <h4>{timeLeft.minutes}</h4>
            <p>Mins</p>
          </div>
          <div className="deals__countdown__card">
            <h4>{timeLeft.seconds}</h4>
            <p>Secs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
