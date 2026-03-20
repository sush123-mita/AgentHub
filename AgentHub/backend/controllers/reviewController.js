const Agent = require('../models/agentModel');
const Review = require('../models/reviewModel');

exports.addReview = async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const agent = await Agent.findByPk(req.params.id, {
      include: [{ model: Review, as: 'reviews' }]
    });

    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    // Create the review
    const review = await Review.create({
      agent_id: agent.id,
      user: user || 'Anonymous',
      rating,
      comment
    });

    // Update agent's total and average rating
    const allReviews = await Review.findAll({ where: { agent_id: agent.id } });
    agent.totalRatings = allReviews.length;
    agent.avgRating = +(allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
    await agent.save();

    // Reload to get fresh reviews array
    await agent.reload({ include: [{ model: Review, as: 'reviews' }] });
    
    res.json(agent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
