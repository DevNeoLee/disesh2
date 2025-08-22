const express = require('express');
const Session = require('../model/session');
const { StatusCodes } = require('http-status-codes'); // for better readability

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

    // Query the database for sessions released on this specific date
    const sessions = await Session.find({
      sessionStartTime: {
        $gte: startDate, // greater than or equal to startDate
        $lte: endDate,   // less than or equal to endDate
      },
    });
    console.log('sessions api: ', sessions.length, year, month, day)
    return res.status(200).json({ success: true, data: sessions });
  } catch (err) {
    // Handle errors
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new session (POST /)
router.post('/', async (req, res) => {
  try {
    const newSession = new Session({
      ipAddress: req.ip,
      sessionStartTime: new Date(),
      gameStarted: false,
      gameCompleted: false,
      role: "",
      ...req.body, // Spread operator for flexibility
    });
    const savedSession = await newSession.save();
    res.status(StatusCodes.CREATED).json(savedSession);
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error saving session API" });
  }
});

// Update a session (PUT /) - Handles both body and ID-based updates
router.put('/', async (req, res) => {
  try {
    let session;

    if (req.body._id) { // Update by ID if provided
      session = await Session.findByIdAndUpdate(req.body._id, req.body, { new: true });
    } else { // Update based on request body content (if no ID)
      session = await Session.findOneAndUpdate({ /* criteria based on your logic */ }, req.body, { new: true });
    }

    if (!session) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Session not found, API" }); // Clear error message
    }
    console.log("Updated session to MongoDB through API", updatedSession?._id);
    res.status(StatusCodes.OK).json({ success: true, data: session });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error updating session, API" });
  }
});

// Update a session by ID (PUT /:id) - More specific update route
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // console.log('Session Router API: req.body: ', req.body);
    const updatedSession = await Session.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedSession) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Session not found, API' });
    }
    console.log('Session Router: API, updatedSession: ');
    res.json(updatedSession);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Error updating session, API" }); // Informative error message
  }
});

module.exports = router;
