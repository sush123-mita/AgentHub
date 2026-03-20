const { GoogleGenerativeAI } = require('@google/generative-ai');
const Agent = require('../models/agentModel');

exports.recommendAgents = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required for AI recommendation.' });
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      return res.status(500).json({ error: 'AI_API_KEY is not configured in the backend.' });
    }

    // Fetch all agents to provide context to the AI
    const agents = await Agent.findAll({ attributes: ['id', 'name', 'description', 'category'] });

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an AI assistant for AgentHub, a marketplace for AI agents.
      A user is searching for: "${query}"

      Here is the list of available agents in our database:
      ${JSON.stringify(agents, null, 2)}

      Based on the user's intent, strictly select the most relevant agents from the list above.
      Respond ONLY with a valid JSON array of objects containing the recommended agent IDs and a short reason why it matches.
      Example format:
      [
        { "id": 1, "reason": "It matches your need to generate resumes." }
      ]
      DO NOT wrap the response in markdown blocks like \`\`\`json. Just output the raw JSON array.
    `;

    const result = await model.generateContent(prompt);
    let aiResponseText = result.response.text().trim();

    // Clean up potential markdown blocks if the AI still included them
    if (aiResponseText.startsWith('```json')) {
      aiResponseText = aiResponseText.substring(7, aiResponseText.length - 3).trim();
    } else if (aiResponseText.startsWith('```')) {
      aiResponseText = aiResponseText.substring(3, aiResponseText.length - 3).trim();
    }

    const aiRecommendations = JSON.parse(aiResponseText);

    // Map the full agent details to the recommended IDs
    const populatedRecommendations = aiRecommendations.map(rec => {
      const fullAgent = agents.find(a => a.id === rec.id);
      return {
        ...fullAgent.toJSON(),
        aiReason: rec.reason
      };
    }).filter(a => a.name); // Filter out any hallucinated IDs

    res.json(populatedRecommendations);

  } catch (error) {
    console.error('AI Recommendation Error:', error);
    const statusCode = error.message?.includes('429') ? 429 : 500;
    const errorMessage = error.message?.includes('429') 
      ? 'Gemini AI quota exceeded. Please try again in 1 minute.' 
      : 'Failed to generate AI recommendations.';
      
    res.status(statusCode).json({ 
      error: errorMessage, 
      details: error.message 
    });
  }
};
