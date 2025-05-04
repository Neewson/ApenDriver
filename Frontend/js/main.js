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
// URL base da API
const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

// Função para verificar se o usuário está autenticado
function isAuthenticated() {
  return token !== null;
}

// Função para fazer login
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      token = data.token;
      localStorage.setItem('token', token);
      return true;
    } else {
      throw new Error(data.error || 'Falha no login');
    }
  } catch (error) {
    console.error('Erro de login:', error);
    return false;
  }
}

// Função para fazer logout
function logout() {
  localStorage.removeItem('token');
  token = null;
  window.location.href = 'index.html';
}

// Função para registrar um novo usuário
async function register(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (data.success) {
      token = data.token;
      localStorage.setItem('token', token);
      return true;
    } else {
      throw new Error(data.error || 'Falha no registro');
    }
  } catch (error) {
    console.error('Erro de registro:', error);
    return false;
  }
}

// Função para obter informações do usuário
async function getUserInfo() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Falha ao obter informações do usuário');
    }
} catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    return null;
  }
}

// Função para obter estatísticas de armazenamento
async function getStorageStats() {
  try {
    const response = await fetch(`${API_URL}/files/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Falha ao obter estatísticas de armazenamento');
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }
}

// Função para fazer upload de arquivo
async function uploadFile(formData) {
  try {
    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Falha ao fazer upload do arquivo');
    }
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return null;
  }
}

// Função para obter todos os arquivos
async function getAllFiles() {
  try {
    const response = await fetch(`${API_URL}/files`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Falha ao obter arquivos');
    }
  } catch (error) {
    console.error('Erro ao obter arquivos:', error);
    return [];
  }
}

// Função para excluir um arquivo
async function deleteFile(fileId) {
  try {
    const response = await fetch(`${API_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      throw new Error(data.error || 'Falha ao excluir arquivo');
    }
  } catch (error) {
    console.error('Erro ao excluir arquivo:', error);
    return false;
  }
}

// Verificar autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  // Páginas que não requerem autenticação
  const publicPages = ['index.html', 'register.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  if (!isAuthenticated() && !publicPages.includes(currentPage)) {
    // Redirecionar para a página de login se não estiver autenticado
    window.location.href = 'index.html';
  } else if (isAuthenticated() && publicPages.includes(currentPage)) {
    // Redirecionar para o dashboard se já estiver autenticado
    window.location.href = 'dashboard.html';
  }
  
  // Configurar evento de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
});

