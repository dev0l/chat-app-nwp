from sanic import Sanic, response as res
from sanic.exceptions import NotFound
from gpt import predict
from other import predicts

app = Sanic(__name__)

# When we navigate to /api/predict we have to pass in two values (age, income) which will then be packaged as 
# json (strings) and later we can access this json in our predict_values function
@app.post('/api/predict')
async def predict_results(req):
  # we need to unpackage the json file so we can get initial values being passet from frontend.
  # we do this with req.json
  values = req.json
  prediction = predict(values['text'])
  print(prediction)

  return res.json(prediction)

@app.post('/api/predictOther')
async def predict_results(req):

  values = req.json
  prediction = predicts(values['text'])
  # print(prediction)

  return res.json(prediction)

# When we navigate to '/' - serve the dist folder
app.static('/', './dist')

@app.exception(NotFound)
async def ignore_404s(req, err):
  return await res.file('./dist/index.html')

if __name__ == "__main__":
  app.run(port=8000)
  