import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing body request dalam format JSON
app.use(express.json());

// API Key for News API
const API_KEY = '98a2c61bc3d840c9853a8d1754607bd3';

// In-memory database for vehicles
const vehicles = [];

// === VEHICLE CLASSIFICATION API ===

// GET /vehicles - Get all vehicles
app.get("/vehicles", (req, res) => {
  if (vehicles.length === 0) {
    return res.status(404).json({ message: "No vehicles found" });
  }
  res.json(vehicles);
});

// POST /vehicles - Add a new vehicle classification
app.post("/vehicles", (req, res) => {
  const { vehicleType, tires, classificationDetails } = req.body;
  const id = (vehicles.length + 1).toString(); // Generate an ID
  const newVehicle = { id, vehicleType, tires, classificationDetails };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

// GET /vehicles/:id - Get a specific vehicle classification by ID
app.get("/vehicles/:id", (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }
  res.json(vehicle);
});

// DELETE /vehicles/:id - Delete a vehicle classification by ID
app.delete("/vehicles/:id", (req, res) => {
  const vehicleIndex = vehicles.findIndex((v) => v.id === req.params.id);
  if (vehicleIndex === -1) {
    return res.status(404).json({ message: "Vehicle not found" });
  }
  vehicles.splice(vehicleIndex, 1);
  res.status(204).send();
});

// PATCH /vehicles/:id - Update a vehicle classification
app.patch("/vehicles/:id", (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }
  const { vehicleType, tires, classificationDetails } = req.body;
  if (vehicleType) vehicle.vehicleType = vehicleType;
  if (tires) vehicle.tires = tires;
  if (classificationDetails) vehicle.classificationDetails = classificationDetails;
  res.json(vehicle);
});

// POST /classify - Classify a vehicle dynamically
app.post("/classify", (req, res) => {
  const { tires } = req.body;
  if (!tires) {
    return res.status(400).json({ message: "Tire count is required for classification" });
  }

  let classification;
  if (tires === 4) {
    classification = { golongan: 1, vehicleType: "Mobil Pribadi", description: "Kendaraan roda empat pribadi" };
  } else if (tires === 4) {
    classification = { golongan: 2, vehicleType: "Truk Besar Dua Gandar ", description: "Kendaraan angkutan roda empat" };
  } else if (tires === 6) {
    classification = { golongan: 2, vehicleType: "Truk Besar Tiga Gandar", description: "Kendaraan angkutan barang roda enam" };
  } else if (tires > 6 && tires <= 8) {
    classification = { golongan: 3, vehicleType: "Truk Besar Empat Gandar", description: "Kendaraan angkutan barang roda delapan" };
  } else if (tires > 8 && tires <= 10) {
    classification = { golongan: 4, vehicleType: "Truk Besar Lima Gandar", description: "Kendaraan angkutan barang roda sepuluh" };
  } else {
    classification = { golongan: "Tidak Diketahui", vehicleType: "Tidak Dikenali", description: "Kendaraan tidak terklasifikasi" };
  }

  res.json(classification);
});


// Default route for root path "/"
app.get("/", (req, res) => {
    res.send("Welcome to the News API! Use /news?query=your-query to get news.");
  });

// === Endpoint Dummy Berita (News API) ===
app.get('/news', async (req, res) => {
  const { query } = req.query; // Get the query parameter from the request
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}`,
      {
        headers: {
          'X-Api-Key': API_KEY, // Attach the API key in the request header
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching news' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
