var formidable = require('formidable');
const fsextra = require('fs-extra')
const fs = require('fs');

module.exports = () => {
    const controller = {};

    const estudios = [];
    const imagens = [];

    controller.listarEstudios = (req, res) => res.status(200).json(estudios);

    /*  o usuário envia uma foto do estúdio de tatuagem  */
    controller.upload = (req, res, next) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            const { type, name, path, size } = files.arquivo

            console.log("tamanho: " + size)

            if (size > 111110000) {
                const error = new Error();
                error.message = "tamanho do arquivo inválido";
                error.httpStatusCode = 400;
                error.code = 'ERR001';
                return next(error)
            }

            if (type.indexOf("image/png") != -1) {
                console.log("vai mover o arquivo");

                try {
                    await fsextra.move(files.arquivo.path, './src/storage/' + files.arquivo.name)
                    console.log("terminou de mover");

                    res.write('Arquivo Carregado');
                    res.end();
                } catch (err) {
                    const error = new Error();
                    error.message = "arquivo já existe";
                    error.httpStatusCode = 400;
                    error.code = 'ERR004';
                    return next(error)
                }

            } else {
                const error = new Error()
                error.message = "tipo do arquivo inválido"
                error.httpStatusCode = 400;
                error.code = 'ERR002';
                return next(error)
            }
        });
    };

    controller.download = (req, res, next) => {
        const { nomeArquivo } = req.params

        try {
            let readStream = fs.createReadStream('./src/storage/' + nomeArquivo)

            readStream.on('open', function () {
                readStream.pipe(res)
            });
        } catch (err) {
            const error = new Error()
            error.message = "não foi possível realizar o download do arquivo"
            error.httpStatusCode = 400
            error.code = 'ERR003'
            return next(error)
        }
    }


    controller.salvarEstudio = (req, res) => {
        const estudio = req.body

        estudios.push(estudio)

        res.status(200).send()
    };

    controller.alterarEstudio = (req, res) => {
        estudios.map((estudio, index) => {
            if (estudio.guidestudio === req.body.guidestudio) {
                estudios[index] = req.body
            }
        });

        res.status(200).send()
    };

    controller.excluirEstudio = (req, res) => {
        const index = req.params.index

        estudios.splice(index, 1)

        res.status(200).send()
    };

    controller.buscarEstudios = (req, res) => {
        const { cidade } = req.params

        res.status(200).json(estudios.filter((estudio) => {
            return estudio.cidade === cidade;
        }))
    }

    controller.buscarEstudiosporNome = (req, res) => {
        const { nome } = req.params

        res.status(200).json(estudios.filter((estudio) => {
            return estudio.nome === nome;
        }))
    }


    controller.validarUsuario = (req, res, next) => {
        if (true) {
            res.status(400).send()
        }
        return next();
    }

    controller.classificaoTotal = (req, res) => {
        const { nome } = req.params
        
        var classificboa = estudios.reduce(function (classificboa, item) {
            classificboa += parseInt(item.classificboa)
            return classificboa
        }, 0);
        var classificruim = estudios.reduce(function (classificruim, item) {
            classificruim += parseInt(item.classificruim)
            return classificruim
        }, 0);
        res.status(200).json(classificboa + classificruim + ' é o total de classificações (sendo boas e ruins)')
    }



    controller.classificacaoBoa = (req, res) => {
        const { nome } = req.params

        var classificboa = estudios.reduce(function (classificboa, item) {
            classificboa += parseInt(item.classificboa)
            return classificboa
        }, 0);
        res.status(200).json(classificboa + ' é o total de classificações boas')
    }

    controller.classificacaoRuim = (req, res) => {
        const { nome } = req.params

        var classificruim = estudios.reduce(function (classificruim, item) {
            classificruim += parseInt(item.classificruim)
            return classificruim
        }, 0);
        res.status(200).json(classificruim + ' é o total de classificações ruins')
    }

    controller.calcularTempo = (req, res) => {
        estudios.map((estudio) => {
            estudio.quantoAnos = 2020 - estudio.anolancado + ' anos de vida'
        });

        res.status(200).json(estudios)
    };

    return controller;
}