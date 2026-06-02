import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lustiqueco.co.za",
  // emit /about.html (not /about/index.html) so internal .html links match the prototype exactly
  build: { format: "file" },
});
