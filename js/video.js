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
