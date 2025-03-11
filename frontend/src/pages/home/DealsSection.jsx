import React, { useEffect, useState } from 'react';
import dealsImg from '../../assets/deals.png';
import { useGetAllDealsQuery } from '../../redux/features/deals/dealsApi';

const DealsSection = () => {
  const { data, isLoading, isError } = useGetAllDealsQuery();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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

  if (isLoading) return <p>Loading deal...</p>;
  if (isError || !data) return <p>No active deals</p>;

  return (
    <section className="section__container deals__container">
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
