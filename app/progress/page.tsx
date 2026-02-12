"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function ProgressPage() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [progressLogs, setProgressLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [workoutsRes, progressRes] = await Promise.all([
        fetch("/api/workouts"),
        fetch("/api/progress"),
      ])

      const workoutsData = await workoutsRes.json()
      const progressData = await progressRes.json()

      setWorkouts(workoutsData.workouts || [])
      setProgressLogs(progressData.logs || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalWorkouts = workouts.length
  const completedWorkouts = workouts.filter((w) => w.completed).length
  const thisWeekWorkouts = workouts.filter((w) => {
    const workoutDate = new Date(w.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return workoutDate >= weekAgo
  }).length

  // Prepare chart data for workouts per week
  const getWorkoutsPerWeek = () => {
    const weeks: any = {}
    workouts.forEach((workout) => {
      const date = new Date(workout.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!weeks[weekKey]) {
        weeks[weekKey] = { date: weekKey, count: 0 }
      }
      weeks[weekKey].count++
    })

    return Object.values(weeks).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    )
  }

  // Prepare weight progress chart data
  const weightData = progressLogs
    .filter((log) => log.weight)
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString(),
      weight: log.weight,
    }))
    .reverse()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iron-950 via-iron-900 to-iron-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-iron-950 via-iron-900 to-iron-800">
      <nav className="bg-iron-900 border-b border-iron-700 p-4">
        <div className="container mx-auto">
          <Link href="/dashboard" className="text-white hover:text-iron-300">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">📊 Your Progress</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-iron-800 rounded-lg p-6 border border-iron-700">
            <h3 className="text-iron-400 text-sm mb-2">Total Workouts</h3>
            <p className="text-4xl font-bold text-white">{totalWorkouts}</p>
          </div>

          <div className="bg-iron-800 rounded-lg p-6 border border-iron-700">
            <h3 className="text-iron-400 text-sm mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-400">{completedWorkouts}</p>
          </div>

          <div className="bg-iron-800 rounded-lg p-6 border border-iron-700">
            <h3 className="text-iron-400 text-sm mb-2">This Week</h3>
            <p className="text-4xl font-bold text-white">{thisWeekWorkouts}</p>
          </div>
        </div>

        {/* Workouts Per Week Chart */}
        <div className="bg-iron-800 rounded-lg p-6 border border-iron-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Workouts Per Week</h2>
          {getWorkoutsPerWeek().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getWorkoutsPerWeek()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475f81" />
                <XAxis dataKey="date" stroke="#aabace" />
                <YAxis stroke="#aabace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#334258",
                    border: "1px solid #475f81",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#fff"
                  strokeWidth={2}
                  name="Workouts"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-iron-400">
              No workout data yet. Start logging workouts to see your progress!
            </div>
          )}
        </div>

        {/* Weight Progress Chart */}
        {weightData.length > 0 && (
          <div className="bg-iron-800 rounded-lg p-6 border border-iron-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Weight Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475f81" />
                <XAxis dataKey="date" stroke="#aabace" />
                <YAxis stroke="#aabace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#334258",
                    border: "1px solid #475f81",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#5b789a"
                  strokeWidth={2}
                  name="Weight (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Workouts List */}
        <div className="bg-iron-800 rounded-lg p-6 border border-iron-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Workouts</h2>
          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.slice(0, 10).map((workout) => (
                <div
                  key={workout.id}
                  className="bg-iron-900 p-4 rounded-lg border border-iron-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-white">{workout.name}</h3>
                      <p className="text-sm text-iron-400">
                        {new Date(workout.date).toLocaleDateString()} •{" "}
                        {workout.exercises?.length || 0} exercises
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        workout.completed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {workout.completed ? "✓ Completed" : "In Progress"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-iron-400 mb-4">No workouts logged yet!</p>
              <Link
                href="/workouts/log"
                className="inline-block px-6 py-3 bg-white text-iron-900 rounded-lg font-semibold hover:bg-iron-100"
              >
                Log Your First Workout
              </Link>
            </div>
          )}
        </div>

        {/* Log Progress Button */}
        <div className="mt-8">
          <Link
            href="/progress/log"
            className="block w-full py-4 bg-white text-iron-900 text-center rounded-lg font-semibold hover:bg-iron-100"
          >
            📝 Log Body Metrics
          </Link>
        </div>
      </div>
    </div>
  )
}
