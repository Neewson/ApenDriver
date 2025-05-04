const File = require('../models/File');
const User = require('../models/User');
const fs = require('fs-extra');
const path = require('path');

// @desc    Upload de arquivo
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, envie um arquivo'
      });
    }

    // Determinar o tipo de arquivo
    let fileType;
    if (req.file.mimetype.startsWith('audio/')) {
      fileType = 'audio';
    } else if (req.file.mimetype.startsWith('video/')) {
      fileType = 'video';
    } else if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    }

    // Verificar se o usuário tem espaço suficiente
    const user = await User.findById(req.user.id);
    if (user.storageUsed + req.file.size > user.storageLimit) {
      // Remover o arquivo se não houver espaço suficiente
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Limite de armazenamento excedido'
      });
    }

    // Criar arquivo no banco de dados
    const file = await File.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      type: fileType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      user: req.user.id
    });

    // Atualizar o espaço de armazenamento usado pelo usuário
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { storageUsed: req.file.size }
    });

    res.status(201).json({
      success: true,
      data: file
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Obter todos os arquivos do usuário
// @route   GET /api/files
// @access  Private
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Obter arquivo por ID
// @route   GET /api/files/:id
// @access  Private
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (file.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para acessar este arquivo'
      });
    }

    // Atualizar a data de último acesso
    file.lastAccessed = Date.now();
    await file.save();

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Download de arquivo
// @route   GET /api/files/:id/download
// @access  Private
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (file.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para acessar este arquivo'
      });
    }

    // Atualizar a data de último acesso
    file.lastAccessed = Date.now();
    await file.save();

    // Enviar o arquivo para download
    res.download(file.path, file.originalName);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Excluir arquivo
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }

    // Verificar se o arquivo pertence ao usuário
    if (file.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado para excluir este arquivo'
      });
    }

    // Remover o arquivo do sistema de arquivos
    fs.unlinkSync(file.path);

    // Atualizar o espaço de armazenamento usado pelo usuário
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { storageUsed: -file.size }
    });

    // Remover o arquivo do banco de dados
    await file.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

// @desc    Obter estatísticas de armazenamento
// @route   GET /api/files/stats
// @access  Private
exports.getStorageStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Obter contagem de arquivos por tipo
    const audioCount = await File.countDocuments({ 
      user: req.user.id, 
      type: 'audio' 
    });
    
    const videoCount = await File.countDocuments({ 
      user: req.user.id, 
      type: 'video' 
    });
    
    const imageCount = await File.countDocuments({ 
      user: req.user.id, 
      type: 'image' 
    });

    // Obter tamanho total por tipo
    const audioSize = await File.aggregate([
      { $match: { user: req.user._id, type: 'audio' } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);

    const videoSize = await File.aggregate([
      { $match: { user: req.user._id, type: 'video' } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);

    const imageSize = await File.aggregate([
      { $match: { user: req.user._id, type: 'image' } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStorage: user.storageLimit,
        usedStorage: user.storageUsed,
        availableStorage: user.storageLimit - user.storageUsed,
        files: {
          audio: {
            count: audioCount,
            size: audioSize.length > 0 ? audioSize[0].total : 0
          },
          video: {
            count: videoCount,
            size: videoSize.length > 0 ? videoSize[0].total : 0
          },
          image: {
            count: imageCount,
            size: imageSize.length > 0 ? imageSize[0].total : 0
          }
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor'
    });
  }
};

