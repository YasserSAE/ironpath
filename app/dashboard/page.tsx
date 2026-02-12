import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      workouts: {
        take: 5,
        orderBy: { date: "desc" },
      },
      workoutPlans: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user completed onboarding
  if (!user.goal || !user.experience) {
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative backdrop-blur-xl bg-slate-900/50 border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              💪 IronPath
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">Welcome, <span className="text-white font-semibold">{user.name}</span>!</span>
              <form action="/api/auth/signout" method="POST">
                <button className="px-6 py-2 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 hover:border-white/30 transition-all">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all transform hover:scale-105">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span> Your Profile
            </h2>
            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Goal:</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30">
                  {user.goal}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Experience:</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/30">
                  {user.experience}
                </span>
              </div>
              {user.weight && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Weight:</span>
                  <span className="text-white font-bold">{user.weight} kg</span>
                </div>
              )}
              {user.targetWeight && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Target:</span>
                  <span className="text-white font-bold">{user.targetWeight} kg</span>
                </div>
              )}
            </div>
          </div>

          {/* This Week Stats */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all transform hover:scale-105">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📅</span> This Week
            </h2>
            <div className="space-y-2">
              <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {user.workouts.length}
              </p>
              <p className="text-slate-300 text-lg">Workouts Completed</p>
            </div>
          </div>

          {/* Workout Plans */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all transform hover:scale-105">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🤖</span> AI Plans
            </h2>
            <div className="space-y-2">
              <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                {user.workoutPlans.length}
              </p>
              <p className="text-slate-300 text-lg">Plans Generated</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/plans/generate"
            className="group relative p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-white text-center overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/80"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 text-lg">🤖 Generate AI Plan</span>
          </Link>
          <Link
            href="/workouts/log"
            className="p-6 backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl font-bold text-white text-center hover:bg-white/20 hover:border-white/30 transition-all transform hover:scale-105"
          >
            <span className="text-lg">✍️ Log Workout</span>
          </Link>
          <Link
            href="/exercises"
            className="p-6 backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl font-bold text-white text-center hover:bg-white/20 hover:border-white/30 transition-all transform hover:scale-105"
          >
            <span className="text-lg">📚 Exercise Library</span>
          </Link>
          <Link
            href="/progress"
            className="p-6 backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl font-bold text-white text-center hover:bg-white/20 hover:border-white/30 transition-all transform hover:scale-105"
          >
            <span className="text-lg">📊 View Progress</span>
          </Link>
        </div>

        {/* Recent Workouts */}
        <div className="backdrop-blur-xl bg-slate-800/40 rounded-2xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🏋️</span> Recent Workouts
          </h2>
          {user.workouts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-slate-400 text-lg mb-6">No workouts yet! Let's get started.</p>
              <Link
                href="/plans/generate"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
              >
                Generate Your First Workout Plan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {user.workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="backdrop-blur-xl bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-lg mb-1">{workout.name}</h3>
                      <p className="text-slate-400 text-sm">
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        workout.completed
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {workout.completed ? "✓ Completed" : "⏳ In Progress"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
