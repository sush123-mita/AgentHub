const sequelize = require('./config/db');
const Agent = require('./models/agentModel');
const Review = require('./models/reviewModel');

const rawAgents = [
  { name: "Resume Generator", category: "Career", 
    description: "Generate ATS-friendly professional resumes instantly",
    inputLabel: "Enter your name, skills, experience, education",
    tags: ["resume","career","job"], featured: true, icon: '📄', color: '#6366f1' },
    
  { name: "Blog Title Generator", category: "Writing",
    description: "Get 10 SEO-optimized blog titles with strategy",
    inputLabel: "Enter your blog topic",
    tags: ["blog","writing","SEO"], featured: true, icon: '✍️', color: '#f59e0b' },
    
  { name: "Code Explainer", category: "Coding",
    description: "Paste code and get clear line-by-line explanation",
    inputLabel: "Paste your code here",
    tags: ["code","programming","learning"], featured: true, icon: '💻', color: '#10b981' },
    
  { name: "Email Writer", category: "Productivity",
    description: "Write professional emails in seconds",
    inputLabel: "Describe the email purpose and context",
    tags: ["email","professional","writing"], icon: '📧', color: '#ec4899' },
    
  { name: "Grammar Fixer", category: "Writing",
    description: "Fix grammar errors and improve your writing",
    inputLabel: "Paste your text here",
    tags: ["grammar","writing","editing"], icon: '📏', color: '#8b5cf6' },
    
  { name: "Text Summarizer", category: "Productivity",
    description: "Summarize any long text in 3 formats instantly",
    inputLabel: "Paste the text you want to summarize",
    tags: ["summary","productivity","reading"], icon: '📝', color: '#14b8a6' },
    
  { name: "Interview Questions", category: "Career",
    description: "Get interview questions with perfect answers",
    inputLabel: "Enter job role or topic",
    tags: ["interview","career","job"], icon: '🎤', color: '#f43f5e' },
    
  { name: "Cover Letter Writer", category: "Career",
    description: "Generate personalized cover letters instantly",
    inputLabel: "Enter job title, company name, your skills",
    tags: ["cover letter","career","job"], icon: '✉️', color: '#0ea5e9' },
    
  { name: "Idea Generator", category: "Productivity",
    description: "Generate creative ideas for any project or topic",
    inputLabel: "Describe what you need ideas for",
    tags: ["ideas","creative","brainstorm"], icon: '💡', color: '#eab308' },
    
  { name: "Hashtag Generator", category: "Writing",
    description: "Get 30 strategic hashtags for social media posts",
    inputLabel: "Describe your post or topic",
    tags: ["hashtags","social media","marketing"], icon: '#️⃣', color: '#3b82f6' }
];

const agentsData = rawAgents.map(a => ({
  ...a,
  inputFields: [{ name: 'input', label: a.inputLabel, type: 'textarea', placeholder: a.inputLabel }],
  usageCount: Math.floor(Math.random() * 2000) + 100,
  avgRating: 5.0,
  totalRatings: 0,
  trending: Math.random() > 0.5
}));


const reviewsData = [
  { agent_id: 1, user: "Priya M.", rating: 5, comment: "Super helpful for my job search! Saved me hours." },
  { agent_id: 1, user: "Jake R.", rating: 4, comment: "Great formatting and clean output." },
  { agent_id: 2, user: "Sarah K.", rating: 5, comment: "Perfect for content planning!" },
  { agent_id: 3, user: "David L.", rating: 5, comment: "Best code explanation tool I've used!" },
  { agent_id: 3, user: "Mia C.", rating: 5, comment: "Made understanding recursion so much easier." }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL via Sequelize');

    // Sync all models (drops existing tables)
    await sequelize.sync({ force: true });
    console.log('Database synced and tables dropped');

    // Insert Agents
    const createdAgents = await Agent.bulkCreate(agentsData);
    console.log(`Seeded ${createdAgents.length} agents`);

    // Insert Reviews
    await Review.bulkCreate(reviewsData);
    console.log(`Seeded ${reviewsData.length} reviews`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
