/**
 * 一键更新后端 API 地址并重新部署到 GitHub Pages
 *
 * 用法：
 *   npm run update-api -- https://<新的后端地址>
 *   npm run update-api -- https://<新的后端地址> --force   （跳过健康检查）
 *
 * 流程：校验地址 → 健康检查 /api/health → 写入 .env.production
 *       → npm run build → gh-pages 部署 → 提交并推送 .env.production 的变更
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const ENV_FILE = '.env.production';

// ---------- 参数解析 ----------
const args = process.argv.slice(2);
const force = args.includes('--force');
const rawUrl = args.find((a) => !a.startsWith('--'));

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

if (!rawUrl) {
  const current = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8').trim() : '(未配置)';
  console.log('用法: npm run update-api -- https://<后端地址> [--force]');
  console.log(`当前配置: ${current}`);
  process.exit(0);
}

const url = rawUrl.replace(/\/+$/, ''); // 去掉尾部斜杠
if (!/^https:\/\/.+/.test(url)) {
  fail(`地址必须是 https:// 开头（GitHub Pages 是 HTTPS，HTTP 接口会被浏览器拦截）：${rawUrl}`);
}

// ---------- 健康检查 ----------
if (!force) {
  process.stdout.write(`🔍 正在检查 ${url}/api/health ... `);
  try {
    const resp = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(15000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    console.log(`OK（models: ${(data.models ?? []).join(', ') || '未知'}, cuda: ${data.cuda}）`);
  } catch (err) {
    fail(
      `健康检查失败：${err.message}\n` +
        '   后端服务可能未启动或地址有误。确认无误后可用 --force 跳过检查：\n' +
        `   npm run update-api -- ${url} --force`,
    );
  }
}

// ---------- 写入配置 ----------
const content = `VITE_API_BASE_URL=${url}\n`;
const oldContent = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : '';
if (oldContent === content) {
  console.log(`ℹ️  地址未变化（${url}），仍将重新部署一次以确保线上生效。`);
} else {
  writeFileSync(ENV_FILE, content);
  console.log(`✅ 已更新 ${ENV_FILE} -> ${url}`);
}

// ---------- 构建 + 部署 ----------
function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  const r = spawnSync(cmd, { stdio: 'inherit', shell: true });
  if (r.status !== 0) fail(`命令执行失败：${cmd}`);
}

run('npm run build');
run('npx gh-pages -d dist');

// ---------- 同步 git（仅 .env.production 有变更时） ----------
if (oldContent !== content) {
  const add = spawnSync(
    `git add ${ENV_FILE} && git commit -m "chore: 更新后端 API 地址" && git push`,
    { stdio: 'inherit', shell: true },
  );
  if (add.status !== 0) {
    console.warn('\n⚠️  git 提交/推送失败（不影响已部署的网站），可稍后手动提交 .env.production');
  }
}

console.log(`\n🎉 完成！1~2 分钟后生效：https://angel4me.github.io/image-detector-frontend/`);
