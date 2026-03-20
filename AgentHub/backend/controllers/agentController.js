const { Op } = require('sequelize');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Agent = require('../models/agentModel');
const Review = require('../models/reviewModel');

exports.getAgents = async (req, res) => {
  try {
    const { search, category, tag, sort } = req.query;
    let whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category && category !== 'All') {
      whereClause.category = category;
    }
    
    // In MySQL JSON tags, finding a tag requires JSON_CONTAINS
    if (tag) {
      whereClause.tags = {
        [Op.like]: `%${tag}%`
      };
    }

    let orderOption = [['createdAt', 'DESC']];
    if (sort === 'popular') orderOption = [['usageCount', 'DESC']];
    if (sort === 'rating') orderOption = [['avgRating', 'DESC']];
    if (sort === 'newest') orderOption = [['createdAt', 'DESC']];

    const agents = await Agent.findAll({
      where: whereClause,
      order: orderOption
    });
    
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id, {
      include: [{ model: Review, as: 'reviews' }]
    });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.useAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    agent.usageCount += 1;
    await agent.save();

    const { inputs } = req.body;
    let userInput = Object.values(inputs || {}).join(', ');
    if (!userInput.trim()) {
      userInput = "Hello";
    }

    const response = await runAgentWithGemini(agent.name, userInput);

    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const agents = await Agent.findAll({ where: { featured: true }, limit: 6 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const agents = await Agent.findAll({ where: { trending: true }, limit: 6 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Real AI response generator ──
async function runAgentWithGemini(agentName, userInput) {
  const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompts = {
    "resume generator": `Create a complete professional ATS-friendly 
      resume. Include: Professional Summary, Skills, Work Experience, 
      Education, Certifications. Make it detailed and formatted.
      User details: ${userInput}`,
    
    "blog title generator": `Generate 10 creative SEO-optimized blog 
      titles for topic: "${userInput}". 
      For each title give: Title, Why it works, Target audience.
      Format as numbered list.`,
    
    "code explainer": `Explain this code line by line like teaching 
      a beginner. Also explain: what it does overall, any bugs you 
      see, how to improve it.
      Code: ${userInput}`,
    
    "email writer": `Write a professional email based on this 
      context: ${userInput}. 
      Include: Subject line, greeting, body, call to action, 
      professional closing.`,
    
    "grammar fixer": `Fix all grammar, spelling and punctuation 
      errors in this text. Then show: 
      1. Corrected version 
      2. List of all changes made and why
      Text: ${userInput}`,
    
    "summarizer": `Summarize this text in 3 formats:
      1. One line summary
      2. Three bullet point summary  
      3. Detailed paragraph summary
      Text: ${userInput}`,
    
    "interview questions": `Generate 10 professional interview 
      questions with ideal answers for: ${userInput}.
      Format: Question, Why asked, Ideal answer, Tips.`,
    
    "cover letter": `Write a compelling cover letter for:
      ${userInput}
      Include: Opening hook, relevant skills, why this company, 
      call to action. Make it personalized and professional.`,
    
    "idea generator": `Generate 10 creative and detailed ideas 
      for: ${userInput}. 
      For each idea: Title, Description, How to execute, 
      Potential challenges, Expected outcome.`,
    
    "hashtag generator": `Generate 30 relevant hashtags for 
      this social media post about: ${userInput}.
      Group them as: High reach (10), Medium reach (10), 
      Niche (10). Explain strategy.`
  };

  const name = agentName.toLowerCase();
  let prompt = null;
  
  for (const key of Object.keys(prompts)) {
    if (name.includes(key) || key.includes(name.split(" ")[0])) {
      prompt = prompts[key];
      break;
    }
  }
  
  if (!prompt) {
    prompt = `You are an AI agent called "${agentName}". 
    Help the user professionally with: ${userInput}. 
    Give a detailed, structured, useful response.`;
  }

  const result = await model.generateContent(prompt);
  return result.response.text();
}
