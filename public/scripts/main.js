import Modal from './modal.js'

const modal = Modal()

const modalTitle = document.querySelector('.modal h2')
const modalDescription = document.querySelector('.modal p')
const modalButton = document.querySelector('.modal .buttons button')

const checkButtons = document.querySelectorAll('.actions a.check')
const deleteButton = document.querySelectorAll('.actions a.delete')

checkButtons.forEach(button => {
    button.addEventListener('click', handleClick)
})

deleteButton.forEach(button => {
    button.addEventListener('click', event => handleClick(event, false))
})

function handleClick(event, check = true) {
    event.preventDefault()
    const text = check ? "Marcar como lida" : "Excluir"
    const slug = check ? 'check' : 'delete'
    const roomId = document.querySelector('#room-id').dataset.id
    const questionId = event.target.dataset.id

    const form = document.querySelector('.modal form')
    // Montar url com a rota para os dados do formulário
    form.setAttribute('action', `/question/${roomId}/${questionId}/${slug}`)

    modalTitle.innerHTML = `${text} esta pergunta.`
    modalDescription.innerHTML = `Tem certeza que deseja ${text.toLowerCase()} essa pergunta?`
    modalButton.innerHTML = `Sim, ${text}`
    check ? modalButton.classList.remove('red') : modalButton.classList.add('red')

    modal.open()
}

document.querySelector('#room-id').addEventListener('click', event => {
    navigator.clipboard.writeText(event.target.dataset.id)
})

document.querySelector('#question').addEventListener('input', event => {
    let text = event.target.value
    event.target.value = text.trim().length < 1 ? '' : text
})