const messages = document.querySelector('#messages')
const form = document.querySelector('form')
const username = document.querySelector('#username')
const newMessage = document.querySelector('#new-message')
const toggleBtn = document.querySelector('#switch-btn')
const modelName = document.querySelector('#model-name')
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
  // Changed to prepend instead of append to get messages in descending order
  // i.e. the latest message in the top
  messages.prepend(messageDiv)
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

  $('#predictions').html(`
  `)
})

username.addEventListener('keyup', () => (localStorage['username'] = username.value))

$(newMessage).keyup(async function () {
  let textToPredict = $(newMessage).val()

  if ($(newMessage).val() == "") {
    return;
  }

  let predictions = {
    text: textToPredict
  }

  let res;

  if ($(this).hasClass('gpt')) {

    res = await fetch('/api/predictGpt', {
      method: 'POST',
      body: JSON.stringify(predictions)
    })
  } else {

    res = await fetch('/api/predictSkipy', {
      method: 'POST',
      body: JSON.stringify(predictions)
    })
  }

  let prediction = await res.json()

  let wordArray = prediction.suggestions

  let myHtml = "";

  $.each(wordArray, function (i, item) {
    myHtml += `<li class="clicked-word">${item}</li>`;
  });

  $("#predictions").html(myHtml);

  const clickedWords = document.getElementsByClassName('clicked-word');
  for (let clickedWord of clickedWords) {
    clickedWord.addEventListener('click', () => {
      let clickedWordVal = clickedWord.textContent
      $(newMessage).val($(newMessage).val() + clickedWordVal);
      newMessage.focus()
    });
  }

});

let showModel = false;

toggleBtn.addEventListener('click', toggleModel);

function toggleModel() {
  if (!showModel) {
    $(modelName).html('Model: Skipy')

    newMessage.classList.remove('gpt')

    // newMessage.value = ''

    $('#predictions').html('')

    // Set Menu State
    showModel = true;
  } else {
    $(modelName).html('Model: GPT-2')

    newMessage.classList.add('gpt')

    // newMessage.value = ''

    $('#predictions').html('')

    // Set Menu State
    showModel = false;
  }
}