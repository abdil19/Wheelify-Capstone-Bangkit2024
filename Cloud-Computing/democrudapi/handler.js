import fetch from "node-fetch";

// Handler for vehicle classification
export const classifyVehicle = (req, res) => {
  const { tires } = req.body;

  if (!tires) {
    return res.status(400).json({ message: "Jumlah ban (tires) diperlukan untuk klasifikasi" });
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
};

// Handler for fetching news
export const fetchNews = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Parameter query diperlukan untuk mencari berita" });
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${query}`, {
      headers: {
        "X-Api-Key": process.env.API_KEY,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: "Error fetching news" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error internal server", error: error.message });
  }
};
