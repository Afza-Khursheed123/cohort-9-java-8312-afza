function LoadingSpinner({ isDarkMode }) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#98C1D9] rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-[#16425B] rounded-full"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-7 h-7 bg-[#3D5A80] rounded-full"></div>
        </div>
        <p className={`mt-6 text-sm font-medium ${isDarkMode ? "text-[#98C1D9]" : "text-[#3D5A80]"}`}>
          Loading your contacts...
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
