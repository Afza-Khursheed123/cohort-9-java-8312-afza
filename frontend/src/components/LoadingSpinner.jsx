function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-200/30 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-indigo-500 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/30"></div>
        </div>
        <p className="mt-6 text-sm text-gray-500 font-medium animate-pulse">
          Loading your contacts...
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;