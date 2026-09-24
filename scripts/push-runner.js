/**
 * push-runner.js - Cockpit de Sincronización GitHub para Mundo Jandra
 * Consola interactiva con arte ASCII, spinners animados, estado de archivos y despliegue a GitHub.
 */

const { execSync, spawn } = require('child_process');
const readline = require('readline');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const REPO_URL = 'https://github.com/rovimartinez/primaria';

// Colores ANSI y estilos
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
    white: '\x1b[37m',
    gray: '\x1b[90m',
    bgBlue: '\x1b[44m',
    bgGreen: '\x1b[42m',
    bgMagenta: '\x1b[45m'
};

function printBanner() {
    console.clear();
    console.log(`
${C.cyan}${C.bright} ███╗   ███╗██╗   ██╗███╗   ██╗██████╗  ██████╗      ██╗ █████╗ ███╗   ██╗██████╗ ██████╗  █████╗ 
 ████╗ ████║██║   ██║████╗  ██║██╔══██╗██╔═══██╗     ██║██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔══██╗
 ██╔████╔██║██║   ██║██╔██╗ ██║██║  ██║██║   ██║     ██║███████║██╔██╗ ██║██║  ██║██████╔╝███████║
 ██║╚██╔╝██║██║   ██║██║╚██╗██║██║  ██║██║   ██║██   ██║██╔══██║██║╚██╗██║██║  ██║██╔══██╗██╔══██║
 ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██████╔╝╚██████╔╝╚█████╔╝██║  ██║██║ ╚████║██████╔╝██║  ██║██║  ██║
 ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝  ╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝${C.reset}

      ${C.magenta}${C.bright}🚀  Cockpit de Sincronización GitHub  •  Mundo Jandra  🚀${C.reset}
`);
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
            process.stdout.write(`\r  ${C.cyan}${frame}${C.reset} ${this.text}   `);
            this.frameIdx = (this.frameIdx + 1) % this.frames.length;
        }, 70);
        return this;
    }

    succeed(finalText) {
        if (this.timer) clearInterval(this.timer);
        process.stdout.write(`\r  ${C.green}✓${C.reset} ${finalText || this.text}                                          \n`);
    }

    fail(finalText) {
        if (this.timer) clearInterval(this.timer);
        process.stdout.write(`\r  ${C.red}✖${C.reset} ${finalText || this.text}                                          \n`);
    }

    info(finalText) {
        if (this.timer) clearInterval(this.timer);
        process.stdout.write(`\r  ${C.blue}ℹ${C.reset} ${finalText || this.text}                                          \n`);
    }
}

function runGit(command) {
    return execSync(command, { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function promptUser(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
    }));
}

async function main() {
    printBanner();

    // 1. Verificar Git instalado
    try {
        execSync('git --version', { stdio: 'ignore' });
    } catch {
        console.log(`  ${C.red}✖ Git no está instalado o no se encuentra en el PATH de Windows.${C.reset}\n`);
        return;
    }

    // 2. Comprobar repositorio Git
    const spCheck = new Spinner('Verificando repositorio Git...').start();
    let isNewRepo = false;
    try {
        runGit('git status');
        spCheck.succeed('Repositorio Git local verificado correctamente');
    } catch {
        spCheck.info('Inicializando nuevo repositorio Git...');
        try {
            runGit('git init');
            runGit('git branch -M main');
            isNewRepo = true;
            console.log(`  ${C.green}✓${C.reset} Repositorio Git inicializado.`);
        } catch (e) {
            spCheck.fail('Error al inicializar repositorio Git');
            console.error(e);
            return;
        }
    }

    // 3. Configurar remoto
    const spRemote = new Spinner('Configurando conexión con GitHub...').start();
    try {
        let currentRemote = '';
        try {
            currentRemote = runGit('git remote get-url origin').trim();
        } catch {}

        if (!currentRemote) {
            runGit(`git remote add origin ${REPO_URL}.git`);
            spRemote.succeed(`Remoto configurado: ${C.bright}${REPO_URL}${C.reset}`);
        } else if (currentRemote !== `${REPO_URL}.git` && currentRemote !== REPO_URL) {
            runGit(`git remote set-url origin ${REPO_URL}.git`);
            spRemote.succeed(`Remoto actualizado a: ${C.bright}${REPO_URL}${C.reset}`);
        } else {
            spRemote.succeed(`Conectado a: ${C.bright}${REPO_URL}${C.reset}`);
        }
    } catch (e) {
        spRemote.fail('Error al configurar el repositorio remoto');
    }

    // 4. Obtener rama activa
    let branch = 'main';
    try {
        branch = runGit('git branch --show-current').trim() || 'main';
    } catch {}

    // 5. Analizar cambios
    console.log(`\n  ${C.bright}${C.cyan}┌── ESTADO DE ARCHIVOS LOCALES ──${C.reset}`);
    let statusOutput = '';
    try {
        statusOutput = runGit('git status --porcelain');
    } catch {}

    const lines = statusOutput.split('\n').map(l => l.trimEnd()).filter(Boolean);

    let modifiedCount = 0;
    let addedCount = 0;
    let untrackedCount = 0;
    let deletedCount = 0;

    if (lines.length === 0) {
        console.log(`  ${C.cyan}│${C.reset}  ${C.green}✨ Todo limpio: No hay cambios pendientes por subir.${C.reset}`);
    } else {
        const previewLimit = 8;
        lines.slice(0, previewLimit).forEach(line => {
            const flag = line.substring(0, 2);
            const file = line.substring(3);
            if (flag.includes('M')) {
                modifiedCount++;
                console.log(`  ${C.cyan}│${C.reset}  ${C.yellow}● MODIFICADO:${C.reset} ${file}`);
            } else if (flag.includes('A')) {
                addedCount++;
                console.log(`  ${C.cyan}│${C.reset}  ${C.green}+ AGREGADO:  ${C.reset} ${file}`);
            } else if (flag.includes('D')) {
                deletedCount++;
                console.log(`  ${C.cyan}│${C.reset}  ${C.red}- ELIMINADO: ${C.reset} ${file}`);
            } else if (flag.includes('?')) {
                untrackedCount++;
                console.log(`  ${C.cyan}│${C.reset}  ${C.blue}★ NUEVO:     ${C.reset} ${file}`);
            } else {
                console.log(`  ${C.cyan}│${C.reset}  ${C.gray}• ${line}${C.reset}`);
            }
        });

        lines.slice(previewLimit).forEach(line => {
            const flag = line.substring(0, 2);
            if (flag.includes('M')) modifiedCount++;
            else if (flag.includes('A')) addedCount++;
            else if (flag.includes('D')) deletedCount++;
            else if (flag.includes('?')) untrackedCount++;
        });

        if (lines.length > previewLimit) {
            console.log(`  ${C.cyan}│${C.reset}  ${C.gray}... y ${lines.length - previewLimit} archivos más.${C.reset}`);
        }
    }

    console.log(`  ${C.cyan}│${C.reset}  ${C.dim}Total de cambios:${C.reset} ${C.bright}${lines.length}${C.reset} ${C.gray}(Rama: ${branch})${C.reset}`);
    console.log(`  ${C.cyan}└──────────────────────────────────${C.reset}\n`);

    if (lines.length === 0) {
        const pushAnyway = await promptUser(`  ${C.yellow}¿Deseas forzar un sync/push de todos modos? (s/N): ${C.reset}`);
        if (pushAnyway.toLowerCase() !== 's' && pushAnyway.toLowerCase() !== 'si' && pushAnyway.toLowerCase() !== 'y') {
            console.log(`\n  ${C.green}👋 Repositorio al día. Nada que subir.${C.reset}\n`);
            return;
        }
    }

    // 6. Solicitar mensaje de commit interactivo
    const defaultMsg = `Actualización plataforma Mundo Jandra: ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
    console.log(`  ${C.bright}Mensaje de Confirmación (Commit):${C.reset}`);
    console.log(`  ${C.dim}Presiona [ENTER] para usar mensaje por defecto:${C.reset}`);
    console.log(`  ${C.gray}"${defaultMsg}"${C.reset}`);
    
    let commitMsg = await promptUser(`\n  ${C.cyan}➜ Tu mensaje:${C.reset} `);
    if (!commitMsg) {
        commitMsg = defaultMsg;
    }

    console.log('');

    // 7. git add .
    const spAdd = new Spinner('Indexando todos los archivos cambiados (git add .)...').start();
    try {
        runGit('git add .');
        spAdd.succeed('Archivos indexados y listos para confirmar');
    } catch (e) {
        spAdd.fail('Error al indexar archivos');
        console.error(e.message);
        return;
    }

    // 8. git commit
    const spCommit = new Spinner('Creando punto de guardado (commit)...').start();
    try {
        const commitResult = runGit(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
        spCommit.succeed(`Commit creado con éxito: "${C.bright}${commitMsg}${C.reset}"`);
    } catch (e) {
        if (e.stdout && e.stdout.includes('nothing to commit')) {
            spCommit.info('No había cambios pendientes para un nuevo commit.');
        } else {
            spCommit.fail('Error al crear el commit');
            console.error(e.message || e);
        }
    }

    // 9. git push origin branch
    const spPush = new Spinner(`Subiendo cambios a GitHub (${C.bright}origin/${branch}${C.reset})...`).start();
    try {
        runGit(`git push -u origin ${branch}`);
        spPush.succeed(`¡Cambios subidos exitosamente a GitHub rama ${C.bright}${branch}${C.reset}!`);
    } catch (e) {
        spPush.fail(`Error durante git push a origin/${branch}`);
        console.log(`\n  ${C.yellow}⚠ Detalle del error:${C.reset}`);
        console.log(C.red + (e.stderr || e.stdout || e.message) + C.reset);
        console.log(`\n  ${C.dim}Tip: Si es tu primera vez, asegúrate de haber iniciado sesión en Git/GitHub Credentials Manager.${C.reset}\n`);
        return;
    }

    // 10. Dashboard final de éxito
    console.log(`
  ${C.bgGreen}${C.bright}${C.white}  ✔ DESPLIEGUE EXITOSO A GITHUB  ${C.reset}

  ${C.cyan}┌─────────────────────────────────────────────────────────────┐${C.reset}
  ${C.cyan}│${C.reset}  ${C.bright}Repositorio:${C.reset}  ${C.white}${REPO_URL}${C.reset}
  ${C.cyan}│${C.reset}  ${C.bright}Rama:${C.reset}         ${C.green}${branch}${C.reset}
  ${C.cyan}│${C.reset}  ${C.bright}Mensaje:${C.reset}      ${C.yellow}"${commitMsg}"${C.reset}
  ${C.cyan}│${C.reset}  ${C.bright}Estado:${C.reset}       ${C.green}Sincronizado al 100%${C.reset} 🚀
  ${C.cyan}└─────────────────────────────────────────────────────────────┘${C.reset}
`);
}

main().catch(err => {
    console.error(`\n  ${C.red}✖ Error inesperado:${C.reset}`, err);
});
