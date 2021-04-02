const switchBtn = document.querySelector('#switch-btn')
const other = document.querySelector('#other')
const gpt = document.querySelector('#gpt')

let showOther = false;

switchBtn.addEventListener('click', toggleModel);

function toggleModel() {
  if (!showOther) {
    switchBtn.classList.add('close')
    other.classList.add('show')
    gpt.classList.add('hide')

    // Set Model State
    showOther = true;

  } else {
    switchBtn.classList.remove('close')
    other.classList.remove('show')
    gpt.classList.remove('hide')

    // Set Model State
    showOther = false;

  }
}

// GPT2 Model

$('#gpt').keyup(async function () {
  let textToPredict = $('#gpt').val()

  let testValues = {
    text: textToPredict
  }

  let res = await fetch('/api/predictGpt', {
    method: 'POST',
    body: JSON.stringify(testValues)
  })

  let prediction = await res.json()

  $('#prediction').html(`
  <em>${prediction['suggestions']}</em>
  `)

  // console.log(prediction['suggestions'])
})

// Other Model

$('#other').keyup(async function () {
  let textToPredict = $('#other').val()

  let testValues = {
    text: textToPredict
  }

  let res = await fetch('/api/predictOther', {
    method: 'POST',
    body: JSON.stringify(testValues)
  })

  let prediction = await res.json()

  $('#prediction').html(`
  <em>${prediction['suggestions']}</em>
  `)

  // console.log(prediction['suggestions'])
})

// AUTOCOMPLETE TESTING

$( function() {
  var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
  ];
  $( "#tags" ).autocomplete({
    source: availableTags
  });
} );
