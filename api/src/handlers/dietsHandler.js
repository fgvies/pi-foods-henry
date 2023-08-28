const { getAllDietsExists } = require("../controllers/dietController");

const handleDiets = async (req, res) => {
  try {
    
    const allDiets = await getAllDietsExists();
    res.status(200).json(allDiets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = handleDiets;
