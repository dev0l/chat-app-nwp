import os
from sanic import Sanic, response as res
from sanic.exceptions import NotFound
from sanic.websocket import ConnectionClosed
import json
import copy
from database import get_messages, post_message
from gpt import predict
from other import predicts

app = Sanic('app')

# list of connected clients
clients = set()

async def broadcast(message):
  # must iterate a copy of the clients set
  # because the loop gets inconsistent if removing
  # an element while iterating
  for client in copy.copy(clients):
    try: 
      await client.send(message)
    except ConnectionClosed:
      # remove client from list if disconnected
      clients.remove(client)
# @app.websocket('/ws/<model:string>')
# async def websockets(req, model:str):
@app.websocket('/ws')
async def websockets(req, ws):
  # add connected client to list
  clients.add(ws)

  while True:
    # wait to receive message from client
    data = await ws.recv()
    data = json.loads(data) # parse json

    # save message to db
    data['id'] = await post_message(data)

    print(data)

    data = json.dumps(data) # stringify dict

    # broadcast message to all clients
    await broadcast(data)

@app.get('/rest/messages')
async def messages(req):
  return res.json(await get_messages())

@app.post('/api/predictGpt')
async def predict_results(req):

  values = req.json
  prediction = predict(values['text'])
  # print(prediction)

  return res.json(prediction)

# Do we need different URLS based on Model? Use variable at the end of URL?

# @app.post('/api/predictOther')
# async def predict_results(req):

#   values = req.json
#   prediction = predicts(values['text'])
#   # print(prediction)

#   return res.json(prediction)

app.static('/', './dist')

@app.exception(NotFound)
async def ignore_404s(request, exception):
    return await res.file('./dist/index.html')

if __name__ == '__main__':
  # app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
  # app.run(host='localhost', port=int(os.environ.get("PORT", 5000)))
  app.run(auto_reload=True, host='localhost', port=int(os.environ.get("PORT", 5000)))