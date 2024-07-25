import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { minify } from "terser";
import fs from "fs/promises";
import path from "path";

function minifyBackgroundJs() {
  return {
    name: "minify-background-js",
    apply: "build",
    async writeBundle(options) {
      const inputFilePath = path.resolve(__dirname, "public/background.js");
      const outputFilePath = path.resolve(options.dir, "background.js");

      try {
        const code = await fs.readFile(inputFilePath, "utf-8");
        const result = await minify(code);
        await fs.writeFile(outputFilePath, result.code, "utf-8");
        console.log(
          `background.js minified successfully and saved to ${outputFilePath}`
        );
      } catch (error) {
        console.error(`Error minifying background.js: ${error}`);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), minifyBackgroundJs()],
});
