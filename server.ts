import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes would go here if needed
  // app.get("/api/example", (req, res) => ...);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    console.log(`Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    
    // SPA Fallback: Send index.html for all non-static paths
    app.get('*', (req, res) => {
      // If the request is for a file (has an extension) but reached here, it's a 404
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        console.warn(`File not found: ${req.path}`);
        return res.status(404).send('Not found');
      }
      
      console.log(`Serving index.html for path: ${req.path}`);
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
