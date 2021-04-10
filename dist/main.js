const messages = document.querySelector('#messages')
const form = document.querySelector('form')
const username = document.querySelector('#username')
const newMessage = document.querySelector('.new-message')
const switchBtn = document.querySelector('#switch-btn')
const gpt = document.querySelector('#gpt')
let skip = document.querySelector('#skipy')
const predictionsEl = document.querySelector('#predictions')
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

// First Model (GPT-2)

$(gpt).keyup(async function () {
  let textToPredict = $(gpt).val()

  let predictions = {
    text: textToPredict
  }

  let res = await fetch('/api/predictGpt', {
    method: 'POST',
    body: JSON.stringify(predictions)
  })

  let prediction = await res.json()

  // for (const prop in prediction) {
  //   console.log(`prediction.${prop} = ${prediction[prop]}`);
  // }

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
      $(gpt).val($(gpt).val() + " " + clickedWordVal);
    });
  }

});

// Second Model (Other)

$(skip).keyup(async function () {
  let textToPredict = $(skip).val()

  let predictions = {
    text: textToPredict
  }

  let res = await fetch('/api/predictSkipy', {
    method: 'POST',
    body: JSON.stringify(predictions)
  })

  let prediction = await res.json()

  // for (const prop in prediction) {
  //   console.log(`prediction.${prop} = ${prediction[prop]}`);
  // }

  let wordArray = prediction.suggestions

  let myHtml = "";

  console.log(wordArray)

  $.each(wordArray, function (i, item) {
    console.log(item)
    myHtml += `<li class="clicked-word">${item}</li>`;
  });

  $("#predictions").html(myHtml);

  const clickedWords = document.getElementsByClassName('clicked-word');
  for (let clickedWord of clickedWords) {
    clickedWord.addEventListener('click', () => {
      let clickedWordVal = clickedWord.textContent
      $(skip).val($(skip).val() + clickedWordVal);
    });
  }

});