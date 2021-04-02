from next_word_prediction import GPT2
gpt2 = GPT2()

def predicts(text):
  prediction = gpt2.predict_next(text, 2)

  result = {"suggestions": prediction}
  return result
