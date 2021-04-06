from databases import Database

# connect to database / create if not exists
db = Database('sqlite:chat_message_data.db')

# help functions for easy quering
async def get(query, values = {}):
  rows = await db.fetch_all(query=query, values=values)
  dicts = []
  for row in rows:
    dicts.append(dict(row))
  return dicts

async def run(query, values):
  return await db.execute(query=query, values=values)

# message functions
async def get_messages():
  return await get('SELECT * FROM messages')

async def post_message(message):
  return await run('INSERT INTO messages(sender, text, time) VALUES (:sender, :text, :time)', message)