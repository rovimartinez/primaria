/**
 * Jandra Assistant - Core Logic
 * Reusable component for all classes
 */

const Jandra = {
    interval: null,
    lastPose: 2,
    pitch: 1.5, 
    rate: 1.0,  
    isSpeaking: false,
    
    init() {
        if (document.getElementById('jandra-container')) return;

        // Precargar voces
        window.speechSynthesis.getVoices();

        const style = document.createElement('style');
        style.textContent = `
            .clippy-bubble-tail { position: relative; display: none; }
            .clippy-bubble-tail.active { display: block; }
            .clippy-bubble-tail::after {
                content: '';
                position: absolute;
                bottom: -22px;
                right: 75px;
                border-width: 22px 15px 0;
                border-style: solid;
                border-color: #f97316 transparent;
                filter: drop-shadow(0 5px 5px rgba(0,0,0,0.1));
                z-index: 100;
            }
            #jandra-img { 
                transition: transform 0.3s ease; 
                will-change: transform;
                backface-visibility: hidden;
            }
            #jandra-img:hover { transform: scale(1.05) translateZ(0); }
            
            .animate-jandra-pop { animation: jandraPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            @keyframes jandraPop {
                from { opacity: 0; transform: translateY(20px) scale(0.8); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'jandra-container';
        container.className = 'fixed bottom-6 right-6 z-[1000] flex flex-col items-end pointer-events-none hidden';
        container.innerHTML = `
            <div id="clippy-bubble" class="clippy-bubble-tail bg-orange-50 border-4 border-orange-500 p-5 rounded-3xl mb-2 shadow-2xl max-w-[280px] pointer-events-auto">
                <p id="clippy-text" class="text-lg font-bold text-orange-900 leading-tight"></p>
            </div>
            <img id="jandra-img" src="../jandra/J1.svg" class="w-32 h-32 md:w-40 md:h-40 pointer-events-auto cursor-help object-contain drop-shadow-xl">
        `;
        document.body.appendChild(container);
        
        document.getElementById('jandra-img').onclick = () => {
            if (window.onJandraClick) window.onJandraClick();
        };
    },

    show(text, onDone = null) {
        this.init();
        const container = document.getElementById('jandra-container');
        const textField = document.getElementById('clippy-text');

        // Preparar contenido visual
        let visualText = text.replace(/pista:?/gi, '').trim();
        textField.innerText = visualText;
        container.classList.remove('hidden');

        // La voz controla la animación y la burbuja
        this.speak(text, onDone);
    },

    hide() {
        const bubble = document.getElementById('clippy-bubble');
        if (bubble) {
            bubble.classList.remove('active', 'animate-jandra-pop');
        }
        this.stopAnimation();
    },

    updatePose(pose) {
        const img = document.getElementById('jandra-img');
        if (img) img.src = `../jandra/J${pose}.svg`;
    },

    startAnimation() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.lastPose = this.lastPose === 2 ? 3 : 2;
            this.updatePose(this.lastPose);
        }, 400);
    },

    stopAnimation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.updatePose(1);
    },

    speak(text, onDone = null) {
        window.speechSynthesis.cancel();
        
        setTimeout(() => {
            let cleanText = text.replace(/[✅❌💡]/g, '');
            cleanText = cleanText.replace(/pista:?/gi, '');
            
            const msg = new SpeechSynthesisUtterance(cleanText);
            const voices = window.speechSynthesis.getVoices();
            
            const femaleVoices = voices.filter(v => v.lang.includes('es') && 
                (v.name.toLowerCase().includes('monica') || 
                 v.name.toLowerCase().includes('mónica') || 
                 v.name.toLowerCase().includes('sabina') || 
                 v.name.toLowerCase().includes('helena') || 
                 v.name.toLowerCase().includes('laura') || 
                 v.name.toLowerCase().includes('zira') ||
                 v.name.toLowerCase().includes('google') ||
                 v.name.toLowerCase().includes('female'))
            );
            
            if (femaleVoices.length > 0) {
                msg.voice = femaleVoices[0];
            }
            
            msg.lang = 'es-MX';
            msg.rate = this.rate; 
            msg.pitch = this.pitch; 
            msg.volume = 1.0;

            msg.onstart = () => {
                const bubble = document.getElementById('clippy-bubble');
                if (bubble) bubble.classList.add('active', 'animate-jandra-pop');
                this.startAnimation();
            };

            msg.onend = () => {
                this.hide();
                if (onDone) onDone();
            };

            msg.onerror = () => {
                this.hide();
                if (onDone) onDone();
            };

            window.speechSynthesis.speak(msg);
        }, 100);
    }
};

window.speechSynthesis.getVoices();
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
