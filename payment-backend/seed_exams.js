/**
 * Comprehensive Exam Content Seeder
 * Populates Skills, Challenges, and Deep Task Content for:
 * SSC, Railway, Banking, UPSC (IAS/IPS), JEE, NEET, Police, etc.
 * 
 * V2: REPLACES placeholders with REAL, DEPTH CONTENT.
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const SKILLS_TO_SEED = [
  // Competitive Exams
  { name: 'SSC Preparation', category: 'Academics & Exams', level: 'Intermediate', description: 'Comprehensive preparation for Staff Selection Commission exams.' },
  { name: 'UPSC Civil Services', category: 'Academics & Exams', level: 'Advanced', description: 'Preparation for IAS, IPS, and IFS services.' },
  { name: 'Banking Exams (IBPS/SBI)', category: 'Academics & Exams', level: 'Intermediate', description: 'Preparation for PO and Clerk exams in banking sector.' },
  { name: 'Railway Recruitment (RRB)', category: 'Academics & Exams', level: 'Intermediate', description: 'Preparation for NTPC and Group D railway exams.' },
  { name: 'State Police Exams', category: 'Academics & Exams', level: 'Intermediate', description: 'Preparation for SI and Constable exams.' },
  { name: 'JEE Advanced Physics', category: 'Academics & Exams', level: 'Advanced', description: 'In-depth physics for IIT Joint Entrance Exam.' },
  { name: 'NEET Biology', category: 'Academics & Exams', level: 'Advanced', description: 'Comprehensive biology for medical entrance.' },
  { name: 'IPO Analysis', category: 'Personal Finance', level: 'Advanced', description: 'Analyzing Initial Public Offerings for investment.' }
];

const EXAM_CHALLENGES = [
  {
    title: 'SSC CGL: 60-Day Crash Course',
    description: 'Complete roadmap to crack SSC Combined Graduate Level exam including Quant, Reasoning, English, and GA.',
    category: 'Academics & Exams',
    difficulty: 'Intermediate',
    max_members: 100,
    visibility: 'public',
    status: 'active',

    milestones: [
      {
        title: 'Quantitative Aptitude - Arithmetic Mastery',
        description: 'Deep dive into Percentage, Profit & Loss, and SI/CI.',
        tasks: [
          {
            title: 'Percentage Problem Set 1 - Basics',
            task_type: 'exercise',
            description: 'Solve 10 foundational percentage problems.',
            content: {
              objective: 'Solve the following 10 percentage problems correctly.',
              instructions: [
                 'Solve each problem without using a calculator.',
                 'Note the time taken for each question.',
                 'Total Time Limit: 20 Minutes.'
              ],
              hints: ['Use fraction equivalence: 16.66% = 1/6, 14.28% = 1/7, 12.5% = 1/8'],
              questions: [
                 '1. If A\'s salary is 25% more than B\'s, by what percentage is B\'s salary less than A\'s?',
                 '2. A number is increased by 20% and then decreased by 20%. What is the net percentage change?',
                 '3. If 16.66% of a number is added to itself, the result is 4956. Find the original number.',
                 '4. If the side of a square is increased by 40%, find the % change in its area.',
                 '5. In an election between two candidates, one got 55% of the total valid votes, 20% of the votes were invalid. If the total number of votes was 7500, the number of valid votes that the other candidate got was?',
                 '6. A student has to obtain 33% of the total marks to pass. He got 125 marks and failed by 40 marks. The maximum marks are?',
                 '7. The population of a town increases by 5% every year. If the present population is 9261, the population 3 years ago was?',
                 '8. If the price of sugar increases by 20%, by how much % should a housewife reduce her consumption so that expenditure remains constant?',
                 '9. Two numbers are respectively 20% and 50% more than a third number. The ratio of the two numbers is?',
                 '10. A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had how many apples?'
              ]
            }
          },
          {
            title: 'Percentage Problem Set 2 - Advanced',
            task_type: 'exercise',
            description: 'Solve 5 advanced level percentage problems.',
            content: {
              objective: 'Crack these Mains-level questions.',
              instructions: ['Focus on accuracy over speed for this set.'],
              questions: [
                 '1. In a class of 60 students, 40% are girls. The average weight of the whole class is 59.2 kg and the average weight of the girls is 55 kg. What is the average weight of the boys?',
                 '2. A reduction of 20% in the price of sugar enables a purchaser to obtain 4 kg more for Rs. 160. What is the reduced price per kg?',
                 '3. A man spends 75% of his income. His income is increased by 20% and he increased his expenditure by 10%. His savings are increased by?',
                 '4. Fresh fruit contains 68% water and dry fruit contains 20% water. How much dry fruit can be obtained from 100 kg of fresh fruits?',
                 '5. In an examination, 80% candidates passed in English and 85% candidates in Mathematics. If 73% candidates passed in both these subjects, then what % of candidates failed in both the subjects?'
              ]
            }
          }
        ]
      },
      {
         title: 'Reasoning - Verbal Logic',
         description: 'Syllogism, Coding-Decoding, and Analogies.',
         tasks: [
            {
               title: 'Syllogism Practice',
               task_type: 'exercise',
               description: 'Solve 5 Syllogism sets.',
               content: {
                 objective: 'Determine correct conclusions.',
                 instructions: ['Draw Venn diagrams for every question.'],
                 questions: [
                   'Statements: All cats are dogs. Some dogs are birds. No bird is a pig.\nConclusions:\nI. Some cats are birds.\nII. Some dogs are pigs. (A) Only I follows (B) Only II follows (C) Either I or II (D) Neither I nor II',
                   'Statements: Some actors are singers. All the singers are dancers.\nConclusions:\nI. Some actors are dancers.\nII. No singer is actor. (A) Only I follows (B) Only II follows (C) Either I or II (D) Neither I nor II'
                 ]
               }
            }
         ]
      }
    ]
  },
  {
     title: 'UPSC IAS: GS Foundation',
     description: 'Foundation course for General Studies Paper 1 covering History, Geography, and Polity.',
     category: 'Academics & Exams',
     difficulty: 'Advanced',
     max_members: 50,
     visibility: 'public',
     status: 'active',
 
     milestones: [
        {
          title: 'Modern Indian History - 1857 Revolt',
          description: 'Detailed analysis of the First War of Independence.',
          tasks: [
             {
               title: 'Causes of Revolt Analysis',
               task_type: 'reading',
               description: 'Political, Economic, and Social Causes',
               content: {
                 objective: 'Understand the multi-faceted causes of 1857.',
                 instructions: [
                    'Read the following summary:',
                    'Political: Doctrine of Lapse (Dalhousie) annexed Satara, Sambalpur, Jhansi. Nana Sahib refusal of pension.',
                    'Economic: Heavy taxation, destruction of traditional handicrafts, discriminatory tariffs.',
                    'Social: Sati Abolition (1829), Widow Remarriage (1856), tax on mosque/temple lands.',
                    'Military: General Service Enlistment Act (crossing sea meant loss of caste), Enfield Rifle cartridges (greased with cow/pig fat).'
                 ],
                 questions: [
                    'Essay Q: "The Revolt of 1857 was not just a Sepoy Mutiny but a national uprising." Critically analyze this statement in 200 words.'
                 ]
               }
             },
             {
               title: 'Map Work: Centers of Revolt',
               task_type: 'exercise',
               description: 'Identify leaders and locations.',
               content: {
                 objective: 'Match the leaders to their centers.',
                 questions: [
                   '1. Delhi - ? (A) Bahadur Shah II/General Bakht Khan',
                   '2. Kanpur - ? (A) Nana Sahib/Tantia Tope',
                   '3. Lucknow - ? (A) Begum Hazrat Mahal',
                   '4. Jhansi - ? (A) Rani Laxmibai',
                   '5. Arrah (Bihar) - ? (A) Kunwar Singh'
                 ]
               }
             }
          ]
        },
        {
           title: 'Indian Polity - Preamble & Union',
           description: 'Constitution basics.',
           tasks: [
             {
               title: 'Preamble Deconstruction',
               task_type: 'exercise',
               description: 'Analyze the Preamble text.',
               content: {
                 objective: 'Define key terms.',
                 questions: [
                    '1. Explain "Sovereign": No external authority has power over India.',
                    '2. Explain "Socialist": Democratic socialism (mixed economy), added by 42nd Amendment.',
                    '3. Explain "Secular": State has no religion (added by 42nd Amendment).',
                    '4. Explain "Republic": Head of State is elected, not hereditary.',
                    'Q: Which case declared Preamble as integral part of Constitution? (A) Berubari (B) Kesavananda (C) LIC of India Case.'
                 ]
               }
             }
           ]
        }
     ]
  },
  {
    title: 'JEE Advanced: Mechanics Mastery',
    description: 'Intensive physics problem solving for IIT JEE aspirants.',
    category: 'Academics & Exams',
    difficulty: 'Advanced',
    max_members: 200,
    visibility: 'public',
    status: 'active',

    milestones: [
       {
         title: 'Rotational Motion - Problem Set',
         description: 'Advanced problems on Torque and Angular Momentum.',
         tasks: [
            {
              title: 'Moment of Inertia Calculations',
              task_type: 'exercise',
              description: 'Derive and Calculate I for complex bodies.',
              content: {
                objective: 'Solve these 5 problems.',
                questions: [
                   '1. Calculate the Moment of Inertia of a solid cone of mass M and base radius R about its symmetry axis. (Ans: 3/10 MR^2)',
                   '2. A thin circular ring of mass M and radius R is rotating about its axis with constant angular velocity w. Two objects each of mass m are attached gently to the opposite ends of a diameter of the ring. The ring now rotates with an angular velocity? (Ans: w(M / M+2m))',
                   '3. Four solid spheres each of diameter \u221a5 cm and mass 0.5 kg are placed with their centers at the corners of a square of side 4 cm. The moment of inertia of the system about the diagonal of the square is?',
                   '4. A rod of length L and mass M is bent into a semi-circle. Find its moment of inertia about an axis passing through its center of mass and perpendicular to its plane.'
                ]
              }
            },
            {
               title: 'Rolling Motion',
               task_type: 'exercise',
               description: 'Pure rolling friction and energy.',
               content: {
                  objective: 'Solve problems on inclined planes.',
                  questions: [
                     '1. A solid cylinder of mass M and radius R rolls down an inclined plane of inclination theta without slipping. Find the acceleration of its center of mass. (Ans: (2/3)g sin(theta))',
                     '2. A hollow sphere of mass M and radius R is rolling on a rough horizontal surface. Velocity of center of mass is v. Find its total kinetic energy. (Ans: 5/6 Mv^2)'
                  ]
               }
            }
         ]
       }
    ]
  },
  {
    title: 'NEET Biology: Human Physiology',
    description: 'Detailed study of human body systems for medical entrance. NCERT based focus.',
    category: 'Academics & Exams',
    difficulty: 'Advanced',
    max_members: 150,
    visibility: 'public',
    status: 'active',

    milestones: [
      {
        title: 'Digestion & Absorption - NCERT Review',
        description: 'Line by line analysis of Digestive System.',
        tasks: [
          {
             title: 'Enzymes & Saliva',
             task_type: 'exercise',
             description: 'Recall and Match',
             content: {
               objective: 'Answer the following.',
               questions: [
                  '1. What is the pH of Saliva? (Ans: 6.8)',
                  '2. Which cells in gastric glands secrete HCl? (Ans: Oxyntic/Parietal cells)',
                  '3. Castle\'s Intrinsic Factor is essential for absorption of which Vitamin? (Ans: B12)',
                  '4. Trypsinogen is activated by? (Ans: Enterokinase)',
                  '5. Name the sphincter between esophagus and stomach. (Ans: Gastro-esophageal sphincter)'
               ]
             }
          },
          {
             title: 'Absorption of Digested Products',
             task_type: 'exercise',
             description: 'Transport mechanisms.',
             content: {
                objective: 'Identify Active vs Passive transport.',
                questions: [
                   '1. Glucose and Amino acids are absorbed by? (Ans: Active transport with Na+)',
                   '2. Fructose is absorbed by? (Ans: Facilitated transport)',
                   '3. Fatty acids and glycerol are first incorporated into small droplets called? (Ans: Micelles)',
                   '4. Chylomicrons are transported into? (Ans: Lacteals/Lymph vessels)'
                ]
             }
          }
        ]
      }
    ]
  },
  {
    title: 'Police Constable Training Prep',
    description: 'Physical and Mental Aptitude for State Police Exams.',
    category: 'Academics & Exams',
    difficulty: 'Intermediate',
    max_members: 500,
    visibility: 'public',
    status: 'active',

    milestones: [
      {
        title: 'Logical Reasoning - Series',
        description: 'Number and Alphabet Series.',
        tasks: [
          {
            title: 'Number Series Drill',
            task_type: 'exercise',
            description: 'Find the missing number.',
             content: {
               objective: 'Solve these 10 patterns.',
               questions: [
                  '1. 2, 5, 9, 19, 37, ? (A) 73 (B) 75 (C) 76 (D) 78',
                  '2. 4, 8, 28, 80, 244, ?',
                  '3. 10000, 11000, 9900, 10890, 9801, ?',
                  '4. 0, 6, 24, 60, 120, 210, ?',
                  '5. 1, 4, 6, 6, 36, 340, ?'
               ],
               hints: ['Q1 pattern: *2 + 1, *2 - 1, *2 + 1...']
             }
          }
        ]
      }
    ]
  },
  {
    title: 'Banking PO: Data Interpretation',
    description: 'Master DI for IBPS and SBI PO Mains. Calculation intensive.',
    category: 'Academics & Exams',
    difficulty: 'Advanced',
    max_members: 300,
    visibility: 'public',
    status: 'active',

    milestones: [
      {
        title: 'Tabular DI Sets',
        description: 'Complex Table Interpretation.',
        tasks: [
          {
            title: 'Missing Data Table Practice',
            task_type: 'exercise',
            description: 'Fill in missing values.',
            content: {
              objective: 'Solve the following set.',
              instructions: [
                 'Table shows total employees in 5 companies and % distribution of Male/Female and % of IT/HR dept.',
                 'Company A: Total 2000, Male 60%, IT 40%',
                 'Company B: Total 1500, Male 55%, IT ?',
                 'Company C: Total ?, Male 40%, IT 20%',
                 'Scenario: If employees in IT dept of B are 450, find % of HR dept employees.'
              ],
              questions: [
                 '1. Calculate total females in Company A.',
                 '2. The ratio of Males in B to Females in B is?',
                 '3. If Company C has 3000 employees, how many are in HR dept?'
              ]
            }
          }
        ]
      }
    ]
  }
];

async function seed() {
  console.log('🚀 Starting Comprehensive Exam Seeding (Deep Content)...');

  try {
    // 1. Add thumbnail_url column if not exists
    console.log('🛠 Checking schema...');
    await pool.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
    `);

    // 2. Insert Skills
    console.log('📚 Seeding Skills...');
    for (const skill of SKILLS_TO_SEED) {
        await pool.query(`
            INSERT INTO skills (name, category, level, description)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (name) DO NOTHING
        `, [skill.name, skill.category, skill.level, skill.description]);
    }

    // 3. Get Default Owner ID
    const { rows: [owner] } = await pool.query('SELECT id FROM profiles LIMIT 1');
    if (!owner) throw new Error('No users found to assign ownership!');

    // 4. Insert Challenges and Content
    console.log('🏆 Seeding Challenges...');
    
    for (const challenge of EXAM_CHALLENGES) {
        // Check duplication
        const { rows: existing } = await pool.query('SELECT id FROM projects WHERE title = $1', [challenge.title]);
        if (existing.length > 0) {
            console.log(`   > Skipping ${challenge.title} (Already exists)`);
            continue;
        }

        // Insert Project
        const { rows: [proj] } = await pool.query(`
            INSERT INTO projects (title, description, category, difficulty, max_members, visibility, status, owner_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `, [challenge.title, challenge.description, challenge.category, challenge.difficulty, challenge.max_members, challenge.visibility, challenge.status, owner.id]);

        console.log(`   > Created Challenge: ${challenge.title}`);

        // Insert Milestones & Tasks
        for (let i = 0; i < challenge.milestones.length; i++) {
            const m = challenge.milestones[i];
            const { rows: [milestone] } = await pool.query(`
                INSERT INTO challenge_milestones (project_id, title, description, order_index)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [proj.id, m.title, m.description, i]);

            for (let j = 0; j < m.tasks.length; j++) {
                const t = m.tasks[j];
                await pool.query(`
                    INSERT INTO challenge_tasks (project_id, milestone_id, title, description, task_type, content, order_index)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [proj.id, milestone.id, t.title, t.description, t.task_type, JSON.stringify(t.content), j]);
            }
        }
    }

    console.log('✅ Seeding Complete!');

  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    pool.end();
  }
}

seed();
