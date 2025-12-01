import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { connectDB } from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory for Cloudinary upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Make multer instance available for routes
app.locals.upload = upload;

// Connect to MongoDB
connectDB();

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import carRoutes from "./routes/car.routes.js";
import supportRoutes from "./routes/support.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

// API Routes
// IMPORTANT: Mount admin routes BEFORE user routes to avoid route conflicts
// Admin routes are more specific, so they should be checked first
app.use("/api/admin", adminRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api", supportRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DriveOn Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);

  // Verify Cloudinary configuration
  const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const cloudinaryKey = process.env.CLOUDINARY_API_KEY?.trim();
  const cloudinarySecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloudinaryName && cloudinaryKey && cloudinarySecret) {
    console.log(
      `✅ Cloudinary configured (Cloud Name: ${cloudinaryName}, API Key: ${cloudinaryKey.substring(0, 8)}...)`
    );
  } else {
    console.warn(`⚠️ Cloudinary not configured:`);
    console.warn(
      `   CLOUDINARY_CLOUD_NAME: ${cloudinaryName ? "✓ Set" : "✗ Missing"}`
    );
    console.warn(
      `   CLOUDINARY_API_KEY: ${cloudinaryKey ? "✓ Set" : "✗ Missing"}`
    );
    console.warn(
      `   CLOUDINARY_API_SECRET: ${cloudinarySecret ? "✓ Set" : "✗ Missing"}`
    );
  }

  // Verify JWT configuration
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret !== 'your-secret-key-change-in-production') {
    console.log(`✅ JWT Secret configured`);
  } else {
    console.warn(`⚠️ JWT_SECRET not configured or using default value`);
  }

  // Verify SMSIndia Hub configuration
  const smsApiKey = process.env.SMSINDIAHUB_API_KEY?.trim();
  const smsSenderId = process.env.SMSINDIAHUB_SENDER_ID?.trim();
  if (smsApiKey && smsSenderId) {
    console.log(
      `✅ SMSIndia Hub configured (API Key: ${smsApiKey.substring(
        0,
        8
      )}..., Sender ID: ${smsSenderId})`
    );
  } else {
    console.warn(`⚠️ SMSIndia Hub not configured:`);
    console.warn(
      `   SMSINDIAHUB_API_KEY: ${smsApiKey ? "✓ Set" : "✗ Missing"}`
    );
    console.warn(
      `   SMSINDIAHUB_SENDER_ID: ${smsSenderId ? "✓ Set" : "✗ Missing"}`
    );
  }

  // Verify Razorpay configuration
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID?.trim();
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (razorpayKeyId && razorpayKeySecret) {
    console.log(
      `✅ Razorpay configured (Key ID: ${razorpayKeyId.substring(0, 8)}...)`
    );
  } else {
    console.error(`❌ Razorpay NOT configured:`);
    console.error(
      `   RAZORPAY_KEY_ID: ${razorpayKeyId ? "✓ Set" : "✗ Missing"}`
    );
    console.error(
      `   RAZORPAY_KEY_SECRET: ${razorpayKeySecret ? "✓ Set" : "✗ Missing"}`
    );
    console.error(`   ⚠️ Payment functionality will not work without Razorpay keys!`);
  }
});
