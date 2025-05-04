// URL base da API
const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

// Função para carregar dados do dashboard
async function loadDashboardData() {
  try {
    // Obter informações do usuário
    const userInfo = await getUserInfo();
    if (userInfo) {
      document.getElementById('user-name').textContent = userInfo.name;
      document.getElementById('user-email').textContent = userInfo.email;
    }

    // Obter estatísticas de armazenamento
    const stats = await getStorageStats();
    if (stats) {
      updateStorageStats(stats);
      createStorageChart(stats);
      updateRecentActivity();
    }
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    showAlert('Erro ao carregar dados do dashboard', 'danger');
  }
}

// Função para atualizar estatísticas de armazenamento
function updateStorageStats(stats) {
  const usedStorage = document.getElementById('used-storage');
  const totalStorage = document.getElementById('total-storage');
  const availableStorage = document.getElementById('available-storage');
  const storageProgress = document.getElementById('storage-progress');
  
  if (usedStorage && totalStorage && availableStorage && storageProgress) {
    usedStorage.textContent = formatBytes(stats.usedStorage);
    totalStorage.textContent = formatBytes(stats.totalStorage);
    availableStorage.textContent = formatBytes(stats.availableStorage);
    
    const percentage = (stats.usedStorage / stats.totalStorage) * 100;
    storageProgress.style.width = `${percentage}%`;
    storageProgress.setAttribute('aria-valuenow', percentage);
    
    // Mudar cor da barra de progresso com base no uso
    if (percentage > 90) {
      storageProgress.className = 'progress-bar bg-danger';
    } else if (percentage > 70) {
      storageProgress.className = 'progress-bar bg-warning';
    } else {
      storageProgress.className = 'progress-bar bg-success';
    }
  }
  
  // Atualizar contadores de arquivos
  document.getElementById('audio-count').textContent = stats.files.audio.count;
  document.getElementById('video-count').textContent = stats.files.video.count;
  document.getElementById('image-count').textContent = stats.files.image.count;
}

// Função para criar gráfico de armazenamento
function createStorageChart(stats) {
  const ctx = document.getElementById('storage-chart');
  
  if (ctx) {
    // Destruir gráfico existente se houver
    if (window.storageChart) {
      window.storageChart.destroy();
    }
    
    window.storageChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Áudio', 'Vídeo', 'Imagens', 'Disponível'],
        datasets: [{
          data: [
            stats.files.audio.size,
            stats.files.video.size,
            stats.files.image.size,
            stats.availableStorage
          ],
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc',
            '#f8f9fc'
          ],
          borderColor: [
            '#ffffff',
            '#ffffff',
            '#ffffff',
            '#ffffff'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              const value = data.datasets[0].data[tooltipItem.index];
              return `${data.labels[tooltipItem.index]}: ${formatBytes(value)}`;
            }
          }
        },
        legend: {
          position: 'bottom'
        },
        cutoutPercentage: 70
      }
    });
  }
}

// Função para atualizar atividade recente
async function updateRecentActivity() {
  try {
    // Obter todos os arquivos e ordenar por data de último acesso
    const files = await getAllFiles();
    const recentFiles = files
      .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
      .slice(0, 5);
    
    const activityList = document.getElementById('recent-activity');
    if (activityList) {
      activityList.innerHTML = '';
      
      if (recentFiles.length === 0) {
        activityList.innerHTML = '<li class="list-group-item">Nenhuma atividade recente</li>';
        return;
      }
      
      recentFiles.forEach(file => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Ícone baseado no tipo de arquivo
        let icon = '';
        if (file.type === 'audio') {
          icon = '<i class="fas fa-music text-primary"></i>';
        } else if (file.type === 'video') {
          icon = '<i class="fas fa-video text-success"></i>';
        } else if (file.type === 'image') {
          icon = '<i class="fas fa-image text-info"></i>';
        } else {
          icon = '<i class="fas fa-file text-secondary"></i>';
        }
        
        item.innerHTML = `
          <div>
            ${icon} <span class="ms-2">${file.name}</span>
          </div>
          <div>
            <small class="text-muted">Acessado em: ${new Date(file.lastAccessed).toLocaleString()}</small>
          </div>
        `;
        
        activityList.appendChild(item);
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar atividade recente:', error);
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

// Carregar dados do dashboard quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('dashboard-container')) {
    loadDashboardData();
    
    // Atualizar dados a cada 5 minutos
    setInterval(loadDashboardData, 5 * 60 * 1000);
  }
  
  // Configurar formulário de upload rápido
  const quickUploadForm = document.getElementById('quick-upload-form');
  if (quickUploadForm) {
    quickUploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fileInput = document.getElementById('quick-file');
      
      if (!fileInput.files[0]) {
        showAlert('Por favor, selecione um arquivo', 'warning');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('name', fileInput.files[0].name);
      
      uploadFile(formData).then(result => {
        if (result) {
          loadDashboardData();
          showAlert('Arquivo enviado com sucesso', 'success');
          quickUploadForm.reset();
        }
      });
    });
  }
});

