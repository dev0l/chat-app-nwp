$('#new-message').keyup(async function() {
  let textToPredict = $('#new-message').val()

  let testValues = {
    text: textToPredict
  }

  let res = await fetch('/api/predict', {
    method: 'POST',
    body: JSON.stringify(testValues)
  })

  let prediction = await res.json()

  $('#prediction').html(`
  Text to predict: <em>${prediction['text_to_predict']}</em>
`)
})
