"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LogProgressPage() {
  const router = useRouter()
  const [weight, setWeight] = useState("")
  const [bodyFat, setBodyFat] = useState("")
  const [chest, setChest] = useState("")
  const [waist, setWaist] = useState("")
  const [hips, setHips] = useState("")
  const [biceps, setBiceps] = useState("")
  const [thighs, setThighs] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : null,
          bodyFat: bodyFat ? parseFloat(bodyFat) : null,
          chest: chest ? parseFloat(chest) : null,
          waist: waist ? parseFloat(waist) : null,
          hips: hips ? parseFloat(hips) : null,
          biceps: biceps ? parseFloat(biceps) : null,
          thighs: thighs ? parseFloat(thighs) : null,
          notes: notes || null,
        }),
      })

      if (response.ok) {
        router.push("/progress")
        router.refresh()
      } else {
        alert("Failed to save progress")
      }
    } catch (error) {
      console.error("Error saving progress:", error)
      alert("Failed to save progress")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <nav className="bg-slate-900 border-b border-slate-700 p-4">
        <div className="container mx-auto">
          <Link href="/progress" className="text-white hover:text-slate-300">
            ← Back to Progress
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">📝 Log Body Metrics</h1>

          <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                    placeholder="70.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Body Fat %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                    placeholder="15.0"
                  />
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Measurements (cm) - Optional
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Chest
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Waist
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                      placeholder="80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Hips
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                      placeholder="95"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Biceps
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={biceps}
                      onChange={(e) => setBiceps(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                      placeholder="35"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Thighs
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={thighs}
                      onChange={(e) => setThighs(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                      placeholder="55"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                  placeholder="How are you feeling? Any changes noticed?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 disabled:opacity-50 text-lg"
              >
                {loading ? "Saving..." : "💾 Save Progress"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
