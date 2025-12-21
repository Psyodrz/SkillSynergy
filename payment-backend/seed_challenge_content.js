/**
 * Challenge Content Seed Script
 * 
 * Populates all existing challenges with milestones, tasks, and rewards.
 * Run once: node seed_challenge_content.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Sample challenge content templates based on category
const CHALLENGE_TEMPLATES = {
  'Tech & Development': {
    milestones: [
      {
        title: 'Getting Started',
        description: 'Set up your environment and learn the basics',
        tasks: [
          { title: 'Environment Setup', description: 'Install required tools and configure your workspace', type: 'exercise', content: { objective: 'Set up a complete development environment', instructions: ['Download and install the required IDE or editor', 'Configure your terminal/command line', 'Install necessary dependencies and packages', 'Verify your setup by running a test command'], hints: ['Check the official documentation for installation guides', 'Use a package manager like npm, pip, or brew'], resources: [{ title: 'Official Documentation', url: 'https://docs.example.com' }] } },
          { title: 'Core Concepts Overview', description: 'Understand the fundamental concepts', type: 'reading', content: { objective: 'Learn the foundational concepts', instructions: ['Read through the core concepts documentation', 'Take notes on key terminology', 'Identify 3 concepts you want to explore further'], hints: ['Focus on understanding why, not just how'], resources: [] } },
          { title: 'First Project', description: 'Build your first small project', type: 'project', content: { objective: 'Create a working mini-project', instructions: ['Start with a simple "Hello World" example', 'Add one additional feature', 'Test your code thoroughly', 'Document what you learned'], hints: ['Start simple and iterate', 'Don\'t be afraid to make mistakes'], resources: [] } }
        ]
      },
      {
        title: 'Intermediate Skills',
        description: 'Build on your foundation with more advanced topics',
        tasks: [
          { title: 'Advanced Patterns', description: 'Learn common patterns and best practices', type: 'reading', content: { objective: 'Master common patterns used by professionals', instructions: ['Study at least 3 common patterns', 'Implement each pattern in a small example', 'Compare their use cases'], hints: ['Look at open source projects for real examples'], resources: [] } },
          { title: 'Practical Exercise', description: 'Apply what you\'ve learned in a real scenario', type: 'exercise', content: { objective: 'Solve a real-world problem', instructions: ['Read the problem statement carefully', 'Plan your approach before coding', 'Implement your solution', 'Test edge cases'], hints: ['Break the problem into smaller parts'], resources: [] } }
        ]
      },
      {
        title: 'Final Project',
        description: 'Demonstrate your skills with a complete project',
        tasks: [
          { title: 'Project Planning', description: 'Design and plan your final project', type: 'exercise', content: { objective: 'Create a detailed project plan', instructions: ['Define your project scope', 'Create a list of features', 'Plan your timeline', 'Identify potential challenges'], hints: ['Start with MVP features only'], resources: [] } },
          { title: 'Implementation', description: 'Build your final project', type: 'project', content: { objective: 'Complete your project implementation', instructions: ['Follow your plan from the previous task', 'Implement core features first', 'Add polish and refinements', 'Document your work'], hints: ['Commit code frequently', 'Test as you go'], resources: [] } },
          { title: 'Presentation', description: 'Present your project and reflect on your learning', type: 'exercise', content: { objective: 'Share your project and learnings', instructions: ['Create a short demo or write-up', 'Highlight key features', 'Discuss challenges you overcame', 'Share what you would do differently'], hints: ['Focus on the journey, not just the result'], resources: [] } }
        ]
      }
    ],
    reward: { xp: 500, badge: '🏆 Tech Champion', certificate: true }
  },
  'Design & Creative': {
    milestones: [
      {
        title: 'Design Fundamentals',
        description: 'Master the core principles of design',
        tasks: [
          { title: 'Color Theory', description: 'Understanding colors and their psychological impact', type: 'reading', content: { objective: 'Learn how to use colors effectively', instructions: ['Study the color wheel', 'Learn about color harmony', 'Create 3 color palettes'], hints: ['Use tools like Coolors or Adobe Color'], resources: [] } },
          { title: 'Typography Basics', description: 'Learn to pair and use fonts effectively', type: 'reading', content: { objective: 'Master typography fundamentals', instructions: ['Learn about font categories', 'Practice font pairing', 'Understand readability principles'], hints: ['Less is more with typography'], resources: [] } },
          { title: 'Layout Exercise', description: 'Create a balanced layout composition', type: 'exercise', content: { objective: 'Apply visual hierarchy and balance', instructions: ['Create a simple webpage layout', 'Apply the rule of thirds', 'Ensure clear visual hierarchy'], hints: ['Use grids for alignment'], resources: [] } }
        ]
      },
      {
        title: 'Design Project',
        description: 'Apply your skills in a real design project',
        tasks: [
          { title: 'Research & Mood Board', description: 'Gather inspiration and create a mood board', type: 'exercise', content: { objective: 'Create a cohesive mood board', instructions: ['Collect 20+ inspiration images', 'Organize by theme or color', 'Extract key design elements', 'Define your design direction'], hints: ['Pinterest and Dribbble are great sources'], resources: [] } },
          { title: 'Design Mockup', description: 'Create your final design', type: 'project', content: { objective: 'Produce a polished design mockup', instructions: ['Apply all learned principles', 'Create at least 2 versions', 'Get feedback from peers', 'Iterate based on feedback'], hints: ['Don\'t skip the feedback step'], resources: [] } }
        ]
      }
    ],
    reward: { xp: 400, badge: '🎨 Creative Master', certificate: true }
  },
  'Business': {
    milestones: [
      {
        title: 'Business Foundations',
        description: 'Learn essential business concepts',
        tasks: [
          { title: 'Market Research', description: 'Learn how to analyze markets and competitors', type: 'reading', content: { objective: 'Conduct effective market research', instructions: ['Identify your target market', 'Analyze 3 competitors', 'Find market gaps and opportunities'], hints: ['Use free tools like Google Trends'], resources: [] } },
          { title: 'Business Model Canvas', description: 'Create a business model canvas', type: 'exercise', content: { objective: 'Map out a complete business model', instructions: ['Fill out all 9 sections', 'Focus on value proposition first', 'Validate assumptions'], hints: ['Start with what you know best'], resources: [] } }
        ]
      },
      {
        title: 'Financial Basics',
        description: 'Understand key financial concepts',
        tasks: [
          { title: 'Financial Statements', description: 'Learn to read financial statements', type: 'reading', content: { objective: 'Understand income statements and balance sheets', instructions: ['Study the 3 main financial statements', 'Analyze a real company example', 'Calculate key ratios'], hints: ['Focus on trends, not just numbers'], resources: [] } },
          { title: 'Budget Planning', description: 'Create a simple budget', type: 'exercise', content: { objective: 'Develop a realistic budget', instructions: ['List all expected income', 'Categorize expenses', 'Set savings goals', 'Plan for contingencies'], hints: ['Be conservative with income estimates'], resources: [] } }
        ]
      }
    ],
    reward: { xp: 350, badge: '💼 Business Pro', certificate: true }
  },
  'default': {
    milestones: [
      {
        title: 'Getting Started',
        description: 'Begin your learning journey',
        tasks: [
          { title: 'Introduction', description: 'Get familiar with the topic', type: 'reading', content: { objective: 'Understand the basics', instructions: ['Read the introductory materials', 'Take notes on key concepts', 'Identify your learning goals'], hints: ['Set clear goals to stay motivated'], resources: [] } },
          { title: 'First Exercise', description: 'Apply what you\'ve learned', type: 'exercise', content: { objective: 'Practice the fundamentals', instructions: ['Complete the practice exercise', 'Review your work', 'Note areas for improvement'], hints: ['Practice makes perfect'], resources: [] } }
        ]
      },
      {
        title: 'Deep Dive',
        description: 'Explore advanced topics',
        tasks: [
          { title: 'Advanced Concepts', description: 'Study more complex material', type: 'reading', content: { objective: 'Master advanced topics', instructions: ['Read advanced documentation', 'Compare different approaches', 'Summarize key takeaways'], hints: ['Build on your foundation'], resources: [] } },
          { title: 'Practical Application', description: 'Complete a hands-on project', type: 'project', content: { objective: 'Create something meaningful', instructions: ['Plan your project', 'Execute step by step', 'Document your process', 'Share your results'], hints: ['Start small, think big'], resources: [] } }
        ]
      }
    ],
    reward: { xp: 300, badge: '⭐ Challenge Complete', certificate: false }
  }
};

// Get appropriate template for a challenge based on its category
function getTemplate(category) {
  if (category && CHALLENGE_TEMPLATES[category]) {
    return CHALLENGE_TEMPLATES[category];
  }
  // Try partial match
  for (const key of Object.keys(CHALLENGE_TEMPLATES)) {
    if (category && category.includes(key.split(' ')[0])) {
      return CHALLENGE_TEMPLATES[key];
    }
  }
  return CHALLENGE_TEMPLATES['default'];
}

async function seedChallengeContent() {
  console.log('🚀 Starting challenge content seeding...\n');

  try {
    // First, add reward columns if they don't exist
    console.log('📋 Ensuring reward columns exist...');
    await pool.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS reward_xp INTEGER DEFAULT 100;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS reward_badge TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS reward_certificate BOOLEAN DEFAULT false;
    `);
    console.log('✅ Reward columns ready\n');

    // Get all projects (challenges) that don't have milestones
    const { rows: projects } = await pool.query(`
      SELECT p.id, p.title, p.description, p.category
      FROM projects p
      WHERE NOT EXISTS (
        SELECT 1 FROM challenge_milestones cm WHERE cm.project_id = p.id
      )
    `);

    console.log(`📊 Found ${projects.length} challenges without content\n`);

    let populated = 0;
    let failed = 0;

    for (const project of projects) {
      try {
        const template = getTemplate(project.category);
        console.log(`  📝 ${project.title}`);

        // Insert milestones and tasks
        for (let mIndex = 0; mIndex < template.milestones.length; mIndex++) {
          const milestone = template.milestones[mIndex];
          
          const { rows: milestoneRows } = await pool.query(`
            INSERT INTO challenge_milestones (project_id, title, description, order_index)
            VALUES ($1, $2, $3, $4)
            RETURNING id
          `, [project.id, milestone.title, milestone.description, mIndex]);

          const milestoneId = milestoneRows[0].id;

          for (let tIndex = 0; tIndex < milestone.tasks.length; tIndex++) {
            const task = milestone.tasks[tIndex];
            await pool.query(`
              INSERT INTO challenge_tasks (project_id, milestone_id, title, description, task_type, content, order_index)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [project.id, milestoneId, task.title, task.description, task.type, JSON.stringify(task.content), tIndex]);
          }
        }

        // Update rewards
        await pool.query(`
          UPDATE projects 
          SET reward_xp = $1, reward_badge = $2, reward_certificate = $3
          WHERE id = $4
        `, [template.reward.xp, template.reward.badge, template.reward.certificate, project.id]);

        console.log(`     ✓ Added ${template.milestones.length} milestones, ${template.milestones.reduce((a, m) => a + m.tasks.length, 0)} tasks, ${template.reward.xp} XP reward`);
        populated++;
      } catch (err) {
        console.error(`     ✗ Failed: ${err.message}`);
        failed++;
      }
    }

    console.log(`\n📊 Seeding Summary:`);
    console.log(`   ✅ Populated: ${populated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total: ${projects.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }

  console.log('\n🎉 Challenge content seeding complete!');
}

// Run the seeder
seedChallengeContent().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
