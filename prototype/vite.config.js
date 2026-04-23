import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: false,
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    // 不设 host:true，避免在部分环境枚举网卡失败；手机同 WiFi 调试可改为 host: "0.0.0.0"
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
