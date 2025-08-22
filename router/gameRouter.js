const express = require('express');
const Game = require('../model/game'); 
const { StatusCodes } = require('http-status-codes'); // for clear status codes

const router = express.Router();

// Get games occured on the day from query (GET /)
router.get('/', async (req, res) => {
  try {
    const { year, month, day } = req.query;


    // Validate the query parameters
    if (!year || !month || !day) {
      return res.status(400).json({ message: 'Please provide year, month, and day parameters.' });
    }

    // Convert month from string to integer and adjust because months are 0-indexed
    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10) - 1; // JavaScript months are 0-indexed
    const parsedDay = parseInt(day, 10);

    // Create a Date object for the start of the day
    const startDate = new Date(Date.UTC(parsedYear, parsedMonth, parsedDay, 0, 0, 0, 0));
    // Create a Date object for the end of the day (23:59:59)
    const endDate = new Date(Date.UTC(parsedYear, parsedMonth, parsedDay, 23, 59, 59, 999));

    // Query the database for games released on this specific date
    const games = await Game.find({
      gameCreatedTime: {
        $gte: startDate, // greater than or equal to startDate
        $lte: endDate,   // less than or equal to endDate
      },
    });

    console.log('games api: ', games.length)

    // If no games are found
    // if (games.length === 0) {
    //   return res.status(404).json({ message: 'No games found matching the criteria' });
    // }

    // Return the found games
    return res.status(200).json({ success: true, data: games });
  } catch (err) {
    // Handle errors
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new game (POST /)
router.post('/', async (req, res) => {
  try {
    const newGame = new Game({
      ...req.body,
      gameCreatedTime: new Date(),
    });
    const savedGame = await newGame.save();
    res.status(StatusCodes.CREATED).json(savedGame);
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating game" });
  }
});

// Update a game (PUT /)
router.put('/', async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.body._id, req.body, { new: true });

    if (!updatedGame) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Game not found" }); // Clear error message
    }
    console.log("Updated game to MongoDB through API", updatedGame);
    res.status(StatusCodes.OK).json({ success: true, data: updatedGame });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error updating game" });
  }
});

module.exports = router;
