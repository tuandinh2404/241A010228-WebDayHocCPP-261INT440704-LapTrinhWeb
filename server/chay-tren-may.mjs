// chay-tren-may.mjs — chạy gói chấm (main.cpp, in1..inN, compile, run) bằng bash + g++ trong một thư mục tạm.
// Trả về { trangThai: "ok" | "bienDich" | "quaGio" | "loi", stdout, bienDich, thongBao } cho harness.mjs.
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

// Tìm bash: trên Windows dùng Git Bash (đi kèm Git), máy khác dùng bash có sẵn
function timBash() {
  if (process.env.BASH_PATH) return process.env.BASH_PATH;
  if (process.platform !== "win32") return "bash";
  for (const p of ["C:/Program Files/Git/bin/bash.exe", "C:/Program Files (x86)/Git/bin/bash.exe"]) if (existsSync(p)) return p;
  return "bash";
}
export const BASH = timBash();

// Giới hạn số bài chấm cùng lúc: cả lớp bấm nộp một lượt thì các bài xếp hàng, máy không bị quá tải.
export const TOI_DA_CHAM_CUNG_LUC = Number(process.env.CHAM_CUNG_LUC) || 4;
let dangCham = 0;
const hangDoi = [];
async function xepHang(viec) {
  if (dangCham >= TOI_DA_CHAM_CUNG_LUC) await new Promise((r) => hangDoi.push(r));
  dangCham++;
  try {
    return await viec();
  } finally {
    dangCham--;
    hangDoi.shift()?.();
  }
}

export function chayTrenMay(files) {
  return xepHang(async () => {
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
  });
}
