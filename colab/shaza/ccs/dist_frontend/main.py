import os
from sanic import Sanic, response as res
from sanic.exceptions import NotFound
from sanic.websocket import ConnectionClosed
import json
import copy
from database import get_messages, post_message
from gpt import predict
# from other import predicts
from pred_final import make_prediction

app = Sanic(__name__)

# list of connected clients

  # must iterate a copy of the clients set
  # because the loop gets inconsistent if removing
  # an element while iterating
  


n

    # save message to db
    

@app.get('/rest/messages')


@app.post('/rest/messages')



#async def predict_results(req):

 # values = req.json
 # prediction = make_prediction(values['text'])
  #print(prediction)

 # return res.json(prediction)

app.static('/', './dist')

@app.exception(NotFound)
async def ignore_404s(request, exception):
    return await res.file('./<dist/index.html')

if __name__ == '__main__':
  # app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
  #app.run(host='localhost', port=int(os.environ.get("PORT", 5000)))
  # app.run(auto_reload=True, host='localhost', port=int(os.environ.get("PORT", 5000)))
app.run(port=5000)