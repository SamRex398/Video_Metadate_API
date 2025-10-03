import dotenv from "dotenv";
import app from "./app.js";
import { connectToDatabase } from "./config/db.js"; // adjust path to your prisma setup

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Could not start server:", error);
    process.exit(1);
  }
})();
