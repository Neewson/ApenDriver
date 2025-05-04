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
// URL base da API
const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let currentImageIndex = 0;
let images = [];

// Função para carregar arquivos de imagem
async function loadImageFiles() {
  try {
    const response = await fetch(`${API_URL}/images`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      images = data.data;
      displayImageFiles(images);
    } else {
      throw new Error(data.error || 'Falha ao carregar arquivos de imagem');
    }
  } catch (error) {
    console.error('Erro ao carregar imagens:', error);
    showAlert('Erro ao carregar arquivos de imagem', 'danger');
  }
}

// Função para exibir arquivos de imagem na interface
function displayImageFiles(imageFiles) {
  const imageGallery = document.getElementById('image-gallery');
  if (!imageGallery) return;

  imageGallery.innerHTML = '';

  if (imageFiles.length === 0) {
    imageGallery.innerHTML = '<div class="alert alert-info">Nenhuma imagem encontrada.</div>';
    return;
  }

  imageFiles.forEach((image, index) => {
    const imageCard = document.createElement('div');
    imageCard.className = 'col-md-3 col-sm-6 mb-4';
    imageCard.innerHTML = `
      <div class="card h-100">
        <img src="${API_URL}/images/${image._id}/view" class="card-img-top img-thumbnail gallery-img" alt="${image.name}" data-index="${index}">
        <div class="card-body">
          <h5 class="card-title text-truncate">${image.name}</h5>
          <p class="card-text">
            <small class="text-muted">Tamanho: ${formatBytes(image.size)}</small>
          </p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-primary btn-sm view-btn" data-index="${index}">
              <i class="fas fa-eye"></i> Ver
            </button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${image._id}">
              <i class="fas fa-trash"></i> Excluir
            </button>
          </div>
        </div>
      </div>
    `;
    imageGallery.appendChild(imageCard);
  });

  // Adicionar eventos aos botões e imagens
  document.querySelectorAll('.view-btn, .gallery-img').forEach(el => {
    el.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      openImageViewer(index);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const imageId = this.getAttribute('data-id');
      if (confirm('Tem certeza que deseja excluir esta imagem?')) {
        deleteFile(imageId).then(success => {
          if (success) {
            loadImageFiles();
            showAlert('Imagem excluída com sucesso', 'success');
          }
        });
      }
    });
  });
}

// Função para abrir o visualizador de imagens
function openImageViewer(index) {
  currentImageIndex = index;
  const image = images[index];
  
  const modal = document.getElementById('image-viewer-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-image-title');
  
  if (modal && modalImage && modalTitle) {
    modalImage.src = `${API_URL}/images/${image._id}/view`;
    modalTitle.textContent = image.name;
    
    // Mostrar o modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}

// Função para navegar entre imagens no visualizador
function navigateImage(direction) {
  let newIndex = currentImageIndex + direction;
  
  // Circular entre as imagens
  if (newIndex < 0) {
    newIndex = images.length - 1;
  } else if (newIndex >= images.length) {
    newIndex = 0;
  }
  
  openImageViewer(newIndex);
}

// Função para formatar bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Função para exibir alertas
function showAlert(message, type) {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;

  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertContainer.appendChild(alert);

  // Remover alerta após 5 segundos
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Carregar arquivos de imagem quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('image-gallery')) {
    loadImageFiles();
  }

  // Configurar botões de navegação do visualizador
  const prevBtn = document.getElementById('prev-image');
  const nextBtn = document.getElementById('next-image');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      navigateImage(-1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      navigateImage(1);
    });
  }

  // Configurar formulário de upload
  const uploadForm = document.getElementById('upload-image-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fileInput = document.getElementById('image-file');
      const nameInput = document.getElementById('image-name');
      
      if (!fileInput.files[0]) {
        showAlert('Por favor, selecione uma imagem', 'warning');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('name', nameInput.value || fileInput.files[0].name);
      
      uploadFile(formData).then(result => {
        if (result) {
          loadImageFiles();
          showAlert('Imagem enviada com sucesso', 'success');
          uploadForm.reset();
        }
      });
    });
  }
});