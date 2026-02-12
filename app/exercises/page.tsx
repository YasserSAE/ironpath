"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Exercise {
  id: string
  name: string
  description: string
  category: string
  muscleGroup: string
  equipment: string
  difficulty: string
  instructions: string
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMuscle, setSelectedMuscle] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState("all")
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    fetchExercises()
  }, [])

  useEffect(() => {
    filterExercises()
  }, [exercises, searchQuery, selectedMuscle, selectedEquipment])

  const fetchExercises = async () => {
    try {
      const response = await fetch("/api/exercises")
      const data = await response.json()
      setExercises(data.exercises || [])
      setFilteredExercises(data.exercises || [])
    } catch (error) {
      console.error("Error fetching exercises:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterExercises = () => {
    let filtered = exercises

    if (searchQuery) {
      filtered = filtered.filter((ex) =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedMuscle !== "all") {
      filtered = filtered.filter((ex) => ex.muscleGroup === selectedMuscle)
    }

    if (selectedEquipment !== "all") {
      filtered = filtered.filter((ex) => ex.equipment === selectedEquipment)
    }

    setFilteredExercises(filtered)
  }

  const muscleGroups = ["all", ...Array.from(new Set(exercises.map((e) => e.muscleGroup)))]
  const equipmentTypes = ["all", ...Array.from(new Set(exercises.map((e) => e.equipment)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading exercises...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Futuristic background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <nav className="relative backdrop-blur-lg bg-slate-900/50 border-b border-slate-700/50 p-4">
        <div className="container mx-auto">
          <Link href="/dashboard" className="text-white hover:text-blue-400 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="relative container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            📚 Exercise Library
          </h1>
          <p className="text-slate-300 text-lg">Browse {exercises.length} exercises to build your perfect workout</p>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mb-8 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises..."
                className="w-full px-4 py-3 bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Muscle Group
              </label>
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                {muscleGroups.map((muscle) => (
                  <option key={muscle} value={muscle}>
                    {muscle === "all" ? "All Muscles" : muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Equipment
              </label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                {equipmentTypes.map((equipment) => (
                  <option key={equipment} value={equipment}>
                    {equipment === "all" ? "All Equipment" : equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="group backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-700/50 p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 text-left transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                  {exercise.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  exercise.difficulty === "beginner"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : exercise.difficulty === "intermediate"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {exercise.difficulty}
                </span>
              </div>

              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {exercise.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">
                  {exercise.muscleGroup}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
                  {exercise.equipment}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 backdrop-blur-xl bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <p className="text-slate-400 text-lg">No exercises found matching your filters</p>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700/50 shadow-2xl">
            <div className="p-8 border-b border-slate-700/50">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {selectedExercise.name}
                </h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-slate-400 hover:text-white text-3xl transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                  {selectedExercise.muscleGroup}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                  {selectedExercise.equipment}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedExercise.difficulty === "beginner"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : selectedExercise.difficulty === "intermediate"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {selectedExercise.difficulty}
                </span>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-slate-300 leading-relaxed">{selectedExercise.description}</p>
              </div>

              {selectedExercise.instructions && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Instructions</h3>
                  <div className="text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                    {selectedExercise.instructions}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
