const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-charcoal-950 transition-opacity duration-500">
      <div className="animate-pulse flex flex-col items-center">
        {/* Use the app logo from public folder */}
        <img src="/logo.png" alt="SkillSynergy" className="w-24 h-24 mb-4 rounded-2xl shadow-lg" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          SkillSynergy
        </h1>
        <div className="mt-8">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
