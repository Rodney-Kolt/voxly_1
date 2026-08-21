/**
 * Script to add a sample Ronaldo vs Messi poll to Firestore
 * Run with: node scripts/add-sample-poll.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH;

if (!serviceAccountPath) {
  console.error('❌ Error: FIREBASE_ADMIN_KEY_PATH environment variable not set');
  console.log('Please set FIREBASE_ADMIN_KEY_PATH to your service account JSON file');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function addSamplePoll() {
  try {
    console.log('📝 Adding sample poll to Firestore...\n');

    // Sample user ID (you can change this)
    const userId = 'sample-user-123';
    const pollId = 'ronaldo-vs-messi-' + Date.now();

    // Create sample poll
    const pollData = {
      userId,
      question: 'Who is the GOAT? Ronaldo or Messi?',
      options: ['Cristiano Ronaldo', 'Lionel Messi'],
      imageUrl:
        'https://images.unsplash.com/photo-1579953346881-04a9c73ea437?w=500&h=300&fit=crop',
      createdAt: admin.firestore.Timestamp.now(),
      isBoosted: false,
      totalVotes: 0,
    };

    // Add poll
    const pollRef = db.collection('polls').doc(pollId);
    await pollRef.set(pollData);
    console.log(`✅ Poll created: ${pollId}`);
    console.log(`   Question: "${pollData.question}"`);
    console.log(`   Options: ${pollData.options.join(', ')}`);

    // Add sample votes
    console.log('\n📊 Adding sample votes...\n');

    const votes = [
      { optionIndex: 0, userId: 'user-1' }, // Ronaldo
      { optionIndex: 1, userId: 'user-2' }, // Messi
      { optionIndex: 0, userId: 'user-3' }, // Ronaldo
      { optionIndex: 0, userId: 'user-4' }, // Ronaldo
      { optionIndex: 1, userId: 'user-5' }, // Messi
      { optionIndex: 0, userId: 'user-6' }, // Ronaldo
      { optionIndex: 1, userId: 'user-7' }, // Messi
      { optionIndex: 0, userId: 'user-8' }, // Ronaldo
    ];

    for (const vote of votes) {
      const voteRef = db.collection('votes').doc();
      await voteRef.set({
        pollId,
        userId: vote.userId,
        optionIndex: vote.optionIndex,
        createdAt: admin.firestore.Timestamp.now(),
      });
    }

    console.log(`✅ Added ${votes.length} sample votes`);
    console.log(
      `   Ronaldo: ${votes.filter((v) => v.optionIndex === 0).length} votes`
    );
    console.log(
      `   Messi: ${votes.filter((v) => v.optionIndex === 1).length} votes`
    );

    // Add sample comments
    console.log('\n💬 Adding sample comments...\n');

    const comments = [
      {
        body: 'Ronaldo is the most complete player ever!',
        userId: 'user-1',
      },
      {
        body: 'Messi is pure magic on the field',
        userId: 'user-2',
      },
      {
        body: 'Ronaldo has more goals and trophies',
        userId: 'user-3',
      },
      {
        body: 'Messi won the World Cup though!',
        userId: 'user-4',
      },
    ];

    for (const comment of comments) {
      const commentRef = db.collection('comments').doc();
      await commentRef.set({
        pollId,
        userId: comment.userId,
        body: comment.body,
        createdAt: admin.firestore.Timestamp.now(),
        userDisplayName: `User ${comment.userId}`,
      });
    }

    console.log(`✅ Added ${comments.length} sample comments`);

    console.log('\n🎉 Sample poll created successfully!');
    console.log(`\n📱 View the poll at: http://localhost:3000/poll/${pollId}`);
    console.log(`\n✨ You can now:`);
    console.log(`   • Vote on the poll`);
    console.log(`   • Add comments`);
    console.log(`   • React to comments`);
    console.log(`   • Boost the poll for KES 100!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample poll:', error);
    process.exit(1);
  }
}

addSamplePoll();
