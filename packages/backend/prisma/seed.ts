import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data
const sampleUsers = [
  { email: 'alice@example.com', name: 'Alice Johnson' },
  { email: 'bob@example.com', name: 'Bob Smith' },
  { email: 'charlie@example.com', name: 'Charlie Brown' },
  { email: 'diana@example.com', name: 'Diana Prince' },
  { email: 'eve@example.com', name: 'Eve Adams' },
];

const sampleFeatures = [
  {
    title: 'Dark Mode Support',
    description: 'Add a dark mode toggle to reduce eye strain during night-time studying sessions.',
  },
  {
    title: 'Export Study Data to PDF',
    description: 'Allow users to export their study progress and notes as a PDF document for offline review.',
  },
  {
    title: 'Pomodoro Timer Integration',
    description: 'Built-in pomodoro timer to help students manage their study sessions effectively.',
  },
  {
    title: 'Collaborative Study Groups',
    description: 'Create and join study groups where users can share resources and track progress together.',
  },
  {
    title: 'Mobile App Offline Mode',
    description: 'Allow the mobile app to work offline and sync when connection is restored.',
  },
  {
    title: 'AI-Powered Study Recommendations',
    description: 'Use AI to suggest study topics and resources based on user performance and goals.',
  },
  {
    title: 'Spaced Repetition Flashcards',
    description: 'Implement spaced repetition algorithm for flashcard reviews to improve retention.',
  },
  {
    title: 'Calendar Integration',
    description: 'Sync study sessions with Google Calendar and other calendar apps.',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.vote.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👤 Creating users...');
  const users = await Promise.all(
    sampleUsers.map((userData) =>
      prisma.user.create({
        data: userData,
      })
    )
  );
  console.log(`✅ Created ${users.length} users`);

  // Create features
  console.log('💡 Creating features...');
  const features = await Promise.all(
    sampleFeatures.map((featureData, index) =>
      prisma.feature.create({
        data: {
          ...featureData,
          createdById: users[index % users.length].id, // Distribute features among users
        },
      })
    )
  );
  console.log(`✅ Created ${features.length} features`);

  // Create votes - each user votes for exactly ONE feature
  console.log('🗳️  Creating votes (one per user)...');
  const voteCounts = new Map<string, number>();

  // Initialize vote counts
  features.forEach(f => voteCounts.set(f.id, 0));

  // Each user votes for a random feature
  for (const user of users) {
    const randomFeature = features[Math.floor(Math.random() * features.length)];

    await prisma.vote.create({
      data: {
        userId: user.id,
        featureId: randomFeature.id,
      },
    });

    // Increment vote count for this feature
    voteCounts.set(randomFeature.id, (voteCounts.get(randomFeature.id) || 0) + 1);
  }

  // Update feature vote counts
  for (const feature of features) {
    await prisma.feature.update({
      where: { id: feature.id },
      data: { voteCount: voteCounts.get(feature.id) || 0 },
    });
  }

  console.log(`✅ Created ${users.length} votes (one per user)`);

  // Display summary
  console.log('\n📊 Seed Summary:');
  console.log(`   Users: ${users.length}`);
  console.log(`   Features: ${features.length}`);
  console.log(`   Votes: ${users.length}`);

  // Display top features by votes
  console.log('\n🏆 Top Features by Votes:');
  const topFeatures = await prisma.feature.findMany({
    orderBy: { voteCount: 'desc' },
    take: 5,
    select: {
      title: true,
      voteCount: true,
    },
  });

  topFeatures.forEach((feature, index) => {
    console.log(`   ${index + 1}. ${feature.title} - ${feature.voteCount} votes`);
  });

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
