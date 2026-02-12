import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateWorkoutPlan, WorkoutPlanInput } from "@/lib/ai/workout-generator"
import { z } from "zod"

const generatePlanSchema = z.object({
  daysPerWeek: z.number().min(1).max(7),
  duration: z.number().min(1).max(52),
  targetMuscleGroups: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
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
    const { daysPerWeek, duration, targetMuscleGroups, equipment } =
      generatePlanSchema.parse(body)

    // Prepare input for AI
    const input: WorkoutPlanInput = {
      goal: (user.goal as "bulk" | "cut" | "maintain" | "strength") || "maintain",
      experience:
        (user.experience as "beginner" | "intermediate" | "advanced") ||
        "beginner",
      daysPerWeek,
      duration,
      targetMuscleGroups,
      equipment,
      userProfile: {
        age: user.age || undefined,
        weight: user.weight || undefined,
        height: user.height || undefined,
        gender: user.gender || undefined,
      },
    }

    // Generate plan using AI
    const aiPlan = await generateWorkoutPlan(input)

    // Save to database
    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        userId: user.id,
        name: aiPlan.name,
        description: aiPlan.description || "",
        goal: aiPlan.goal,
        daysPerWeek: aiPlan.daysPerWeek,
        duration: aiPlan.duration,
        aiGenerated: true,
        aiPrompt: JSON.stringify(input),
        planData: JSON.stringify(aiPlan),
      },
    })

    return NextResponse.json({
      plan: aiPlan,
      id: workoutPlan.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Plan generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate workout plan" },
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
        workoutPlans: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const plans = user.workoutPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      goal: plan.goal,
      daysPerWeek: plan.daysPerWeek,
      duration: plan.duration,
      createdAt: plan.createdAt,
      planData: JSON.parse(plan.planData),
    }))

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    )
  }
}
