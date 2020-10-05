const estudios = require('express').Router();

const controllerEstudio = require('../controller/controllerestudio')();

estudios.get('/', controllerEstudio.listarEstudios);
estudios.post('/', controllerEstudio.salvarEstudio)
estudios.put('/', controllerEstudio.alterarEstudio)
estudios.delete('/', controllerEstudio.excluirEstudio)

estudios.get('/buscarcidade/:cidade', controllerEstudio.buscarEstudios)
estudios.get('/buscarnome/:nome', controllerEstudio.buscarEstudiosporNome)
estudios.get('/classificacaototal/:nome', controllerEstudio.classificaoTotal)
estudios.get('/classificacaoboa/:nome', controllerEstudio.classificacaoBoa)
estudios.get('/classificacaoruim/:nome', controllerEstudio.classificacaoRuim)
estudios.get('/calculartempo', controllerEstudio.calcularTempo)
estudios.post('/upload', controllerEstudio.upload)

estudios.get('/download/:nomeArquivo', controllerEstudio.download)

module.exports = estudios;