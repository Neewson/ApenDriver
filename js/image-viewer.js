document.addEventListener('DOMContentLoaded', function() {
    // Elementos do visualizador de imagens
    const imageViewerModal = document.getElementById('imageViewerModal');
    const imageViewerTitle = document.getElementById('imageViewerTitle');
    const imageViewerImg = document.getElementById('imageViewerImg');
    const prevImageBtn = document.getElementById('prevImageBtn');
    const nextImageBtn = document.getElementById('nextImageBtn');
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    const shareImageBtn = document.getElementById('shareImageBtn');
    
    // Botões de visualização
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    // Imagens disponíveis
    const imageCards = document.querySelectorAll('.image-card');
    let currentImageIndex = 0;
    
    // Inicializar o visualizador
    function initImageViewer() {
        // Adicionar eventos aos botões do visualizador
        prevImageBtn.addEventListener('click', showPreviousImage);
        nextImageBtn.addEventListener('click', showNextImage);
        downloadImageBtn.addEventListener('click', downloadCurrentImage);
        shareImageBtn.addEventListener('click', shareCurrentImage);
        
        // Adicionar eventos aos botões de visualização
        gridViewBtn.addEventListener('click', switchToGridView);
        listViewBtn.addEventListener('click', switchToListView);
        
        // Adicionar eventos aos botões de visualização de imagem
        const viewButtons = document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#imageViewerModal"]');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const imageSrc = this.getAttribute('data-image');
                const imageTitle = this.getAttribute('data-title');
                
                // Encontrar o índice da imagem atual
                imageCards.forEach((card, index) => {
                    const cardButton = card.querySelector('[data-bs-toggle="modal"][data-bs-target="#imageViewerModal"]');
                    if (cardButton && cardButton.getAttribute('data-image') === imageSrc) {
                        currentImageIndex = index;
                    }
                });
                
                // Carregar a imagem no visualizador
                imageViewerImg.src = imageSrc;
                imageViewerTitle.textContent = imageTitle;
            });
        });
    }
    
    // Mostrar a imagem anterior
    function showPreviousImage() {
        if (imageCards.length <= 1) return;
        
        currentImageIndex = (currentImageIndex - 1 + imageCards.length) % imageCards.length;
        const prevCard = imageCards[currentImageIndex];
        const prevButton = prevCard.querySelector('[data-bs-toggle="modal"][data-bs-target="#imageViewerModal"]');
        
        if (prevButton) {
            const imageSrc = prevButton.getAttribute('data-image');
            const imageTitle = prevButton.getAttribute('data-title');
            
            imageViewerImg.src = imageSrc;
            imageViewerTitle.textContent = imageTitle;
        }
    }
    
    // Mostrar a próxima imagem
    function showNextImage() {
        if (imageCards.length <= 1) return;
        
        currentImageIndex = (currentImageIndex + 1) % imageCards.length;
        const nextCard = imageCards[currentImageIndex];
        const nextButton = nextCard.querySelector('[data-bs-toggle="modal"][data-bs-target="#imageViewerModal"]');
        
        if (nextButton) {
            const imageSrc = nextButton.getAttribute('data-image');
            const imageTitle = nextButton.getAttribute('data-title');
            
            imageViewerImg.src = imageSrc;
            imageViewerTitle.textContent = imageTitle;
        }
    }
    
    // Baixar a imagem atual
    function downloadCurrentImage() {
        const imageSrc = imageViewerImg.src;
        const imageName = imageViewerTitle.textContent || 'image';
        
        // Criar um link temporário para download
        const downloadLink = document.createElement('a');
        downloadLink.href = imageSrc;
        downloadLink.download = imageName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    
    // Compartilhar a imagem atual
    function shareCurrentImage() {
        const imageSrc = imageViewerImg.src;
        const imageTitle = imageViewerTitle.textContent || 'Imagem';
        
        // Verificar se a API Web Share está disponível
        if (navigator.share) {
            navigator.share({
                title: imageTitle,
                text: 'Confira esta imagem!',
                url: imageSrc
            })
            .catch(error => console.log('Erro ao compartilhar:', error));
        } else {
            // Fallback para navegadores que não suportam a API Web Share
            alert('Compartilhamento não suportado neste navegador.');
        }
    }
    
    // Alternar para visualização em grade
    function switchToGridView() {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        gridView.classList.remove('d-none');
        listView.classList.add('d-none');
    }
    
    // Alternar para visualização em lista
    function switchToListView() {
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
        gridView.classList.add('d-none');
        listView.classList.remove('d-none');
    }
    
    // Inicializar o visualizador
    initImageViewer();
});
