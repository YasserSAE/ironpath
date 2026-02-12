import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const progressSchema = z.object({
  weight: z.number().positive().optional().nullable(),
  bodyFat: z.number().min(0).max(100).optional().nullable(),
  chest: z.number().positive().optional().nullable(),
  waist: z.number().positive().optional().nullable(),
  hips: z.number().positive().optional().nullable(),
  biceps: z.number().positive().optional().nullable(),
  thighs: z.number().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
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
    const data = progressSchema.parse(body)

    const progressLog = await prisma.progressLog.create({
      data: {
        userId: user.id,
        ...data,
      },
    })

    return NextResponse.json({ log: progressLog }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Progress log error:", error)
    return NextResponse.json(
      { error: "Failed to create progress log" },
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
        progressLogs: {
          orderBy: { date: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ logs: user.progressLogs })
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}
