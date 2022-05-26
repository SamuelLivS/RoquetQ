import Modal from './modal.js'

const modal = Modal()

const modalTitle = document.querySelector('.modal h2')
const modalDescription = document.querySelector('.modal p')
const modalButton = document.querySelector('.modal .buttons button')

const checkButtons = document.querySelectorAll('.actions a.check')
const deleteButton = document.querySelectorAll('.actions a.delete')
const editButtons = document.querySelectorAll('.actions a.edit')

checkButtons.forEach(button => {
    button.addEventListener('click', handleClick)
})

editButtons.forEach(button => {
    button.addEventListener('click', event => handleClick(event, 2))
})

deleteButton.forEach(button => {
    button.addEventListener('click', event => handleClick(event, 3))
})



// 1 == marcar como lido | 2 == editar pergunta | 3 == excluir pergunta
function handleClick(event, check = 1) { //Here
    event.preventDefault()
    const text = check == 1 ? 'Marcar como lida' : check == 2 ? 'Editar' : 'Excluir'
    const slug = check == 1 ? 'check' : check == 2 ? 'edit' : 'delete'
    const roomId = document.querySelector('#room-id').dataset.id
    const questionId = event.target.dataset.id

    const divEditInput = document.querySelector('#editInput')
    const editInput = document.querySelector('#editInput > input')
    const question = document.getElementById(`${questionId}Edit`)

    const form = document.querySelector('.modal form')
    // As vezes questionId recebe um valor undefined, não consegui descobrir o motivo
    if (!!questionId) {
        // Montar url com a rota para os dados do formulário
        form.setAttribute('action', `/question/${roomId}/${questionId}/${slug}`)

        modalTitle.innerHTML = `${text} esta pergunta.`
        modalDescription.innerHTML = `Tem certeza que deseja ${text.toLowerCase()} essa pergunta?`
        modalButton.innerHTML = `Sim, ${text}`
        check == 3 ? modalButton.classList.add('red') : modalButton.classList.remove('red')
        check == 2 ? divEditInput.style.display = 'block' : divEditInput.style.display = 'none'

        if (check == 2) {
            editInput.value = question.textContent.trim()
        }

        modal.open()
    }
}

document.querySelector('#room-id').addEventListener('click', event => {
    navigator.clipboard.writeText(event.target.dataset.id)
})

document.querySelector('#question').addEventListener('input', event => {
    let text = event.target.value
    event.target.value = text.trim().length < 1 ? '' : text
})