const messages = document.querySelector('#messages')
const form = document.querySelector('form')
const username = document.querySelector('#username')
const newMessage = document.querySelector('.new-message')
const switchBtn = document.querySelector('#switch-btn')
const other = document.querySelector('#other')
const gpt = document.querySelector('#gpt')
let ws;

_init()
async function _init() {
  username.value = localStorage['username'] || ''
  newMessage.focus()

  let messages = await fetch('/rest/messages')
  messages = await messages.json()

  for (let msg of messages) {
    appendMessage(msg)
  }
}

connect()
async function connect() {
  console.log('connecting');
  const protocol = location.protocol == 'https:' ? 'wss' : 'ws'
  ws = new WebSocket(`${protocol}://${location.host}/ws`)

  ws.onmessage = message => {
    let data = JSON.parse(message.data)
    appendMessage(data)
  }

  ws.onopen = () => console.log('connected');

  // try to reconnect every second
  ws.onclose = () => {
    console.log('disconnected');

    setTimeout(() => {
      connect()
    }, 1000);
  }
}

function send(message) {
  if (ws) {
    ws.send(message)
  }
}

function appendMessage(message) {
  let messageDiv = document.createElement('div')
  messageDiv.innerHTML = `
    <p>${new Date(message.time).toLocaleString()}</p>
    <p><strong>${message.sender}: </strong>${message.text}</p>
  `
  messages.append(messageDiv)
}

form.addEventListener('submit', e => {
  e.preventDefault() // prevent page reload

  let message = {
    sender: username.value,
    text: newMessage.value,
    time: Date.now()
  }

  // console.log(message)

  send(JSON.stringify(message))

  newMessage.value = ''

  $('#prediction').html(`
  `)
})

username.addEventListener('keyup', () => (localStorage['username'] = username.value))

// Toggle Model

let showOther = false;

switchBtn.addEventListener('click', toggleModel);

function toggleModel() {
  if (!showOther) {
    other.classList.add('show')
    other.classList.add('new-message')
    gpt.classList.add('hide')
    gpt.classList.remove('new-message')

    $("#gpt, #other").val("");
    $('#prediction').html(`
    `)

    // Set Model State
    showOther = true;
    
  } else {
    other.classList.remove('new-message')
    other.classList.remove('show')
    gpt.classList.remove('hide')
    gpt.classList.add('new-message')

    $("#gpt, #other").val("");
    $('#prediction').html(`
    `)

    // Set Model State
    showOther = false;

  }
}

// First Model (GPT-2)

$(gpt).keyup(async function () {
  let textToPredict = $(gpt).val()

  let predictions = {
    pText: textToPredict
  }

  let res = await fetch('/api/predictGpt', {
    method: 'POST',
    body: JSON.stringify(predictions)
  })

  let prediction = await res.json()

  $('#prediction').html(`
  <em>${prediction['suggestions']}</em>
  `)
});

// Second Model (Other)

$(other).keyup(async function () {
  let textToPredict = $(other).val()

  let predictions = {
    pText: textToPredict
  }

  let res = await fetch('/api/predictOther', {
    method: 'POST',
    body: JSON.stringify(predictions)
  })

  let prediction = await res.json()

  $('#prediction').html(`
  <em>${prediction['suggestions']}</em>
  `)
});
