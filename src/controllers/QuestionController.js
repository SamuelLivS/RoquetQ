const Database = require('../db/config')

module.exports = {
    async index(req, res) {
        const db = await Database()
        const roomId = req.params.room
        const questionId = req.params.question
        const action = req.params.action
        const password = req.body.password
        const questionTitle = req.body.editQuestion

        /* A senha tá correta */
            const verifyRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`)
            if (verifyRoom.pass == password) {
                if (action == 'delete') {
                    await db.run(`DELETE FROM questions WHERE id = ${questionId}`)
                } else if (action == 'check') {
                    await db.run(`UPDATE questions SET read = 1 WHERE id = ${questionId}`)
                } else if (action == 'edit') {
                    await db.run(`UPDATE questions SET title = "${questionTitle}" WHERE id = ${questionId}`)
                }
                await db.close()
                res.redirect(`/room/${roomId}`)
            } else {
                await db.close()
                res.render('passincorrect', { roomId })
                // PROCURAR OUTRA ABORDAGEM DE COMO INFORMAR AO USUÁRIOS QUE A SENHA ESTÁ ERRADA.
            }
    },

    async create(req, res) {
        const db = await Database()
        const question = req.body.question
        const roomId = req.params.room

        await db.run(`INSERT INTO questions(
            title,
            room,
            read
        ) VALUES (
            "${question}",
            ${roomId},
            0
        )`)
        await db.close()
        res.redirect(`/room/${roomId}`)
    }
}