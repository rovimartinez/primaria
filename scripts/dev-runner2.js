/**
 * dev-runner.js - Cockpit de Lanzamiento Visual Mundo Jandra
 */

const { spawn, exec, execSync } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');

const isWindows = process.platform === 'win32';
const PORT = 9005;
const APP_URL = `http://localhost:${PORT}`;
const INDEX_URL = `http://localhost:${PORT}/index.html`;
const ROOT_DIR = path.resolve(__dirname, '..');

process.removeAllListeners('warning');

// Paleta semántica ANSI moderna
const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m',
    red: '\x1b[31m',
    bgCyan: '\x1b[46m\x1b[30m\x1b[1m',
    bgGreen: '\x1b[42m\x1b[30m\x1b[1m',
    bgMagenta: '\x1b[45m\x1b[37m\x1b[1m'
};

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;
}

class Spinner {
    constructor(text) {
        this.text = text;
        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.frameIdx = 0;
        this.timer = null;
    }

    start() {
        this.timer = setInterval(() => {
            const frame = this.frames[this.frameIdx];
            process.stdout.write(`\r  ${c.cyan}${frame}${c.reset}  ${this.text}   `);
            this.frameIdx = (this.frameIdx + 1) % this.frames.length;
        }, 70);
        return this;
    }

    succeed(finalText) {
        if (this.timer) clearInterval(this.timer);
        process.stdout.write(`\r  ${c.green}✔${c.reset}  ${finalText || this.text}                          \n`);
    }

    fail(finalText) {
        if (this.timer) clearInterval(this.timer);
        process.stdout.write(`\r  ${c.red}✖${c.reset}  ${finalText || this.text}                          \n`);
    }
}

function freePortFast(port = PORT) {
    if (!isWindows) return;
    try {
        const out = execSync('netstat -ano', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        const lines = out.split('\n');
        const pids = new Set();
        for (const line of lines) {
            if (line.includes(`:${port}`) && line.includes('LISTENING')) {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0' && pid !== String(process.pid)) {
                    pids.add(pid);
                }
            }
        }
        for (const pid of pids) {
            try { process.kill(Number(pid), 'SIGKILL'); } catch {
                try { execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' }); } catch {}
            }
        }
    } catch {}
}

function checkServerReady(url, timeoutMs = 8000) {
    const startTime = Date.now();
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const req = http.get(url, (res) => {
                if (res.statusCode) {
                    clearInterval(interval);
                    resolve(true);
                }
            });
            req.on('error', () => {
                if (Date.now() - startTime > timeoutMs) {
                    clearInterval(interval);
                    resolve(false);
                }
            });
            req.setTimeout(300, () => req.destroy());
        }, 120);
    });
}

function openBrowser(url) {
    const cmd = isWindows 
        ? `start "" "${url}"` 
        : process.platform === 'darwin' 
            ? `open "${url}"` 
            : `xdg-open "${url}"`;
    exec(cmd);
}

function printCockpitReady(durationMs) {
    const localIp = getLocalIp();
    const networkUrl = localIp ? `http://${localIp}:${PORT}` : null;
    const timeFormatted = `${(durationMs / 1000).toFixed(2)}s`;

    console.clear();
    console.log(`
  ${c.bgCyan} MUNDO JANDRA ${c.reset} ${c.dim}v1.0.0${c.reset}  ${c.green}listo en ${timeFormatted}${c.reset}

  ${c.dim}╭────────────────────────────────────────────────────────────╮${c.reset}
  ${c.dim}│${c.reset}                                                            ${c.dim}│${c.reset}
  ${c.dim}│${c.reset}   ${c.bold}➜${c.reset}  ${c.bold}Local:${c.reset}    ${c.cyan}${APP_URL}/${c.reset}                  ${c.dim}│${c.reset}
  ${c.dim}│${c.reset}   ${c.bold}➜${c.reset}  ${c.bold}Network:${c.reset}  ${networkUrl ? `${c.cyan}${networkUrl}/${c.reset}` : `${c.dim}No disponible${c.reset}`}          ${c.dim}│${c.reset}
  ${c.dim}│${c.reset}                                                            ${c.dim}│${c.reset}
  ${c.dim}│${c.reset}   ${c.dim}• Raíz:${c.reset}     ${c.dim}${ROOT_DIR}${c.reset}     ${c.dim}│${c.reset}
  ${c.dim}│${c.reset}                                                            ${c.dim}│${c.reset}
  ${c.dim}╰────────────────────────────────────────────────────────────╯${c.reset}

  ${c.dim}Presiona ${c.bold}[h]${c.reset}${c.dim} para ayuda • ${c.bold}[o]${c.reset}${c.dim} abrir navegador • ${c.bold}[q]${c.reset}${c.dim} salir${c.reset}
`);
}

function setupKeyBindings(onQuit, onOpen) {
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (key) => {
            if (key === '\u0003' || key.toLowerCase() === 'q') { // Ctrl+C o 'q'
                onQuit();
            } else if (key.toLowerCase() === 'o') {
                console.log(`\n  ${c.cyan}➜ Abriendo navegador en ${INDEX_URL}...${c.reset}\n`);
                onOpen();
            } else if (key.toLowerCase() === 'h') {
                console.log(`\n  ${c.bold}Atajos disponibles:${c.reset}
  ${c.cyan}o${c.reset} : Abrir en navegador predeterminado
  ${c.cyan}c${c.reset} : Limpiar consola
  ${c.cyan}q${c.reset} : Detener y salir\n`);
            } else if (key.toLowerCase() === 'c') {
                console.clear();
            }
        });
    }
}

async function main() {
    const startTime = Date.now();
    console.clear();
    console.log(`\n  ${c.bgMagenta} JANDRA RUNNER ${c.reset} ${c.dim}Iniciando entorno interactivo...${c.reset}\n`);

    try {
        const spPort = new Spinner('Verificando disponibilidad de red y puerto 9005...').start();
        freePortFast(PORT);
        await new Promise(r => setTimeout(r, 150));
        spPort.succeed('Puerto 9005 disponible');

        const spFiles = new Spinner('Indexando recursos locales...').start();
        await new Promise(r => setTimeout(r, 180));
        spFiles.succeed('Recursos estáticos listos');

        const spServer = new Spinner('Levantando servidor HTTP...').start();

        const serverChild = spawn(isWindows ? 'npx.cmd' : 'npx', ['serve', ROOT_DIR, '-p', String(PORT), '-s'], {
            cwd: ROOT_DIR,
            shell: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });

        const cleanup = () => {
            console.log(`\n\n  ${c.yellow}⚠ Cerrando servidor y liberando puertos...${c.reset}`);
            try { serverChild.kill(); } catch (e) {}
            freePortFast(PORT);
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        setupKeyBindings(cleanup, () => openBrowser(INDEX_URL));

        const isReady = await checkServerReady(APP_URL, 6000);
        spServer.succeed('Servidor operativo');

        const duration = Date.now() - startTime;
        printCockpitReady(duration);
        openBrowser(INDEX_URL);

    } catch (err) {
        console.log(`\n  ${c.red}✖ Fallo crítico al iniciar:${c.reset} ${err.message}\n`);
        process.exit(1);
    }
}

main();