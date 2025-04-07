import React from 'react';
import SkeletonCard from '../../components/SkeletonCard';

const ShopPageSkeleton = () => {
  return (
    <>
      <section className="section__container bg-primary-light py-6 ">
        <div className="h-10 w-60 bg-gray-200 rounded-md animate-pulse  mr-auto ml-auto mb-6" />
        <div className="h-5 w-[35em] bg-gray-200 rounded-md animate-pulse mr-auto ml-auto mb-2" />
        <div className="h-5 w-[28em] bg-gray-200 rounded-md animate-pulse mr-auto ml-auto" />
      </section>
      {/* 96 */}

      <section className="section__container mt-8">
        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          {/* Left Filter Skeleton */}
          <div className="w-full md:w-1/4 space-y-4">
            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-8" />

            {[...Array(4)].map((_, j) => (
              <div key={j} className="space-y-2 ">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mt-3 mb-3" />
                <hr />

                <div>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 w-2/4 bg-gray-200 rounded animate-pulse mt-2" />
                  ))}
                </div>
              </div>
            ))}

            <div className="h-8 w-[11em] bg-gray-300 rounded-xl mt-4 animate-pulse" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="w-full">
            <div className="h-6 w-2/5 bg-gray-200 rounded animate-pulse mb-5" />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-10 flex justify-center gap-2">
          <div className="h-11 w-[7em] bg-gray-200 rounded-md animate-pulse" />

          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-10 w-10 bg-gray-200 rounded-md animate-pulse" />
          ))}
          <div className="h-11 w-[5em] bg-gray-200 rounded-md animate-pulse" />
        </div>
      </section>
    </>
  );
};

export default ShopPageSkeleton;
