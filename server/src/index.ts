
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173"
}));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "live-market-watch-api",
    timestamp: new Date().toISOString()
  });
});

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
