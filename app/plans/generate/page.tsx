"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function GeneratePlanPage() {
  const router = useRouter()
  const [daysPerWeek, setDaysPerWeek] = useState(4)
  const [duration, setDuration] = useState(12)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          daysPerWeek,
          duration,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if it's an API credit issue
        if (data.error && data.error.includes("credit")) {
          setError("⚠️ Claude API credits are low. Please add funds at https://console.anthropic.com to generate workout plans.")
        } else {
          setError(data.error || "Failed to generate plan")
        }
        return
      }

      setGeneratedPlan(data.plan)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (generatedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <nav className="relative backdrop-blur-lg bg-slate-900/50 border-b border-slate-700/50 p-4">
          <div className="container mx-auto">
            <Link href="/dashboard" className="text-white hover:text-blue-400 transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </nav>

        <div className="relative container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Plan Header */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 border border-white/10 mb-8 shadow-2xl">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                {generatedPlan.name}
              </h1>
              <p className="text-slate-300 text-lg mb-6">{generatedPlan.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30">
                  📅 {generatedPlan.duration} weeks
                </span>
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/30">
                  🏋️ {generatedPlan.daysPerWeek} days/week
                </span>
                <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm font-semibold border border-pink-500/30">
                  🎯 {generatedPlan.goal}
                </span>
              </div>
            </div>

            {/* Workout Days */}
            <div className="space-y-6">
              {generatedPlan.workouts.map((workout: any, index: number) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-slate-800/40 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                >
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Day {workout.day}: {workout.name}
                    </h2>
                    <p className="text-slate-400 text-lg">Focus: <span className="text-blue-400 font-semibold">{workout.focus}</span></p>
                  </div>

                  <div className="space-y-4">
                    {workout.exercises.map((exercise: any, exIndex: number) => (
                      <div
                        key={exIndex}
                        className="bg-slate-900/60 backdrop-blur p-6 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-white text-xl">
                            <span className="text-blue-400">{exIndex + 1}.</span> {exercise.name}
                          </h3>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                            {exercise.machine}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                            <div className="text-slate-400 text-sm mb-1">Sets</div>
                            <div className="text-white font-bold text-xl">{exercise.sets}</div>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                            <div className="text-slate-400 text-sm mb-1">Reps</div>
                            <div className="text-white font-bold text-xl">{exercise.reps}</div>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                            <div className="text-slate-400 text-sm mb-1">Rest</div>
                            <div className="text-white font-bold text-xl">{exercise.rest}</div>
                          </div>
                        </div>

                        {exercise.notes && (
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-3">
                            <p className="text-blue-300 text-sm">
                              <span className="font-semibold">💡 Tip:</span> {exercise.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Section */}
            {generatedPlan.tips && generatedPlan.tips.length > 0 && (
              <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8 border border-white/10 mt-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">💪</span> Training Tips
                </h2>
                <ul className="space-y-3">
                  {generatedPlan.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex gap-3 text-slate-300 leading-relaxed">
                      <span className="text-green-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {generatedPlan.nutritionTips && generatedPlan.nutritionTips.length > 0 && (
              <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-2xl p-8 border border-white/10 mt-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">🍽️</span> Nutrition Tips
                </h2>
                <ul className="space-y-3">
                  {generatedPlan.nutritionTips.map((tip: string, index: number) => (
                    <li key={index} className="flex gap-3 text-slate-300 leading-relaxed">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-10 flex gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
              >
                Start This Plan 🚀
              </button>
              <button
                onClick={() => setGeneratedPlan(null)}
                className="flex-1 py-4 backdrop-blur-xl bg-white/10 border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Generate Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <nav className="relative backdrop-blur-lg bg-slate-900/50 border-b border-slate-700/50 p-4">
        <div className="container mx-auto">
          <Link href="/dashboard" className="text-white hover:text-blue-400 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
              🤖 AI Workout Generator
            </h1>
            <p className="text-slate-300 text-xl">
              Let AI create a personalized workout plan tailored to your goals
            </p>
          </div>

          {/* Main Form */}
          <div className="backdrop-blur-2xl bg-slate-800/40 rounded-3xl p-10 border border-slate-700/50 shadow-2xl">
            {error && (
              <div className="bg-red-500/20 border-2 border-red-500/50 text-red-300 px-6 py-4 rounded-2xl mb-8 backdrop-blur">
                <div className="font-bold mb-1">⚠️ Error</div>
                <div className="text-sm">{error}</div>
              </div>
            )}

            <div className="space-y-8">
              {/* Days per week */}
              <div>
                <label className="block text-lg font-bold text-white mb-4">
                  How many days per week can you train?
                </label>
                <div className="grid grid-cols-7 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                    <button
                      key={days}
                      onClick={() => setDaysPerWeek(days)}
                      className={`p-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-110 ${
                        daysPerWeek === days
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                          : "backdrop-blur bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50"
                      }`}
                    >
                      {days}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-lg font-bold text-white mb-4">
                  Program Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-6 py-4 bg-slate-900/50 backdrop-blur border-2 border-slate-700/50 rounded-2xl text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                >
                  <option value={4}>4 weeks (1 month)</option>
                  <option value={8}>8 weeks (2 months)</option>
                  <option value={12}>12 weeks (3 months)</option>
                  <option value={16}>16 weeks (4 months)</option>
                  <option value={24}>24 weeks (6 months)</option>
                </select>
              </div>

              {/* Info Box */}
              <div className="backdrop-blur-xl bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-3 text-lg">Plan will be based on:</h3>
                <ul className="text-slate-300 space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-blue-400">✓</span> Your fitness goal (from profile)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-400">✓</span> Your experience level
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-400">✓</span> {daysPerWeek} training days per week
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue-400">✓</span> {duration} week program
                  </li>
                </ul>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white rounded-2xl font-black text-2xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-2xl shadow-blue-500/50 disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="animate-spin text-3xl">⚙️</span>
                    Generating Your Plan...
                  </span>
                ) : (
                  "🤖 Generate My Workout Plan"
                )}
              </button>

              {loading && (
                <p className="text-center text-slate-400">
                  AI is creating your personalized plan... This may take 10-20 seconds
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
