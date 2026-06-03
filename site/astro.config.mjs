import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lustiqueco.co.za",
  // emit /about.html (not /about/index.html) so internal .html links match the prototype exactly
  build: { format: "file" },
  vite: {
    server: {
      // The project lives in an iCloud-synced ~/Documents folder, where macOS fsevents
      // file-watching is unreliable — so Vite HMR misses edits and you'd see stale code
      // until a restart. Polling detects changes by mtime instead → reliable hot-reload.
      // Dev-only; costs a little CPU. (Permanent fix: move the project out of iCloud.)
      watch: { usePolling: true, interval: 300 },
    },
  },
});
