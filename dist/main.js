$('#new-message').keyup(async function () {
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
  <em>${prediction['suggestions']}</em>
  `)
  
  console.log("this is" + prediction['suggestions'])
})
