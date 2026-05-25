import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig, loadEnv, Plugin, createFilter, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  setEnv(mode);
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      envPlugin(),
      devServerPlugin(),
      sourcemapPlugin(),
      buildPathPlugin(),
      basePlugin(),
      importPrefixPlugin(),
      htmlPlugin(mode),
      svgrPlugin(),
      svgr(),
      checker({
        typescript: {
          tsconfigPath: './tsconfig.json',
        },
        // eslint: {
        //   lintCommand: "eslint --ext .js,.jsx,.ts,.tsx src", // ESLint for `.js`, `.jsx`, `.ts`, `.tsx`
        // },
      })
      //   eslint: {
      //     lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}" --max-warnings=0',
      //   },
      // }),
    ],
    base: process.env.PUBLIC_URL || "/",
    resolve: {
      alias: {
        "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
      esbuildOptions: {
        target: "esnext",
      },
    },
    server: {
      fs: {
        strict: true,
      },
    },
    esbuild: {
      exclude: ["node_modules"],
    },
    cacheDir: "node_modules/.vite_cache",
	build: {
    sourcemap: false, 
		rollupOptions: {
		  output: {
			manualChunks: {
			  reactVendor: ["react", "react-dom"], // Separate React
			  mui: ["@mui/material", "@mui/icons-material","@mui/lab","@mui/styles"], // Separate MUI
			  lodash: ["lodash-es"], // Separate Lodash
			  highlight: ["highlight.js"], // Separate Highlight.js
			  materialTable: ["@material-table/core"], // Separate Material-Table
			  jspdf: ["jspdf"],
        apexcharts: ["react-apexcharts", "apexcharts"],
			},
		  },
		},
	},
  define: {
    global: 'window' // Polyfill global for browser use
  }
  };
});

function setEnv(mode: string) {
  Object.assign(
    process.env,
    loadEnv(mode, ".", ["VITE_API_", "NODE_ENV", "PUBLIC_URL"])
  );
  process.env.NODE_ENV ||= mode;
  const { homepage } = JSON.parse(readFileSync("package.json", "utf-8"));
  process.env.PUBLIC_URL ||= homepage
    ? `${homepage.startsWith("http") || homepage.startsWith("/") ? homepage : `/${homepage}`}`.replace(/\/$/, "")
    : "";
}

function envPlugin(): Plugin {
  return {
    name: "env-plugin",
    config(_, { mode }) {
      const env = loadEnv(mode, ".", ["VITE_API_", "NODE_ENV", "PUBLIC_URL"]);
      return {
        define: Object.fromEntries(
          Object.entries(env).map(([key, value]) => [
            `process.env.${key}`,
            JSON.stringify(value),
          ])
        ),
      };
    },
  };
}

function devServerPlugin(): Plugin {
  return {
    name: "dev-server-plugin",
    config(_, { mode }) {
      const { HOST, PORT, HTTPS, SSL_CRT_FILE, SSL_KEY_FILE } = loadEnv(
        mode,
        ".",
        ["HOST", "PORT", "HTTPS", "SSL_CRT_FILE", "SSL_KEY_FILE"]
      );
      const https = HTTPS === "true";
      return {
        server: {
          host: HOST || "0.0.0.0",
          port: parseInt(PORT || "3000", 10),
          open: true,
          ...(https && SSL_CRT_FILE && SSL_KEY_FILE && {
            https: {
              cert: readFileSync(resolve(SSL_CRT_FILE)),
              key: readFileSync(resolve(SSL_KEY_FILE)),
            },
          }),
        },
      };
    },
  };
}

function sourcemapPlugin(): Plugin {
  return {
    name: "sourcemap-plugin",
    config(_, { mode }) {
      const { GENERATE_SOURCEMAP } = loadEnv(mode, ".", ["GENERATE_SOURCEMAP"]);
      return {
        build: {
          sourcemap: GENERATE_SOURCEMAP === "true",
        },
      };
    },
  };
}

function buildPathPlugin(): Plugin {
  return {
    name: "build-path-plugin",
    config(_, { mode }) {
      const { BUILD_PATH } = loadEnv(mode, ".", ["BUILD_PATH"]);
      return {
        build: {
          outDir: BUILD_PATH || "build",
        },
      };
    },
  };
}

function basePlugin(): Plugin {
  return {
    name: "base-plugin",
    config(_, { mode }) {
      const { PUBLIC_URL } = loadEnv(mode, ".", ["PUBLIC_URL"]);
      return {
        base: PUBLIC_URL || "/",
      };
    },
  };
}

function importPrefixPlugin(): Plugin {
  return {
    name: "import-prefix-plugin",
    config() {
      return {
        resolve: {
          alias: [{ find: /^~([^/])/, replacement: "$1" }],
        },
      };
    },
  };
}

function svgrPlugin(): Plugin {
  const filter = createFilter("**/*.svg");
  const postfixRE = /[?#].*$/s;

  return {
    name: "svgr-plugin",
    async transform(code, id) {
      if (filter(id)) {
        const { transform } = await import("@svgr/core");
        const { default: jsx } = await import("@svgr/plugin-jsx");

        const filePath = id.replace(postfixRE, "");
        const svgCode = readFileSync(filePath, "utf8");

        const componentCode = await transform(svgCode,  { exportType: "default" }, {
          filePath,
          caller: {
            previousExport: code,
            defaultPlugins: [jsx],
          },
        });

        const res = await transformWithEsbuild(componentCode, id, {
          loader: "jsx",
        });

        return {
          code: res.code,
          map: null,
        };
      }
    },
  };
}

function htmlPlugin(mode: string): Plugin {
  const env = loadEnv(mode, ".", ["VITE_API_", "NODE_ENV", "PUBLIC_URL"]);
  return {
    name: "html-plugin",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match);
      },
    },
  };
}
