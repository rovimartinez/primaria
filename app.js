document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close-btn');
    const uploadForm = document.getElementById('uploadForm');
    const cardsContainer = document.getElementById('cardsContainer');
    const searchInput = document.querySelector('.search-box input');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    // Modal Logic
    uploadBtn.addEventListener('click', () => {
        uploadModal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        uploadModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            uploadModal.classList.remove('active');
        }
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.summary-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const subject = card.querySelector('.subject-tag').textContent.toLowerCase();
            
            if (title.includes(term) || subject.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Drop Zone Logic
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        dropZone.innerHTML = `<p style="color: #6366f1; font-weight: 700;">📄 ${file.name} seleccionado</p>`;
    }

    // Mock Upload Logic
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('summaryTitle').value;
        const subject = document.getElementById('summarySubject').value;
        const fileName = fileInput.files[0] ? fileInput.files[0].name : "nuevo-resumen.html";
        
        const date = new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const newCard = document.createElement('div');
        newCard.className = 'summary-card';
        // En un entorno real, aquí subiríamos el archivo y usaríamos su URL
        // Como es un mock, simplemente simulamos el enlace
        newCard.onclick = () => alert(`Simulación: El archivo "${fileName}" se guardaría en la carpeta "clases/" y se abriría desde allí.`);
        
        newCard.innerHTML = `
            <div class="card-image bg-grad-new">
                <span class="subject-tag">${subject}</span>
            </div>
            <div class="card-info">
                <h3>${title}</h3>
                <p>Resumen recién subido a la plataforma.</p>
                <div class="card-footer">
                    <span class="date">${date}</span>
                    <span class="status" style="color: #f59e0b;">Pendiente</span>
                </div>
            </div>
        `;

        cardsContainer.prepend(newCard);
        
        // Reset and close
        uploadForm.reset();
        dropZone.innerHTML = `<p>Arrastra tu archivo HTML aquí o haz clic</p>`;
        uploadModal.classList.remove('active');
        
        // Update stats
        const countSpan = document.querySelector('.stat-value');
        countSpan.textContent = String(cardsContainer.children.length).padStart(2, '0');
    });
});
