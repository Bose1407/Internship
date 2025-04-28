const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root", // replace with your MySQL username
    password: "POIUYTREwq21@", // replace with your MySQL password
    database: "school_management",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// API Endpoints

// Add School - POST /addSchool
app.post("/addSchool", async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude must be numbers" });
    }

    const [result] = await pool.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );

    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List Schools - GET /listSchools
app.get("/listSchools", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validation
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "User latitude and longitude are required" });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude must be numbers" });
    }

    const [schools] = await pool.execute("SELECT * FROM schools");

    // Calculate distance for each school and add it to the school object
    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        school.latitude,
        school.longitude
      );
      return {
        ...school,
        distance: parseFloat(distance.toFixed(2)), // Distance in km with 2 decimal places
      };
    });

    // Sort by distance (ascending)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schoolsWithDistance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Database initialization (comment out after first run)
async function initializeDatabase() {
  try {
    await pool.execute(`
            CREATE TABLE IF NOT EXISTS schools (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    console.log("Database table initialized");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

// Uncomment the line below to initialize the database table on first run
// initializeDatabase();
