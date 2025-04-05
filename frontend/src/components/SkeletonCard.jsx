const SkeletonCard = () => {
  return (
    <div className="skeleton__card animate-pulse border-r-12">
      <div className="h-64 bg-gray-300 rounded-2xl"></div>
      <div className="flex justify-center items-center flex-col p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
