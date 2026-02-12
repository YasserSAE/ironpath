export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center">
          {/* Logo/Title with gradient */}
          <div className="mb-6">
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 animate-pulse">
              💪 IronPath
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          <p className="text-3xl font-bold text-white mb-4">
            AI-Powered Fitness Revolution
          </p>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Your personal AI fitness coach. Get customized workout plans,
            track your progress, and achieve your goals faster with cutting-edge technology.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex gap-4 justify-center flex-wrap">
            <a
              href="/auth/register"
              className="group relative px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-white text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/80"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="/auth/login"
              className="px-10 py-4 backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl font-bold text-white text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
            >
              Login
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">AI Workout Plans</h3>
            <p className="text-slate-300 leading-relaxed">
              Get personalized workout routines powered by advanced AI, tailored to your goals, experience, and equipment.
            </p>
          </div>

          <div className="group backdrop-blur-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">Track Progress</h3>
            <p className="text-slate-300 leading-relaxed">
              Monitor your strength gains, track personal records, and visualize your fitness journey with beautiful charts.
            </p>
          </div>

          <div className="group backdrop-blur-2xl bg-gradient-to-br from-pink-500/10 to-orange-500/10 p-8 rounded-3xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-4">Achieve Goals</h3>
            <p className="text-slate-300 leading-relaxed">
              Whether bulking, cutting, or building strength - IronPath adapts to your objectives and keeps you motivated.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 backdrop-blur-2xl bg-white/5 rounded-3xl p-12 border border-white/10 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">AI-Powered</div>
              <div className="text-slate-400">Workout Generation</div>
            </div>
            <div>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">26+</div>
              <div className="text-slate-400">Exercise Library</div>
            </div>
            <div>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-2">100%</div>
              <div className="text-slate-400">Free to Start</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm">
            🚀 Built with Next.js, powered by Claude AI
          </p>
        </div>
      </div>
    </div>
  );
}
