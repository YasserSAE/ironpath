import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const exercises = [
  // CHEST EXERCISES
  {
    name: "Barbell Bench Press",
    description: "The king of chest exercises. Lie on a flat bench and press the barbell up from your chest.",
    category: "strength",
    muscleGroup: "chest",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: "1. Lie on bench with feet flat on floor\n2. Grip bar slightly wider than shoulder width\n3. Lower bar to mid-chest\n4. Press up explosively\n5. Lock out at top"
  },
  {
    name: "Dumbbell Bench Press",
    description: "Similar to barbell bench press but with dumbbells for greater range of motion.",
    category: "strength",
    muscleGroup: "chest",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions: "1. Lie on bench with dumbbells at shoulder level\n2. Press dumbbells up until arms are extended\n3. Lower with control to starting position"
  },
  {
    name: "Incline Barbell Press",
    description: "Targets upper chest. Performed on an inclined bench.",
    category: "strength",
    muscleGroup: "chest",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: "1. Set bench to 30-45 degree incline\n2. Grip barbell slightly wider than shoulders\n3. Lower to upper chest\n4. Press up explosively"
  },
  {
    name: "Cable Chest Fly",
    description: "Isolation exercise for chest using cable machine.",
    category: "strength",
    muscleGroup: "chest",
    equipment: "cable",
    difficulty: "beginner",
    instructions: "1. Stand between cables set at shoulder height\n2. Grab handles with slight bend in elbows\n3. Bring hands together in front of chest\n4. Return to starting position with control"
  },
  {
    name: "Push-ups",
    description: "Classic bodyweight chest exercise.",
    category: "strength",
    muscleGroup: "chest",
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: "1. Start in plank position\n2. Lower body until chest nearly touches ground\n3. Push back up to starting position"
  },

  // BACK EXERCISES
  {
    name: "Deadlift",
    description: "Compound exercise that works the entire posterior chain.",
    category: "strength",
    muscleGroup: "back",
    equipment: "barbell",
    difficulty: "advanced",
    instructions: "1. Stand with feet hip-width apart, bar over mid-foot\n2. Bend down and grip bar\n3. Keep back straight, drive through heels\n4. Stand up fully, pulling bar up your legs\n5. Lower with control"
  },
  {
    name: "Barbell Row",
    description: "Build a thick, strong back with barbell rows.",
    category: "strength",
    muscleGroup: "back",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: "1. Bend forward at hips with slight knee bend\n2. Grip bar slightly wider than shoulders\n3. Pull bar to lower chest/upper abs\n4. Lower with control"
  },
  {
    name: "Pull-ups",
    description: "Upper back and lat developer using bodyweight.",
    category: "strength",
    muscleGroup: "back",
    equipment: "bodyweight",
    difficulty: "intermediate",
    instructions: "1. Hang from bar with overhand grip\n2. Pull yourself up until chin clears bar\n3. Lower with control to full extension"
  },
  {
    name: "Lat Pulldown",
    description: "Machine-based back exercise great for beginners.",
    category: "strength",
    muscleGroup: "back",
    equipment: "machine",
    difficulty: "beginner",
    instructions: "1. Sit at lat pulldown machine\n2. Grip bar wider than shoulders\n3. Pull bar down to upper chest\n4. Return to starting position with control"
  },
  {
    name: "Seated Cable Row",
    description: "Mid-back builder using cable machine.",
    category: "strength",
    muscleGroup: "back",
    equipment: "cable",
    difficulty: "beginner",
    instructions: "1. Sit at cable row machine\n2. Grip handle with both hands\n3. Pull handle to torso while keeping back straight\n4. Return with control"
  },

  // LEG EXERCISES
  {
    name: "Barbell Squat",
    description: "The king of leg exercises. Builds overall leg mass and strength.",
    category: "strength",
    muscleGroup: "legs",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: "1. Bar on upper back, feet shoulder-width apart\n2. Bend knees and hips to lower down\n3. Go until thighs are parallel or below\n4. Drive through heels to stand up"
  },
  {
    name: "Leg Press",
    description: "Machine-based quad and glute developer.",
    category: "strength",
    muscleGroup: "legs",
    equipment: "machine",
    difficulty: "beginner",
    instructions: "1. Sit in leg press machine\n2. Place feet shoulder-width on platform\n3. Lower platform with control\n4. Press back up until legs are nearly extended"
  },
  {
    name: "Romanian Deadlift",
    description: "Hamstring and glute focused deadlift variation.",
    category: "strength",
    muscleGroup: "legs",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: "1. Hold barbell at hip level\n2. Hinge at hips, lowering bar down legs\n3. Keep slight knee bend, back straight\n4. Feel stretch in hamstrings\n5. Drive hips forward to return"
  },
  {
    name: "Leg Curl",
    description: "Isolation exercise for hamstrings.",
    category: "strength",
    muscleGroup: "legs",
    equipment: "machine",
    difficulty: "beginner",
    instructions: "1. Lie face down on leg curl machine\n2. Place ankles under pad\n3. Curl legs up toward glutes\n4. Lower with control"
  },
  {
    name: "Leg Extension",
    description: "Quad isolation using machine.",
    category: "strength",
    muscleGroup: "legs",
    equipment: "machine",
    difficulty: "beginner",
    instructions: "1. Sit in leg extension machine\n2. Place ankles under pad\n3. Extend legs until straight\n4. Lower with control"
  },

  // SHOULDER EXERCISES
  {
    name: "Overhead Press",
    description: "Compound shoulder exercise with barbell.",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: "1. Start with bar at shoulder level\n2. Press bar overhead until arms are extended\n3. Lower with control to shoulders"
  },
  {
    name: "Dumbbell Shoulder Press",
    description: "Press dumbbells overhead to build shoulder mass.",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions: "1. Hold dumbbells at shoulder height\n2. Press overhead until arms extended\n3. Lower with control"
  },
  {
    name: "Lateral Raise",
    description: "Isolation for side delts.",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions: "1. Hold dumbbells at sides\n2. Raise arms out to sides until parallel to ground\n3. Lower with control"
  },
  {
    name: "Face Pulls",
    description: "Rear delt and upper back exercise.",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: "cable",
    difficulty: "beginner",
    instructions: "1. Set cable at face height\n2. Pull rope toward face, separating ends\n3. Squeeze shoulder blades together\n4. Return with control"
  },

  // ARM EXERCISES
  {
    name: "Barbell Curl",
    description: "Classic bicep builder.",
    category: "strength",
    muscleGroup: "arms",
    equipment: "barbell",
    difficulty: "beginner",
    instructions: "1. Hold barbell with underhand grip\n2. Curl bar up toward shoulders\n3. Lower with control"
  },
  {
    name: "Tricep Dips",
    description: "Bodyweight tricep exercise.",
    category: "strength",
    muscleGroup: "arms",
    equipment: "bodyweight",
    difficulty: "intermediate",
    instructions: "1. Support yourself on parallel bars\n2. Lower body by bending elbows\n3. Push back up to starting position"
  },
  {
    name: "Cable Tricep Pushdown",
    description: "Isolation exercise for triceps.",
    category: "strength",
    muscleGroup: "arms",
    equipment: "cable",
    difficulty: "beginner",
    instructions: "1. Stand at cable machine with rope or bar\n2. Push down until arms are extended\n3. Return with control"
  },
  {
    name: "Hammer Curl",
    description: "Bicep and forearm developer.",
    category: "strength",
    muscleGroup: "arms",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions: "1. Hold dumbbells with neutral grip (palms facing each other)\n2. Curl up toward shoulders\n3. Lower with control"
  },

  // CORE EXERCISES
  {
    name: "Plank",
    description: "Core stability exercise.",
    category: "strength",
    muscleGroup: "core",
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: "1. Rest on forearms and toes\n2. Keep body in straight line\n3. Hold position for time"
  },
  {
    name: "Hanging Leg Raise",
    description: "Advanced ab exercise.",
    category: "strength",
    muscleGroup: "core",
    equipment: "bodyweight",
    difficulty: "advanced",
    instructions: "1. Hang from pull-up bar\n2. Raise legs up to 90 degrees\n3. Lower with control"
  },
  {
    name: "Cable Crunch",
    description: "Ab exercise using cable machine.",
    category: "strength",
    muscleGroup: "core",
    equipment: "cable",
    difficulty: "beginner",
    instructions: "1. Kneel below cable machine\n2. Hold rope behind head\n3. Crunch down, bringing elbows toward knees\n4. Return with control"
  },
]

async function main() {
  console.log('Start seeding exercise library...')

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    })
  }

  console.log(`✅ Seeded ${exercises.length} exercises`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
