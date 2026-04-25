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

    // --- LÓGICA DE SUPABASE ---

    // 1. Función para cargar resúmenes desde la base de datos
    async function loadSummaries() {
        const { data, error } = await supabase
            .from('resumenes')
            .select('*')
            .order('creado_en', { ascending: false });

        if (error) {
            console.error('Error cargando resúmenes:', error);
            return;
        }

        // Limpiar contenedor (excepto los ejemplos estáticos si los quieres mantener)
        // cardsContainer.innerHTML = ''; 

        data.forEach(resumen => {
            renderCard(resumen, false);
        });
        
        updateStats();
    }

    // 2. Función para renderizar una tarjeta en el DOM
    function renderCard(resumen, isNew = false) {
        const date = new Date(resumen.creado_en).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const card = document.createElement('div');
        card.className = 'summary-card';
        card.onclick = () => window.location.href = resumen.contenido_url;
        
        card.innerHTML = `
            <div class="card-image bg-grad-new">
                <span class="subject-tag">${resumen.asignatura}</span>
            </div>
            <div class="card-info">
                <h3>${resumen.titulo}</h3>
                <p>Resumen académico de la asignatura.</p>
                <div class="card-footer">
                    <span class="date">${date}</span>
                    <span class="status">Visto</span>
                </div>
            </div>
        `;

        if (isNew) {
            cardsContainer.prepend(card);
        } else {
            cardsContainer.appendChild(card);
        }
    }

    function updateStats() {
        const countSpan = document.querySelector('.stat-value');
        if (countSpan) {
            countSpan.textContent = String(cardsContainer.children.length).padStart(2, '0');
        }
    }

    // 3. Lógica de Subida Real
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('summaryTitle').value;
        const subject = document.getElementById('summarySubject').value;
        const file = fileInput.files[0];

        if (!file) {
            alert('Por favor, selecciona un archivo HTML');
            return;
        }

        const submitBtn = uploadForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Subiendo...";
        submitBtn.disabled = true;

        try {
            // A. Subir el archivo al Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `archivos/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('resumenes_archivos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // B. Obtener la URL pública del archivo
            const { data: { publicUrl } } = supabase.storage
                .from('resumenes_archivos')
                .getPublicUrl(filePath);

            // C. Guardar metadatos en la tabla 'resumenes'
            const { data: dbData, error: dbError } = await supabase
                .from('resumenes')
                .insert([
                    { 
                        titulo: title, 
                        asignatura: subject, 
                        contenido_url: publicUrl 
                    }
                ])
                .select();

            if (dbError) throw dbError;

            // D. Actualizar UI
            renderCard(dbData[0], true);
            updateStats();
            
            // Reset y cerrar
            uploadForm.reset();
            dropZone.innerHTML = `<p>Arrastra tu archivo HTML aquí o haz clic</p>`;
            uploadModal.classList.remove('active');
            alert('¡Resumen publicado con éxito!');

        } catch (error) {
            console.error('Error en el proceso:', error);
            alert('Hubo un error al subir: ' + error.message);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Cargar datos al iniciar
    loadSummaries();
});

