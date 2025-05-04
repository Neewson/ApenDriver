document.addEventListener('DOMContentLoaded', function() {
    // Elementos do player de áudio
    const audioElement = document.getElementById('audioElement');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const volumeControl = document.getElementById('volumeControl');
    const progressBar = document.getElementById('progressBar');
    const currentTimeDisplay = document.getElementById('currentTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const currentTrackCover = document.getElementById('currentTrackCover');
    
    // Lista de áudios
    const audioItems = document.querySelectorAll('.audio-item');
    
    // Estado do player
    let isPlaying = false;
    let currentTrackIndex = 0;
    let isShuffleOn = false;
    let isRepeatOn = false;
    
    // Inicializar o player
    function initPlayer() {
        // Adicionar eventos aos botões do player
        playPauseBtn.addEventListener('click', togglePlayPause);
        prevBtn.addEventListener('click', playPreviousTrack);
        nextBtn.addEventListener('click', playNextTrack);
        shuffleBtn.addEventListener('click', toggleShuffle);
        repeatBtn.addEventListener('click', toggleRepeat);
        volumeControl.addEventListener('input', updateVolume);
        progressBar.addEventListener('input', seekTo);
        
        // Adicionar eventos ao elemento de áudio
        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('ended', handleTrackEnd);
        audioElement.addEventListener('loadedmetadata', updateTotalTime);
        
        // Adicionar eventos aos itens da lista de áudio
        audioItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                playTrack();
            });
        });
        
        // Carregar a primeira faixa
        if (audioItems.length > 0) {
            loadTrack(0);
        }
    }
    
    // Carregar uma faixa
    function loadTrack(index) {
        if (index < 0 || index >= audioItems.length) return;
        
        const track = audioItems[index];
        const audioSrc = track.getAttribute('data-audio');
        const title = track.getAttribute('data-title');
        const artist = track.getAttribute('data-artist');
        const cover = track.getAttribute('data-cover');
        
        audioElement.src = audioSrc;
        currentTrackTitle.textContent = title;
        currentTrackArtist.textContent = artist;
        currentTrackCover.src = cover || 'img/default-cover.jpg';
        
        // Atualizar classe ativa
        audioItems.forEach(item => item.classList.remove('active'));
        track.classList.add('active');
        
        // Resetar o progresso
        progressBar.value = 0;
        currentTimeDisplay.textContent = '0:00';
    }
    
    // Reproduzir a faixa atual
    function playTrack() {
        audioElement.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    // Pausar a faixa atual
    function pauseTrack() {
        audioElement.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // Alternar entre reproduzir e pausar
    function togglePlayPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
    // Reproduzir a faixa anterior
    function playPreviousTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + audioItems.length) % audioItems.length;
        loadTrack(currentTrackIndex);
        playTrack();
    }
    
    // Reproduzir a próxima faixa
    function playNextTrack() {
        if (isShuffleOn) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * audioItems.length);
            } while (randomIndex === currentTrackIndex && audioItems.length > 1);
            currentTrackIndex = randomIndex;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % audioItems.length;
        }
        loadTrack(currentTrackIndex);
        playTrack();
    }
    
    // Lidar com o fim da faixa
    function handleTrackEnd() {
        if (isRepeatOn) {
            audioElement.currentTime = 0;
            playTrack();
        } else {
            playNextTrack();
        }
    }
    
    // Alternar modo aleatório
    function toggleShuffle() {
        isShuffleOn = !isShuffleOn;
        shuffleBtn.classList.toggle('active', isShuffleOn);
    }
    
    // Alternar modo de repetição
    function toggleRepeat() {
        isRepeatOn = !isRepeatOn;
        repeatBtn.classList.toggle('active', isRepeatOn);
    }
    
    // Atualizar o volume
    function updateVolume() {
        audioElement.volume = volumeControl.value / 100;
    }
    
    // Atualizar a barra de progresso
    function updateProgress() {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration || 1;
        
        // Atualizar a barra de progresso
        progressBar.value = (currentTime / duration) * 100;
        
        // Atualizar o tempo atual
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
    
    // Atualizar o tempo total
    function updateTotalTime() {
        totalTimeDisplay.textContent = formatTime(audioElement.duration);
    }
    
    // Buscar uma posição específica na faixa
    function seekTo() {
        const seekTime = (progressBar.value / 100) * audioElement.duration;
        audioElement.currentTime = seekTime;
    }
    
    // Formatar o tempo em minutos:segundos
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // Inicializar o player
    initPlayer();
});
// URL base da API
const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let currentAudio = null;
let audioPlayer = null;

// Função para carregar arquivos de áudio
async function loadAudioFiles() {
  try {
    const response = await fetch(`${API_URL}/audio`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      displayAudioFiles(data.data);
    } else {
      throw new Error(data.error || 'Falha ao carregar arquivos de áudio');
    }
  } catch (error) {
    console.error('Erro ao carregar áudios:', error);
    showAlert('Erro ao carregar arquivos de áudio', 'danger');
  }
}

// Função para exibir arquivos de áudio na interface
function displayAudioFiles(audioFiles) {
  const audioListContainer = document.getElementById('audio-list');
  if (!audioListContainer) return;

  audioListContainer.innerHTML = '';

  if (audioFiles.length === 0) {
    audioListContainer.innerHTML = '<div class="alert alert-info">Nenhum arquivo de áudio encontrado.</div>';
    return;
  }

  audioFiles.forEach(audio => {
    const audioCard = document.createElement('div');
    audioCard.className = 'col-md-4 mb-4';
    audioCard.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${audio.name}</h5>
          <p class="card-text">
            <small class="text-muted">Tamanho: ${formatBytes(audio.size)}</small><br>
            <small class="text-muted">Adicionado em: ${new Date(audio.createdAt).toLocaleDateString()}</small>
          </p>
          <button class="btn btn-primary btn-sm play-btn" data-id="${audio._id}">
            <i class="fas fa-play"></i> Reproduzir
          </button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${audio._id}">
            <i class="fas fa-trash"></i> Excluir
          </button>
        </div>
      </div>
    `;
    audioListContainer.appendChild(audioCard);
  });

  // Adicionar eventos aos botões
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const audioId = this.getAttribute('data-id');
      playAudio(audioId);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const audioId = this.getAttribute('data-id');
      if (confirm('Tem certeza que deseja excluir este arquivo?')) {
        deleteFile(audioId).then(success => {
          if (success) {
            loadAudioFiles();
            showAlert('Arquivo excluído com sucesso', 'success');
          }
        });
      }
    });
  });
}

// Função para reproduzir áudio
async function playAudio(audioId) {
  try {
    const response = await fetch(`${API_URL}/audio/${audioId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      currentAudio = data.data;
      
      // Atualizar informações do player
      const playerContainer = document.getElementById('audio-player-container');
      const audioTitle = document.getElementById('audio-title');
      
      if (playerContainer && audioTitle) {
        playerContainer.classList.remove('d-none');
        audioTitle.textContent = currentAudio.name;
        
        // Configurar o player
        if (!audioPlayer) {
          audioPlayer = document.getElementById('audio-player');
        }
        
        audioPlayer.src = `${API_URL}/audio/${audioId}/stream`;
        audioPlayer.load();
        audioPlayer.play();
      }
    } else {
      throw new Error(data.error || 'Falha ao reproduzir áudio');
    }
  } catch (error) {
    console.error('Erro ao reproduzir áudio:', error);
    showAlert('Erro ao reproduzir áudio', 'danger');
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

// Carregar arquivos de áudio quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('audio-list')) {
    loadAudioFiles();
  }

  // Configurar eventos do player de áudio
  const audioPlayer = document.getElementById('audio-player');
  if (audioPlayer) {
    audioPlayer.addEventListener('ended', function() {
      // Ações quando o áudio terminar
      console.log('Áudio finalizado');
    });
  }

  // Configurar formulário de upload
  const uploadForm = document.getElementById('upload-audio-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fileInput = document.getElementById('audio-file');
      const nameInput = document.getElementById('audio-name');
      
      if (!fileInput.files[0]) {
        showAlert('Por favor, selecione um arquivo', 'warning');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('name', nameInput.value || fileInput.files[0].name);
      
      uploadFile(formData).then(result => {
        if (result) {
          loadAudioFiles();
          showAlert('Arquivo enviado com sucesso', 'success');
          uploadForm.reset();
        }
      });
    });
  }
});
