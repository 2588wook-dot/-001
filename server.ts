import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { existsSync } from "fs";
import { INITIAL_PROJECTS } from "./src/data/initialProjects";

let currentDirname = process.cwd();
try {
  currentDirname = path.dirname(fileURLToPath(import.meta.url));
} catch {
  currentDirname = __dirname;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set body parser with large limit (base64 image storage support)
  app.use(express.json({ limit: "150mb" }));
  app.use(express.urlencoded({ limit: "150mb", extended: true }));

  const PROJECTS_FILE = path.join(process.cwd(), "projects_data.json");

  // API Route - Get projects
  app.get("/api/projects", async (req, res) => {
    try {
      if (existsSync(PROJECTS_FILE)) {
        const raw = await fs.readFile(PROJECTS_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        console.log(`[API] Loaded ${parsed.length} projects successfully from server database.`);
        return res.json(parsed);
      } else {
        // Save initial seed database
        await fs.writeFile(PROJECTS_FILE, JSON.stringify(INITIAL_PROJECTS, null, 2), "utf-8");
        console.log("[API] Created projects backup file on server first initialization.");
        return res.json(INITIAL_PROJECTS);
      }
    } catch (e) {
      console.error("[API] Error loading projects on server:", e);
      // Fallback inside server
      return res.status(200).json(INITIAL_PROJECTS);
    }
  });

  // API Route - Save projects
  app.post("/api/projects", async (req, res) => {
    try {
      const data = req.body;
      if (!Array.isArray(data)) {
        return res.status(400).json({ error: "Invalid layout format. Array of projects is required." });
      }
      
      await fs.writeFile(PROJECTS_FILE, JSON.stringify(data, null, 2), "utf-8");
      console.log(`[API] Successfully saved ${data.length} projects database into server store.`);
      return res.json({ success: true, count: data.length });
    } catch (e) {
      console.error("[API] Error writing projects file on server database:", e);
      return res.status(500).json({ error: "Fail to write database backup inside server storage" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(currentDirname, 'dist');
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
