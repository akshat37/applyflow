import express from "express";
import cors from "cors";
import jobsRouter from "./routes/jobs.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/jobs", jobsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
