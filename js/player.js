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
