<h1 align="center">🔶 API Watch</h1>

<p align="center">
  <em>watching your APIs, so you don't have to</em>
</p>

<p align="center">
  A real-time API monitoring dashboard built to showcase <strong>Server-Sent Events (SSE)</strong> — the underrated, lightweight alternative to WebSockets for server-to-client streaming.
</p>

---

## 🎯 Why This Exists

WebSockets get all the attention, but for **unidirectional real-time data** (server → client), **SSE is simpler, lighter, and built into the browser**. This project demonstrates:

| Concept                     | How It's Used                                            |
| --------------------------- | -------------------------------------------------------- |
| **Server-Sent Events**      | Stream API logs from backend to frontend in real-time    |
| **EventSource API**         | Native browser API with auto-reconnection and retry      |
| **Live Data Visualization** | Recharts rendering latency and status data as it arrives |

> **SSE vs WebSocket?** SSE is HTTP-based, works with proxies/load balancers out of the box, auto-reconnects on failure, and needs zero client libraries. Perfect when data only flows one way.

---

## ✨ Features

- 📡 **Real-time log streaming** via SSE — no polling, no WebSocket overhead
- 📊 **Live charts** — latency over time + request status breakdown (success/error)
- 🎛️ **API trigger panel** — fire simulated API calls (`/users`, `/orders`, `/inventory`, `/health`)
- 🔄 **Auto health polling** — periodic health checks with configurable intervals
- 🟢 **Connection toggle** — click the header status pill to connect/disconnect the stream
- 📋 **Log stream** — newest-first log feed with method, endpoint, status, and latency
- 🎨 **Cloudflare-inspired design** — warm orange accents, dot-grid background, frosted glass header

---

## 🔑 Key Concepts Demonstrated

### Server-Sent Events (SSE)

```javascript
// Backend — Sending events
res.writeHead(200, {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
});

// Send data to all connected clients
res.write(`data: ${JSON.stringify(logEntry)}\n\n`);
```

```javascript
// Frontend — Receiving events
const eventSource = new EventSource("/api/logs/stream");

eventSource.onmessage = (event) => {
  const log = JSON.parse(event.data);
  // Update UI in real-time
};

```

### React Custom Hooks for SSE

The `useSSE` hook encapsulates the entire SSE lifecycle:

- **`connect()`** — opens an `EventSource` connection
- **`disconnect()`** — closes it cleanly
- **`isConnected`** — reactive connection state
- **`logs`** — rolling buffer of last 100 entries
- **`stats`** — computed totals that persist beyond the log buffer


