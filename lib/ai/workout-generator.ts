import Anthropic from "@anthropic-ai/sdk"

export interface WorkoutPlanInput {
  goal: "bulk" | "cut" | "maintain" | "strength"
  experience: "beginner" | "intermediate" | "advanced"
  daysPerWeek: number
  duration: number // weeks
  targetMuscleGroups?: string[]
  equipment?: string[] // available equipment
  userProfile?: {
    age?: number
    weight?: number
    height?: number
    gender?: string
  }
}

export interface WorkoutDay {
  day: number
  name: string
  focus: string
  exercises: Array<{
    name: string
    sets: number
    reps: string // can be "8-12" or "AMRAP" etc
    rest: string // e.g., "60s"
    notes?: string
    machine?: string // specific machine or equipment
  }>
}

export interface WorkoutPlan {
  name: string
  description: string
  goal: string
  duration: number
  daysPerWeek: number
  workouts: WorkoutDay[]
  tips: string[]
  nutritionTips?: string[]
}

export async function generateWorkoutPlan(
  input: WorkoutPlanInput
): Promise<WorkoutPlan> {
  const prompt = `You are an expert personal trainer and strength coach. Create a detailed, personalized workout plan based on the following information:

**User Goal:** ${input.goal.toUpperCase()}
**Experience Level:** ${input.experience}
**Days Per Week:** ${input.daysPerWeek}
**Program Duration:** ${input.duration} weeks
${input.userProfile?.age ? `**Age:** ${input.userProfile.age}` : ""}
${input.userProfile?.weight ? `**Current Weight:** ${input.userProfile.weight}kg` : ""}
${input.userProfile?.gender ? `**Gender:** ${input.userProfile.gender}` : ""}
${input.targetMuscleGroups?.length ? `**Focus Areas:** ${input.targetMuscleGroups.join(", ")}` : ""}
${input.equipment?.length ? `**Available Equipment:** ${input.equipment.join(", ")}` : "**Available Equipment:** Full gym access"}

Create a comprehensive workout plan that includes:

1. A catchy plan name and motivating description
2. ${input.daysPerWeek} workout days with specific exercises
3. For EACH exercise, specify:
   - Exercise name
   - Sets and reps (specific numbers, like "3 sets of 8-12 reps")
   - Rest time between sets (e.g., "90s", "2 minutes")
   - Specific machine/equipment to use (e.g., "Leg Press Machine", "Barbell", "Cable Machine")
   - Brief form/technique notes if important

4. General training tips for this goal
5. Brief nutrition tips for ${input.goal}

IMPORTANT FORMATTING:
- Be very specific about machines and equipment
- Use proper progressive overload principles
- Match volume to experience level
- For bulk: Focus on compound movements, moderate-high volume
- For cut: Mix of strength and conditioning, maintain muscle
- For strength: Lower reps (3-6), longer rest, heavier weight
- For maintain: Balanced approach

Return the response as a valid JSON object with this exact structure:
{
  "name": "Plan Name",
  "description": "Motivating description",
  "goal": "${input.goal}",
  "duration": ${input.duration},
  "daysPerWeek": ${input.daysPerWeek},
  "workouts": [
    {
      "day": 1,
      "name": "Day Name (e.g., Push Day, Leg Day)",
      "focus": "Main muscle groups",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 4,
          "reps": "8-12",
          "rest": "90s",
          "machine": "Specific machine or equipment",
          "notes": "Form tips or important notes"
        }
      ]
    }
  ],
  "tips": ["Training tip 1", "Training tip 2"],
  "nutritionTips": ["Nutrition tip 1", "Nutrition tip 2"]
}

Return ONLY the JSON, no additional text.`

  try {
    // Initialize Anthropic client with API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set")
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude")
    }

    // Extract JSON from the response
    let jsonText = content.text.trim()

    // Remove markdown code blocks if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "")
    }

    const plan: WorkoutPlan = JSON.parse(jsonText)
    return plan
  } catch (error) {
    console.error("Error generating workout plan:", error)
    throw new Error("Failed to generate workout plan")
  }
}
