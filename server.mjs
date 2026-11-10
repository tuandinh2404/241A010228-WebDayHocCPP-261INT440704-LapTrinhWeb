// server.mjs — máy chủ của website "Web dạy học C++" (Node.js + MySQL của XAMPP).
//
//   npm install          (lần đầu: cài thư viện mysql2)
//   npm run khoi-tao     (lần đầu: tạo CSDL web_day_hoc_cpp + dữ liệu mẫu; cần Start MySQL trong XAMPP)
//   node server.mjs      → mở http://localhost:8080   (đổi cổng: PORT=3000)
//
// - Phục vụ các trang HTML/CSS/JS.
// - /api/... : đăng nhập, làm bài, chấm bài, quản lý bài tập, quản trị (xem server/api.mjs).
// Yêu cầu trên máy: Node.js, XAMPP (MySQL), g++ (Windows: MinGW-w64) và bash (Windows: Git Bash).

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { xuLyApi } from "./server/api.mjs";
import { donPhienHetHan } from "./server/phien.mjs";
import { truyVan, CAU_HINH_DB } from "./server/db.mjs";
import { BASH } from "./server/chay-tren-may.mjs";

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const LOAI = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".json": "application/json" };
// Không cho trình duyệt tải mã nguồn máy chủ, file CSDL và thư viện
const CAM = ["/server", "/database", "/node_modules", "/package", "/README"];

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname.startsWith("/api/")) return xuLyApi(req, res, url);

    let p = decodeURIComponent(url.pathname);
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || p.includes("..") || CAM.some((c) => p.startsWith(c))) return res.writeHead(403).end();
    try {
      const data = await fs.readFile(f);
      res.writeHead(200, { "content-type": LOAI[path.extname(f).toLowerCase()] || "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Không tìm thấy " + p);
    }
  })
  .listen(PORT, async () => {
    console.log(`Website: http://localhost:${PORT}`);
    console.log(`Máy chấm: g++ (bash: ${BASH})`);
    try {
      await truyVan("SELECT 1 FROM tai_khoan LIMIT 1");
      console.log(`MySQL: đã kết nối ${CAU_HINH_DB.host}:${CAU_HINH_DB.port}/${CAU_HINH_DB.database}`);
    } catch (e) {
      console.log(`MySQL: CHƯA kết nối được (${e.code || e.message}). Hãy Start MySQL trong XAMPP rồi chạy: npm run khoi-tao`);
    }
  });

// Mỗi giờ dọn các phiên đăng nhập đã hết hạn
setInterval(() => donPhienHetHan().catch(() => {}), 3600 * 1000).unref();
