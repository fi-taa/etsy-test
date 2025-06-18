import app from "./app.js";
import connectDB from "./db/connect.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(); // ✅ waits for MongoDB
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect DB ", err.message);
    process.exit(1);
  }
};

start();
