// server.mjs — máy chủ của website "Web dạy học C++", chạy trên máy bằng Node.js (không cần cài thêm thư viện).
//
//   node server.mjs          → mở http://localhost:8080   (đổi cổng: PORT=3000 node server.mjs)
//
// - Phục vụ các trang HTML/CSS/JS.
// - POST /api/judge: chấm bài C++ — biên dịch bằng g++ và chạy từng bộ test (lõi chấm ở server/harness.mjs).
// Yêu cầu trên máy: Node.js, g++ (trên Windows: MinGW-w64) và bash (trên Windows: Git Bash đi kèm Git).

import http from "node:http";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { chamBai, kiemTraYeuCau } from "./server/harness.mjs";

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const run = promisify(execFile);
const LOAI = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".json": "application/json" };

// Tìm bash: trên Windows dùng Git Bash (đi kèm Git), máy khác dùng bash có sẵn
function timBash() {
  if (process.env.BASH_PATH) return process.env.BASH_PATH;
  if (process.platform !== "win32") return "bash";
  for (const p of ["C:/Program Files/Git/bin/bash.exe", "C:/Program Files (x86)/Git/bin/bash.exe"]) if (existsSync(p)) return p;
  return "bash";
}
const BASH = timBash();

// Ghi gói file (main.cpp, in1..in5, compile, run) vào thư mục tạm, chạy 2 script rồi xóa thư mục.
// Trả về { trangThai: "ok" | "bienDich" | "quaGio" | "loi", stdout, bienDich, thongBao } cho harness.mjs.
async function chayTrenMay(files) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cham-"));
  try {
    for (const [ten, noiDung] of Object.entries(files)) await fs.writeFile(path.join(dir, ten), noiDung, "utf8");
    try {
      await run(BASH, ["compile"], { cwd: dir, timeout: 60000 });
    } catch (e) {
      return { trangThai: "bienDich", bienDich: String(e.stderr || e.message) };
    }
    try {
      // 30 giây là giới hạn cho cả gói (mỗi test đã tự giới hạn 2 giây trong script run)
      const { stdout } = await run(BASH, ["run"], { cwd: dir, timeout: 30000, maxBuffer: 8 << 20 });
      return { trangThai: "ok", stdout };
    } catch (e) {
      return { trangThai: e.killed ? "quaGio" : "loi", stdout: String(e.stdout || ""), thongBao: String(e.stderr || e.message).slice(0, 500) };
    }
  } finally {
    fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

function guiJson(res, data, status = 200) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/api/judge") {
      if (req.method !== "POST") return guiJson(res, { loi: "Chỉ nhận POST." }, 405);
      let raw = "";
      for await (const chunk of req) raw += chunk;
      let body;
      try { body = JSON.parse(raw); } catch { return guiJson(res, { loi: "Dữ liệu gửi lên không phải JSON." }, 400); }
      const sai = kiemTraYeuCau(body);
      if (sai) return guiJson(res, { loi: sai }, 400);
      return guiJson(res, await chamBai(body.code, body.tests, chayTrenMay));
    }
    // File tĩnh (không cho tải mã nguồn của server)
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || p.includes("..") || p.startsWith("/server")) return res.writeHead(403).end();
    try {
      const data = await fs.readFile(f);
      res.writeHead(200, { "content-type": LOAI[path.extname(f).toLowerCase()] || "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Không tìm thấy " + p);
    }
  })
  .listen(PORT, () => {
    console.log(`Website: http://localhost:${PORT}`);
    console.log(`Máy chấm: g++ trên máy này (bash: ${BASH})`);
  });
