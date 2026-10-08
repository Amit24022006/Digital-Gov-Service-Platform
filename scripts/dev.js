import { spawn, execSync } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const MONGO_PORT = 27017;
const API_PORT = 5000;
const WEB_PORT = 5173;

const isWin = process.platform === 'win32';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPortOpen = (port) =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });

const ensureMongo = async () => {
  if (await isPortOpen(MONGO_PORT)) {
    console.log('🍃 MongoDB is already running on port 27017 (data is permanent).');
    return;
  }

  console.log('🍃 Starting MongoDB Windows service so data stays saved...');
  if (isWin) {
    try {
      execSync('net start MongoDB', { stdio: 'ignore' });
    } catch {
      try {
        execSync('powershell -NoProfile -Command "Start-Service MongoDB"', { stdio: 'ignore' });
      } catch {
        // continue to retry the port
      }
    }
  }

  for (let i = 0; i < 20; i += 1) {
    if (await isPortOpen(MONGO_PORT)) {
      console.log('🍃 MongoDB is running. Users, logins, and schemes persist in the govdesk database.');
      return;
    }
    await wait(500);
  }

  console.error('');
  console.error('❌ MongoDB is not running on 27017.');
  console.error('   On Windows: open Services and start "MongoDB", or install MongoDB Community Server.');
  console.error('   Without MongoDB, register/login will not save.');
  process.exit(1);
};

const startNpm = (cwd, name) => {
  const child = spawn('npm', ['run', 'dev'], {
    cwd,
    stdio: 'inherit',
    shell: isWin,
    env: process.env
  });
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`❌ ${name} exited with code ${code}`);
    }
  });
  return child;
};

await ensureMongo();

const children = [];

if (await isPortOpen(API_PORT)) {
  console.log('📡 API already running on http://127.0.0.1:5000');
} else {
  console.log('📡 Starting API server...');
  children.push(startNpm(path.join(ROOT, 'server'), 'API'));
}

if (await isPortOpen(WEB_PORT)) {
  console.log('🌐 Website already running on http://localhost:5173');
} else {
  console.log('🌐 Starting website (browser will open)...');
  children.push(startNpm(path.join(ROOT, 'client'), 'Website'));
}

console.log('');
console.log('====================================================');
console.log('  GovDesk full app');
console.log('  Website:  http://localhost:5173');
console.log('  API:      http://127.0.0.1:5000/api');
console.log('  MongoDB:  mongodb://127.0.0.1:27017/govdesk');
console.log('====================================================');
console.log('  Registered users stay in MongoDB after you close npm.');
console.log('  Press Ctrl+C to stop the website and API.');
console.log('');

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      if (isWin) {
        spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', shell: true });
      } else {
        child.kill('SIGTERM');
      }
    }
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
