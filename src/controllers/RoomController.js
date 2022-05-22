const Database = require('../db/config')

module.exports = {
    async create(req, res) {
        const db = await Database()
        const pass = req.body.password //Verificar se senha vazia
        let roomId = ''
        let isRoom = true

        while (isRoom) {
            for (let i = 0; i < 6; i++) {
                roomId += Math.floor(Math.random() * 10) // Mudar tipo de dado do ID da tabela rooms
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
        const questions = await db.all(`SELECT * FROM questions WHERE room=${roomId} AND read=0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room=${roomId} AND read=1`)
        let isNoQuestion
        
        if(questions.length == 0 && questionsRead.length == 0){
            isNoQuestion = true
        }
        
        await db.close()
        res.render('room', {roomId, questions, questionsRead, isNoQuestion})
    },

    enter(req, res){
        const roomId = req.body.roomId
        res.redirect(`/room/${roomId}`)
    }

    // FUNCIONALIDADE QUE PERMITE CRIAR SALAR PUBLICAS E SALAS PRIVADAS.
    // CRIAR FUNCIONALIDADE PARA EXCLUIR UMA SALA.
}