const File = require('../models/File');
const fs = require('fs');

// @desc    Obter todos os arquivos de imagem do usuário
// @route   GET /api/images
// @access  Private
exports.getImageFiles = async (req, res) => {
  try {
    const imageFiles = await File.find({ 
      user: req.user.id,
      type: 'image'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: imageFiles.length,
      data: imageFiles
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Obter arquivo de imagem por ID
// @route   GET /api/images/:id
// @access  Private
exports.getImageFile = async (req, res) => {
  try {
    const imageFile = await File.findById(req.params.id);

    if (!imageFile) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo de imagem não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (imageFile.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para acessar este arquivo'
      });
    }

    // Verificar se é um arquivo de imagem
    if (imageFile.type !== 'image') {
      return res.status(400).json({
        success: false,
        error: 'O arquivo não é um arquivo de imagem'
      });
    }

    // Atualizar a data de último acesso
    imageFile.lastAccessed = Date.now();
    await imageFile.save();

    res.status(200).json({
      success: true,
      data: imageFile
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Visualizar arquivo de imagem
// @route   GET /api/images/:id/view
// @access  Private
exports.viewImage = async (req, res) => {
  try {
    const imageFile = await File.findById(req.params.id);

    if (!imageFile) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo de imagem não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (imageFile.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para acessar este arquivo'
      });
    }

    // Verificar se é um arquivo de imagem
    if (imageFile.type !== 'image') {
      return res.status(400).json({
        success: false,
        error: 'O arquivo não é um arquivo de imagem'
      });
    }

    // Atualizar a data de último acesso
    imageFile.lastAccessed = Date.now();
    await imageFile.save();

    // Enviar a imagem
    res.set('Content-Type', imageFile.mimeType);
    fs.createReadStream(imageFile.path).pipe(res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};
