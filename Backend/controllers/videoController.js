const File = require('../models/File');
const fs = require('fs');

// @desc    Obter todos os arquivos de vídeo do usuário
// @route   GET /api/video
// @access  Private
exports.getVideoFiles = async (req, res) => {
  try {
    const videoFiles = await File.find({ 
      user: req.user.id,
      type: 'video'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videoFiles.length,
      data: videoFiles
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Obter arquivo de vídeo por ID
// @route   GET /api/video/:id
// @access  Private
exports.getVideoFile = async (req, res) => {
  try {
    const videoFile = await File.findById(req.params.id);

    if (!videoFile) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo de vídeo não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (videoFile.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para acessar este arquivo'
      });
    }

    // Verificar se é um arquivo de vídeo
    if (videoFile.type !== 'video') {
      return res.status(400).json({
        success: false,
        error: 'O arquivo não é um arquivo de vídeo'
      });
    }

    // Atualizar a data de último acesso
    videoFile.lastAccessed = Date.now();
    await videoFile.save();

    res.status(200).json({
      success: true,
      data: videoFile
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Reproduzir arquivo de vídeo
// @route   GET /api/video/:id/stream
// @access  Private
exports.streamVideo = async (req, res) => {
  try {
    const videoFile = await File.findById(req.params.id);

    if (!videoFile) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo de vídeo não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (videoFile.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para acessar este arquivo'
      });
    }

    // Verificar se é um arquivo de vídeo
    if (videoFile.type !== 'video') {
        return res.status(400).json({
          success: false,
          error: 'O arquivo não é um arquivo de vídeo'
        });
      }
  
      // Atualizar a data de último acesso
      videoFile.lastAccessed = Date.now();
      await videoFile.save();
  
      // Configurar cabeçalhos para streaming
      const stat = fs.statSync(videoFile.path);
      const fileSize = stat.size;
      const range = req.headers.range;
  
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoFile.path, { start, end });
        
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': videoFile.mimeType,
        };
        
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': videoFile.mimeType,
        };
        
        res.writeHead(200, head);
        fs.createReadStream(videoFile.path).pipe(res);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: 'Erro no servidor'
      });
    }
  };
  
