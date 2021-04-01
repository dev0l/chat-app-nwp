from next_word_prediction import GPT2
gpt2 = GPT2()

def predict(text):
  prediction = gpt2.predict_next(text, 5)

  result = {"text_to_predict": prediction}
  return result
