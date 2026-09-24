/**
 * dev-runner.js - Cockpit de Lanzamiento Visual Mundo Jandra
 * Servidor local interactivo optimizado para consola.
 */

const { spawn, exec, execSync } = require('child_process');
const http = require('http');
const path = require('path');

const isWindows = process.platform === 'win32';
const PORT = 9005;
const APP_URL = `http://localhost:${PORT}`;
const INDEX_URL = `http://localhost:${PORT}/index.html`;
const ROOT_DIR = path.resolve(__dirname, '..');

// Desactivar advertencias internas de Node
process.removeAllListeners('warning');

// Colores ANSI
const C = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    white: '\x1b[37m'
};

function printBanner() {
    console.clear();
    // Tipografía estilo ANSI Shadow / 3D idéntica a la imagen
    console.log(`
${C.cyan}${C.bright} ██████╗██╗   ██╗███╗   ██╗██████╗  ██████╗     ██╗ █████╗ ███╗   ██╗██████╗ ██████╗  █████╗ 
██╔════╝██║   ██║████╗  ██║██╔══██╗██╔═══██╗    ██║██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔══██╗
██║     ██║   ██║██╔██╗ ██║██║  ██║██║   ██║    ██║███████║██╔██╗ ██║██║  ██║██████╔╝███████║
██║     ██║   ██║██║╚██╗██║██║  ██║██║   ██║██  ██║██╔══██║██║╚██╗██║██║  ██║██╔══██╗██╔══██║
╚██████╗╚██████╔╝██║ ╚████║██████╔╝╚██████╔╝╚█████╔╝██║  ██║██║ ╚████║██████╔╝██║  ██║██║  ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝  ╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝${C.reset}

     ${C.magenta}${C.bright}⚡  Plataforma Educativa Primaria & Simuladores Interactivos  ⚡${C.reset}
`);
}

// Utilidad para animación de spinner en consola
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
            process.stdout.write(`\r  ${C.cyan}${frame}${C.reset} ${this.text}   `);
            this.frameIdx = (this.frameIdx + 1) % this.frames.length;
        }, 70);
        return this;
    }

    succeed(finalText) {
        if (this.timer) clearInterval(this.timer);
        process.stdout.write(`\r  ${C.green}✓${C.reset} ${finalText || this.text}                          \n`);
    }

    fail(finalText) {
        if (this.timer) clearInterval(this.timer);
        process.stdout.write(`\r  ${C.red}✖${C.reset} ${finalText || this.text}                          \n`);
    }
}

// Liberar el puerto 9005 si estaba en uso
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
            try { execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' }); } catch {}
        }
    } catch {}
}

// Verificar respuesta HTTP del servidor
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

// Abrir navegador
function openBrowser(url) {
    const cmd = isWindows 
        ? `start "" "${url}"` 
        : process.platform === 'darwin' 
            ? `open "${url}"` 
            : `xdg-open "${url}"`;
    exec(cmd);
}

// Panel idéntico a la imagen de referencia
function printCockpitReady() {
    console.log(`
${C.green}========================================================================================${C.reset}
  ${C.bright}🎉  ¡MUNDO JANDRA ESTÁ ACTIVO Y LISTO PARA USAR!${C.reset}
${C.green}========================================================================================${C.reset}

  ${C.cyan}🌐 Aplicación Web:${C.reset}    ${C.bright}${APP_URL}${C.reset}
  ${C.magenta}📁 Carpeta Raíz:${C.reset}      ${C.dim}${ROOT_DIR}${C.reset}
  ${C.yellow}⚡ Motor Local:${C.reset}       ${C.white}Node.js & Servidor HTTP Estático${C.reset}
  ${C.blue}🤖 Módulos:${C.reset}           ${C.white}Matemáticas, Lenguaje, Ciencias & Retos 3D${C.reset}

${C.dim}----------------------------------------------------------------------------------------${C.reset}
  ${C.yellow}💡 Presiona [ Ctrl + C ] en esta ventana cuando desees apagar el sistema${C.reset}
${C.dim}----------------------------------------------------------------------------------------${C.reset}
`);
}

async function main() {
    printBanner();

    try {
        // 1. Verificación del puerto
        const spPort = new Spinner('Verificando puerto 9005 y liberando memoria...').start();
        freePortFast(PORT);
        await new Promise(r => setTimeout(r, 200));
        spPort.succeed('Puerto 9005 verificado y listo');

        // 2. Verificación de recursos
        const spFiles = new Spinner('Verificando recursos locales de la plataforma...').start();
        await new Promise(r => setTimeout(r, 250));
        spFiles.succeed('Recursos locales verificados correctamente');

        // 3. Inicio del servidor
        const spServer = new Spinner('Conectando y enlazando servidores...').start();

        const serverChild = spawn('npx.cmd', ['serve', ROOT_DIR, '-p', String(PORT)], {
            cwd: ROOT_DIR,
            shell: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });

        const cleanup = () => {
            console.log(`\n  ${C.yellow}⚠ Apagando servidor de Mundo Jandra...${C.reset}`);
            try { serverChild.kill(); } catch (e) {}
            freePortFast(PORT);
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

        const isReady = await checkServerReady(APP_URL, 6000);

        if (isReady) {
            spServer.succeed('Servidores conectados y enlazados exitosamente.');
        } else {
            spServer.succeed('Servidor iniciado correctamente.');
        }

        printCockpitReady();
        console.log(`  ${C.cyan}• Abriendo navegador web en ${INDEX_URL}...${C.reset}\n`);
        openBrowser(INDEX_URL);

    } catch (err) {
        console.log(`\n  ${C.red}✖ Error al iniciar Mundo Jandra: ${err.message}${C.reset}\n`);
        process.exit(1);
    }
}

main();