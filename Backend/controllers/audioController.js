const File = require('../models/File');

// @desc    Obter todos os arquivos de áudio do usuário
// @route   GET /api/audio
// @access  Private
exports.getAudioFiles = async (req, res) => {
  try {
    const audioFiles = await File.find({ 
      user: req.user.id,
      type: 'audio'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: audioFiles.length,
      data: audioFiles
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Obter arquivo de áudio por ID
// @route   GET /api/audio/:id
// @access  Private
exports.getAudioFile = async (req, res) => {
  try {
    const audioFile = await File.findById(req.params.id);

    if (!audioFile) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo de áudio não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (audioFile.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para acessar este arquivo'
      });
    }

    // Verificar se é um arquivo de áudio
    if (audioFile.type !== 'audio') {
      return res.status(400).json({
        success: false,
        error: 'O arquivo não é um arquivo de áudio'
      });
    }

    // Atualizar a data de último acesso
    audioFile.lastAccessed = Date.now();
    await audioFile.save();

    res.status(200).json({
      success: true,
      data: audioFile
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Reproduzir arquivo de áudio
// @route   GET /api/audio/:id/stream
// @access  Private
exports.streamAudio = async (req, res) => {
  try {
    const audioFile = await File.findById(req.params.id);

    if (!audioFile) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo de áudio não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (audioFile.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para acessar este arquivo'
      });
    }

    // Verificar se é um arquivo de áudio
    if (audioFile.type !== 'audio') {
      return res.status(400).json({
        success: false,
        error: 'O arquivo não é um arquivo de áudio'
      });
    }

    // Atualizar a data de último acesso
    audioFile.lastAccessed = Date.now();
    await audioFile.save();

    // Configurar cabeçalhos para streaming
    const stat = fs.statSync(audioFile.path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(audioFile.path, { start, end });
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': audioFile.mimeType,
      };
      
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': audioFile.mimeType,
      };
      
      res.writeHead(200, head);
      fs.createReadStream(audioFile.path).pipe(res);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};
