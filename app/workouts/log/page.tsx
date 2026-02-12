"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
}

export default function LogWorkoutPage() {
  const router = useRouter()
  const [workoutName, setWorkoutName] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercises, setSelectedExercises] = useState<any[]>([])
  const [showExerciseList, setShowExerciseList] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const response = await fetch("/api/exercises")
      const data = await response.json()
      setExercises(data.exercises || [])
    } catch (error) {
      console.error("Error fetching exercises:", error)
    }
  }

  const addExercise = (exercise: Exercise) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        sets: [{ reps: 10, weight: 0, completed: false }],
      },
    ])
    setShowExerciseList(false)
    setSearchQuery("")
  }

  const addSet = (exerciseIndex: number) => {
    const updated = [...selectedExercises]
    updated[exerciseIndex].sets.push({ reps: 10, weight: 0, completed: false })
    setSelectedExercises(updated)
  }

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    const updated = [...selectedExercises]
    updated[exerciseIndex].sets[setIndex][field] = value
    setSelectedExercises(updated)
  }

  const removeExercise = (exerciseIndex: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== exerciseIndex))
  }

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      alert("Please enter a workout name")
      return
    }

    if (selectedExercises.length === 0) {
      alert("Please add at least one exercise")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workoutName,
          exercises: selectedExercises,
          completed: true,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        alert("Failed to save workout")
      }
    } catch (error) {
      console.error("Error saving workout:", error)
      alert("Failed to save workout")
    } finally {
      setLoading(false)
    }
  }

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <nav className="bg-slate-900 border-b border-slate-700 p-4">
        <div className="container mx-auto">
          <Link href="/dashboard" className="text-white hover:text-slate-300">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">✍️ Log Workout</h1>

          {/* Workout Name */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Push Day, Leg Day, Upper Body"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* Selected Exercises */}
          {selectedExercises.map((exercise, exIndex) => (
            <div
              key={exIndex}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-4"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {exIndex + 1}. {exercise.name}
                </h3>
                <button
                  onClick={() => removeExercise(exIndex)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-3">
                {exercise.sets.map((set: any, setIndex: number) => (
                  <div
                    key={setIndex}
                    className="grid grid-cols-4 gap-4 items-center bg-slate-900 p-3 rounded"
                  >
                    <div className="text-slate-300">Set {setIndex + 1}</div>
                    <div>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(exIndex, setIndex, "reps", parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                        placeholder="Reps"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.5"
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(exIndex, setIndex, "weight", parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                        placeholder="Weight (kg)"
                      />
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          updateSet(exIndex, setIndex, "completed", !set.completed)
                        }
                        className={`px-4 py-2 rounded font-semibold w-full ${
                          set.completed
                            ? "bg-green-500 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {set.completed ? "✓ Done" : "Mark Done"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addSet(exIndex)}
                className="mt-3 w-full py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                + Add Set
              </button>
            </div>
          ))}

          {/* Add Exercise Button */}
          <button
            onClick={() => setShowExerciseList(true)}
            className="w-full py-4 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 mb-6"
          >
            + Add Exercise
          </button>

          {/* Exercise Selection Modal */}
          {showExerciseList && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Select Exercise</h2>
                    <button
                      onClick={() => setShowExerciseList(false)}
                      className="text-slate-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search exercises..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-iron-500 focus:outline-none focus:border-slate-500"
                  />
                </div>
                <div className="overflow-y-auto max-h-96 p-6">
                  {filteredExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => addExercise(exercise)}
                      className="w-full text-left p-4 bg-slate-900 hover:bg-slate-700 rounded-lg mb-2 border border-slate-700"
                    >
                      <div className="font-semibold text-white">{exercise.name}</div>
                      <div className="text-sm text-slate-400">
                        {exercise.muscleGroup} • {exercise.equipment}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {selectedExercises.length > 0 && (
            <button
              onClick={saveWorkout}
              disabled={loading}
              className="w-full py-4 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 disabled:opacity-50 text-lg"
            >
              {loading ? "Saving..." : "💾 Save Workout"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
