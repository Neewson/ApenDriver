document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Inicializar popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simulação de login (em um projeto real, isso seria feito via AJAX para um backend)
            if (email && password) {
                window.location.href = 'dashboard.html';
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });
    }
    
    // Formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validação simples
            if (!name || !email || !password || !confirmPassword) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }
            
            // Simulação de registro (em um projeto real, isso seria feito via AJAX para um backend)
            window.location.href = 'dashboard.html';
        });
    }
    
    // Upload de áudio
    const uploadAudioButton = document.getElementById('uploadAudioButton');
    if (uploadAudioButton) {
        uploadAudioButton.addEventListener('click', function() {
            const audioTitle = document.getElementById('audioTitle').value;
            const audioFile = document.getElementById('audioFile').files[0];
            
            if (!audioTitle || !audioFile) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Simulação de upload (em um projeto real, isso seria feito via AJAX para um backend)
            alert('Áudio enviado com sucesso!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadAudioModal'));
            modal.hide();
            
            // Opcional: recarregar a página ou atualizar a lista de áudios
            // window.location.reload();
        });
    }
    
    // Upload de vídeo
    const uploadVideoButton = document.getElementById('uploadVideoButton');
    if (uploadVideoButton) {
        uploadVideoButton.addEventListener('click', function() {
            const videoTitle = document.getElementById('videoTitle').value;
            const videoFile = document.getElementById('videoFile').files[0];
            
            if (!videoTitle || !videoFile) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Simulação de upload (em um projeto real, isso seria feito via AJAX para um backend)
            alert('Vídeo enviado com sucesso!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadVideoModal'));
            modal.hide();
            
            // Opcional: recarregar a página ou atualizar a lista de vídeos
            // window.location.reload();
        });
    }
    
    // Upload de imagem
    const uploadImageButton = document.getElementById('uploadImageButton');
    if (uploadImageButton) {
        uploadImageButton.addEventListener('click', function() {
            const imageTitle = document.getElementById('imageTitle').value;
            const imageFile = document.getElementById('imageFile').files[0];
            
            if (!imageTitle || !imageFile) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Simulação de upload (em um projeto real, isso seria feito via AJAX para um backend)
            alert('Imagem enviada com sucesso!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadImageModal'));
            modal.hide();
            
            // Opcional: recarregar a página ou atualizar a lista de imagens
            // window.location.reload();
        });
    }
    
    // Gráfico de uso de armazenamento (se a página dashboard estiver carregada)
    const storageChartCanvas = document.getElementById('storageChart');
    if (storageChartCanvas) {
        const ctx = storageChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Áudios', 'Vídeos', 'Imagens', 'Outros', 'Livre'],
                datasets: [{
                    data: [15, 30, 20, 10, 25],
                    backgroundColor: [
                        '#4e73df',
                        '#e74a3b',
                        '#1cc88a',
                        '#f6c23e',
                        '#e3e6f0'
                    ],
                    hoverBackgroundColor: [
                        '#2e59d9',
                        '#be3025',
                        '#17a673',
                        '#dda20a',
                        '#c5c9d6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Gráfico de atividade (se a página dashboard estiver carregada)
    const activityChartCanvas = document.getElementById('activityChart');
    if (activityChartCanvas) {
        const ctx = activityChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Uploads',
                    lineTension: 0.3,
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: 'rgba(78, 115, 223, 1)',
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: [0, 10, 5, 15, 10, 20, 15, 25, 20, 30, 25, 40]
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10
                        },
                        grid: {
                            color: 'rgb(233, 236, 244)',
                            zeroLineColor: 'rgb(233, 236, 244)',
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Pesquisa
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Pesquisar em arquivos recentes (se estiverem presentes)
            const recentFiles = document.querySelectorAll('.recent-file');
            if (recentFiles.length > 0) {
                recentFiles.forEach(file => {
                    const fileName = file.querySelector('.file-name').textContent.toLowerCase();
                    if (fileName.includes(searchTerm)) {
                        file.style.display = '';
                    } else {
                        file.style.display = 'none';
                    }
                });
            }
            
            // Pesquisar em áudios (se estiverem presentes)
            const audioItems = document.querySelectorAll('.audio-item');
            if (audioItems.length > 0) {
                audioItems.forEach(item => {
                    const audioTitle = item.querySelector('.audio-title').textContent.toLowerCase();
                    const audioArtist = item.querySelector('.audio-artist').textContent.toLowerCase();
                    if (audioTitle.includes(searchTerm) || audioArtist.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
            
            // Pesquisar em vídeos (se estiverem presentes)
            const videoCards = document.querySelectorAll('.video-card');
            if (videoCards.length > 0) {
                videoCards.forEach(card => {
                    const videoTitle = card.querySelector('.card-title').textContent.toLowerCase();
                    if (videoTitle.includes(searchTerm)) {
                        card.parentElement.style.display = '';
                    } else {
                        card.parentElement.style.display = 'none';
                    }
                });
            }
            
            // Pesquisar em imagens (se estiverem presentes)
            const imageCards = document.querySelectorAll('.image-card');
            if (imageCards.length > 0) {
                imageCards.forEach(card => {
                    const imageTitle = card.querySelector('.card-title').textContent.toLowerCase();
                    if (imageTitle.includes(searchTerm)) {
                        card.parentElement.style.display = '';
                    } else {
                        card.parentElement.style.display = 'none';
                    }
                });
            }
        });
    }
});
