document.addEventListener('DOMContentLoaded', function() {
    // Elementos do player de vídeo
    const videoElement = document.getElementById('videoElement');
    const currentVideoTitle = document.getElementById('currentVideoTitle');
    const currentVideoDescription = document.getElementById('currentVideoDescription');
    
    // Vídeos disponíveis
    const videoCards = document.querySelectorAll('.video-card');
    
    // Inicializar o player
    function initVideoPlayer() {
        // Adicionar eventos aos cards de vídeo
        videoCards.forEach(card => {
            card.addEventListener('click', function() {
                const videoSrc = this.getAttribute('data-video');
                const videoTitle = this.getAttribute('data-title');
                const videoDescription = this.getAttribute('data-description');
                
                // Carregar o vídeo no player
                videoElement.src = videoSrc;
                currentVideoTitle.textContent = videoTitle;
                currentVideoDescription.textContent = videoDescription;
                
                // Reproduzir o vídeo
                videoElement.load();
                videoElement.play();
                
                // Rolar para o player
                document.getElementById('videoPlayer').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Adicionar eventos aos botões de reprodução
        const playButtons = document.querySelectorAll('.play-video');
        playButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.video-card');
                if (card) {
                    card.click();
                }
            });
        });
    }
    
    // Inicializar o player
    initVideoPlayer();
});






// URL base da API
const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let currentVideo = null;
let videoPlayer = null;

// Função para carregar arquivos de vídeo
async function loadVideoFiles() {
  try {
    const response = await fetch(`${API_URL}/video`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      displayVideoFiles(data.data);
    } else {
      throw new Error(data.error || 'Falha ao carregar arquivos de vídeo');
    }
  } catch (error) {
    console.error('Erro ao carregar vídeos:', error);
    showAlert('Erro ao carregar arquivos de vídeo', 'danger');
  }
}

// Função para exibir arquivos de vídeo na interface
function displayVideoFiles(videoFiles) {
  const videoListContainer = document.getElementById('video-list');
  if (!videoListContainer) return;

  videoListContainer.innerHTML = '';

  if (videoFiles.length === 0) {
    videoListContainer.innerHTML = '<div class="alert alert-info">Nenhum arquivo de vídeo encontrado.</div>';
    return;
  }

  videoFiles.forEach(video => {
    const videoCard = document.createElement('div');
    videoCard.className = 'col-md-4 mb-4';
    videoCard.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${video.name}</h5>
          <p class="card-text">
            <small class="text-muted">Tamanho: ${formatBytes(video.size)}</small><br>
            <small class="text-muted">Adicionado em: ${new Date(video.createdAt).toLocaleDateString()}</small>
          </p>
          <button class="btn btn-primary btn-sm play-btn" data-id="${video._id}">
            <i class="fas fa-play"></i> Reproduzir
          </button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${video._id}">
            <i class="fas fa-trash"></i> Excluir
          </button>
        </div>
      </div>
    `;
    videoListContainer.appendChild(videoCard);
  });

  // Adicionar eventos aos botões
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const videoId = this.getAttribute('data-id');
      playVideo(videoId);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const videoId = this.getAttribute('data-id');
      if (confirm('Tem certeza que deseja excluir este arquivo?')) {
        deleteFile(videoId).then(success => {
          if (success) {
            loadVideoFiles();
            showAlert('Arquivo excluído com sucesso', 'success');
          }
        });
      }
    });
  });
}

// Função para reproduzir vídeo
async function playVideo(videoId) {
  try {
    const response = await fetch(`${API_URL}/video/${videoId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      currentVideo = data.data;
      
      // Atualizar informações do player
      const playerContainer = document.getElementById('video-player-container');
      const videoTitle = document.getElementById('video-title');
      
      if (playerContainer && videoTitle) {
        playerContainer.classList.remove('d-none');
        videoTitle.textContent = currentVideo.name;
        
        // Configurar o player
        if (!videoPlayer) {
          videoPlayer = document.getElementById('video-player');
        }
        
        videoPlayer.src = `${API_URL}/video/${videoId}/stream`;
        videoPlayer.load();
        videoPlayer.play();
      }
    } else {
      throw new Error(data.error || 'Falha ao reproduzir vídeo');
    }
  } catch (error) {
    console.error('Erro ao reproduzir vídeo:', error);
    showAlert('Erro ao reproduzir vídeo', 'danger');
  }
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

// Carregar arquivos de vídeo quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('video-list')) {
    loadVideoFiles();
  }

  // Configurar eventos do player de vídeo
  const videoPlayer = document.getElementById('video-player');
  if (videoPlayer) {
    videoPlayer.addEventListener('ended', function() {
      // Ações quando o vídeo terminar
      console.log('Vídeo finalizado');
    });
  }

  // Configurar formulário de upload
  const uploadForm = document.getElementById('upload-video-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fileInput = document.getElementById('video-file');
      const nameInput = document.getElementById('video-name');
      
      if (!fileInput.files[0]) {
        showAlert('Por favor, selecione um arquivo', 'warning');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('name', nameInput.value || fileInput.files[0].name);
      
      uploadFile(formData).then(result => {
        if (result) {
          loadVideoFiles();
          showAlert('Arquivo enviado com sucesso', 'success');
          uploadForm.reset();
        }
      });
    });
  }
});

