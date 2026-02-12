"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form data
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [gender, setGender] = useState("male")
  const [experience, setExperience] = useState("beginner")
  const [goal, setGoal] = useState("bulk")
  const [targetWeight, setTargetWeight] = useState("")

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(age),
          weight: parseFloat(weight),
          height: parseFloat(height),
          gender,
          experience,
          goal,
          targetWeight: targetWeight ? parseFloat(targetWeight) : null,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to IronPath! 💪
          </h1>
          <p className="text-slate-300">
            Let's set up your profile to create personalized workouts
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-300">Step {step} of 2</span>
              <span className="text-sm text-slate-300">{step === 1 ? "50%" : "100%"}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-slate-500"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-slate-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-slate-500"
                    placeholder="70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-slate-500"
                    placeholder="175"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Training Experience
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["beginner", "intermediate", "advanced"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperience(level)}
                      className={`px-4 py-3 rounded-lg font-semibold transition ${
                        experience === level
                          ? "bg-white text-slate-900"
                          : "bg-slate-700 text-white hover:bg-slate-600"
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-white text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
              >
                Next →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Your Fitness Goal</h2>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-4">
                  What's your primary goal?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "bulk", label: "💪 Bulk", desc: "Gain muscle mass" },
                    { value: "cut", label: "🔥 Cut", desc: "Lose fat" },
                    { value: "maintain", label: "⚖️ Maintain", desc: "Stay fit" },
                    { value: "strength", label: "🏋️ Strength", desc: "Get stronger" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setGoal(option.value)}
                      className={`p-4 rounded-lg text-left transition ${
                        goal === option.value
                          ? "bg-white text-slate-900"
                          : "bg-slate-700 text-white hover:bg-slate-600"
                      }`}
                    >
                      <div className="font-semibold mb-1">{option.label}</div>
                      <div className="text-sm opacity-80">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {(goal === "bulk" || goal === "cut") && (
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Target Weight (kg) - Optional
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-slate-500"
                    placeholder={goal === "bulk" ? "80" : "65"}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-white text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-100 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Complete Setup ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
