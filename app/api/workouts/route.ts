import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const workoutSchema = z.object({
  name: z.string().min(1),
  exercises: z.array(
    z.object({
      exerciseId: z.string(),
      name: z.string(),
      sets: z.array(
        z.object({
          reps: z.number(),
          weight: z.number(),
          completed: z.boolean(),
        })
      ),
    })
  ),
  completed: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, exercises, completed } = workoutSchema.parse(body)

    // Create workout
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        name,
        completed: completed || false,
        date: new Date(),
      },
    })

    // Create workout exercises
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i]

      for (const set of exercise.sets) {
        await prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: exercise.exerciseId,
            sets: 1,
            reps: set.reps,
            weight: set.weight,
            completed: set.completed,
            order: i,
          },
        })
      }
    }

    return NextResponse.json({ workout }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Workout creation error:", error)
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ workouts: user.workouts })
  } catch (error) {
    console.error("Error fetching workouts:", error)
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    )
  }
}
