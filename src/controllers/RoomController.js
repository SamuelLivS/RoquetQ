const Database = require('../db/config')

module.exports = {
    async create(req, res) {
        const db = await Database()
        const pass = req.body.password
        let roomId = ''
        let isRoom = true

        while (isRoom) {
            for (let i = 0; i < 6; i++) {
                // Tipo int do BD ignora zeros a esquerda... EX: 005846 => 5846
                if (i == 0) {
                    roomId += Math.ceil(Math.random() * 8)
                } else {
                    roomId += Math.floor(Math.random() * 10)
                }
            }

            const roomsExistIds = await db.all(`SELECT id FROM rooms`)
            isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)
            if (!isRoom) {
                await db.run(`INSERT INTO rooms (
                    id,
                    pass
                ) VALUES (
                ${parseInt(roomId)},
                ${pass}
                )
                `)
            }
        }

        await db.close()

        res.redirect(`/room/${roomId}`)
    },

    async open(req, res) {
        const db = await Database()
        const roomId = req.params.room
        let roomExist = true

        //Verificar se sala existe
        const roomsExistIds = await db.all(`SELECT id FROM rooms`)
        roomExist = roomsExistIds.some(roomExistId => roomExistId.id === Number(roomId))
        console.log(roomExist)

        if (roomExist) {
            const questions = await db.all(`SELECT * FROM questions WHERE room=${roomId} AND read=0`)
            const questionsRead = await db.all(`SELECT * FROM questions WHERE room=${roomId} AND read=1`)
            let isNoQuestion

            if (questions.length == 0 && questionsRead.length == 0) {
                isNoQuestion = true
            }

            await db.close()
            res.render('room', { roomId, questions, questionsRead, isNoQuestion })
        } else {
            await db.close()
            res.redirect('/')
        }
    },

    enter(req, res) {
        const roomId = req.body.roomId
        res.redirect(`/room/${roomId}`)
    }

    // FUNCIONALIDADE QUE PERMITE CRIAR SALAR PUBLICAS E SALAS PRIVADAS.
    // CRIAR FUNCIONALIDADE PARA EXCLUIR UMA SALA.
}