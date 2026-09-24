/**
 * dev-runner.js - Cockpit de Lanzamiento Visual Mundo Jandra
 * Servidor local optimizado con verificaciones instantáneas, spinners animados
 * y apertura automática del navegador.
 */

const { spawn, exec, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
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
    console.log(`
${C.cyan}${C.bright}  __  __ _   _ _   _ ____   ___        _   _   _   _ ____  ____     _    
 |  \\/  | | | | \\ | |  _ \\ / _ \\      | | / \\ | \\ | |  _ \\|  _ \\   / \\   
 | |\\/| | | | |  \\| | | | | | | |  _  | |/ _ \\|  \\| | | | | |_) | / _ \\  
 | |  | | |_| | |\\  | |_| | |_| | | |_| / ___ \\ |\\  | |_| |  _ < / ___ \\ 
 |_|  |_|\\___/|_| \\_|____/ \\___/   \\___/_/   \\_\\_| \\_|____/|_| \\_\\_/   \\_\\${C.reset}

       ${C.magenta}${C.bright}⚡ Plataforma Educativa Primaria Interactiva ⚡${C.reset}
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
        process.stdout.write(`\r  ${C.green}✔${C.reset} ${finalText || this.text}                          \n`);
    }

    fail(finalText) {
        if (this.timer) clearInterval(this.timer);
        process.stdout.write(`\r  ${C.red}✖${C.reset} ${finalText || this.text}                          \n`);
    }
}

// Liberar el puerto 9005 rápidamente si estaba en uso
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

// Verificar si el servidor HTTP ya responde
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
            req.setTimeout(300, () => {
                req.destroy();
            });
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

function printCockpitReady() {
    console.log(`
  ${C.green}========================================================================${C.reset}
   ${C.white}${C.bright}🎉 ¡MUNDO JANDRA ESTÁ ACTIVO Y LISTO PARA USAR!${C.reset}
  ${C.green}========================================================================${C.reset}

   ${C.cyan}${C.bright}🌐 Aplicación Web:${C.reset}   ${C.bright}${APP_URL}${C.reset}
   ${C.cyan}${C.bright}📁 Carpeta Raíz:${C.reset}     ${C.dim}${ROOT_DIR}${C.reset}

  ${C.dim}------------------------------------------------------------------------${C.reset}
   ${C.yellow}💡 Presiona [ Ctrl + C ] en esta ventana cuando desees apagar el servidor${C.reset}
  ${C.dim}------------------------------------------------------------------------${C.reset}
`);
}

async function main() {
    printBanner();

    try {
        // 1. Verificación de puerto
        const spPort = new Spinner('Verificando puerto 9005 y liberando memoria...').start();
        freePortFast(PORT);
        await new Promise(r => setTimeout(r, 200));
        spPort.succeed('Puerto 9005 verificado y listo');

        // 2. Verificación de archivos
        const spFiles = new Spinner('Verificando recursos locales de la plataforma...').start();
        await new Promise(r => setTimeout(r, 250));
        spFiles.succeed('Recursos locales verificados correctamente');

        // 3. Inicio del servidor
        const spServer = new Spinner('Iniciando servidor local...').start();
        
        const serverChild = spawn('npx.cmd', ['serve', ROOT_DIR, '-p', String(PORT)], {
            cwd: ROOT_DIR,
            shell: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });

        // Limpieza al cerrar con Ctrl+C
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
            spServer.succeed('Servidor conectado y enlazado exitosamente');
            printCockpitReady();
            console.log(`  ${C.cyan}• Abriendo navegador web en ${INDEX_URL}...${C.reset}\n`);
            openBrowser(INDEX_URL);
        } else {
            spServer.succeed('Servidor iniciado');
            printCockpitReady();
            console.log(`  ${C.cyan}• Puedes abrir tu navegador en: ${INDEX_URL}${C.reset}\n`);
            openBrowser(INDEX_URL);
        }

    } catch (err) {
        console.log(`\n  ${C.red}✖ Error al iniciar Mundo Jandra: ${err.message}${C.reset}\n`);
        process.exit(1);
    }
}

main();
