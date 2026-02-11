import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

let clients = [];

const broadcast = ({ endpoint, method, status, latency, timestamp }) => {
  clients?.forEach((client) => {
    client.res.write(
      `data: ${JSON.stringify({ endpoint, method, status, latency, timestamp })}\n\n`
    );
  });
};

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// API routes
app.get("/api/logs/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const clientId = Date.now();

  clients.push({
    id: clientId,
    res,
  });

  res.flushHeaders();

  req.on("close", () => {
    clients = clients.filter((client) => client.id !== clientId);
  });
});

app.post("/api/trigger/:endpoint", async (req, res) => {
  const startTime = Date.now();
  let delay = 0;
  let hasFailed = false;

  const { endpoint } = req.params;
  const { method } = req.body;

  switch (endpoint) {
    case "users":
      delay = Math.random() * 100 + 20;
      await new Promise((resolve) => setTimeout(resolve, delay));
      broadcast({
        endpoint,
        method,
        status: 200,
        latency: Math.round(Date.now() - startTime),
        timestamp: new Date().toISOString(),
      });
      res
        .status(200)
        .json({ message: `${endpoint} API triggered successfully` });
      break;

    case "orders":
      delay = Math.random() * 450 + 50;
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (Math.random() < 0.1) {
        hasFailed = true;
      }
      broadcast({
        endpoint,
        method,
        status: hasFailed ? 500 : 200,
        latency: Math.round(Date.now() - startTime),
        timestamp: new Date().toISOString(),
      });
      res.status(hasFailed ? 500 : 200).json({
        message: `${endpoint} API triggered ${hasFailed ? "failed" : "successfully"}`,
      });
      break;

    case "inventory":
      delay = Math.random() * 170 + 30;
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (Math.random() < 0.5) {
        hasFailed = true;
      }
      broadcast({
        endpoint,
        method,
        status: hasFailed ? 500 : 200,
        latency: Math.round(Date.now() - startTime),
        timestamp: new Date().toISOString(),
      });
      res.status(hasFailed ? 500 : 200).json({
        message: `${endpoint} API triggered ${hasFailed ? "failed" : "successfully"}`,
      });
      break;

    case "health":
      delay = Math.random() * 25 + 5;
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (Math.random() < 0.04) {
        hasFailed = true;
      }
      broadcast({
        endpoint,
        method,
        status: hasFailed ? 500 : 200,
        latency: Math.round(Date.now() - startTime),
        timestamp: new Date().toISOString(),
      });
      res.status(hasFailed ? 500 : 200).json({
        message: `${endpoint} API triggered ${hasFailed ? "failed" : "successfully"}`,
      });
      break;

    default:
      broadcast({
        endpoint,
        method,
        status: 404,
        latency: Math.round(Date.now() - startTime),
        timestamp: new Date().toISOString(),
      });
      res.status(404).json({ error: "Endpoint not found" });
      break;
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
