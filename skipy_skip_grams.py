import pandas as pd
from sklearn.metrics.pairwise import euclidean_distances
import random

def fetch_model():
  global distance_matrix
  global id2word  
  global word2id
  global words
  df = pd.read_csv("./datasets/data_words.csv")
  weights = df.iloc[:, 1:].values
  distance_matrix = euclidean_distances(weights)
  words = df.iloc[:, 0].values
  id2word = {}
  for i in range (1, len(words)):
    id2word[i] = words[i-1]
  word2id = dict([(value, key) for key, value in id2word.items()])

def randomize_start_string():
  rint = random.randint(0, len(words) -1)
  rword = words[rint]
  return rword

def give_similar(word, length):
  try:
    similar_words = {
      search_term: [
        id2word[idx] 
        for idx in distance_matrix[word2id[search_term]-1].argsort()[1:length]+1
      ] 
      for search_term in [word]
    }
    #print(similar_words)               
    return similar_words
  except Exception:
    pass

def give_context_similar(string_input, length):
  ### leave only lowercase letters
  string_input = string_input.lower()
  valid_letters = "abcdefghijklmnopqrstuvwxyz "
  for ele in string_input: 
    if ele not in valid_letters: 
        string_input = string_input.replace(ele, "")
  
  ### extract last three words of the string
  #print(string_input)
  single_words = string_input.split()
  words_typed = []
  for i in range(0, len(single_words)):
    if i < 3:
      words_typed.append(single_words[-1 -i])
  #print(words_typed)

  ### make dictionaries of similar context words

  dict1 = {}
  dict2 = {}
  dict3 = {}

  try:
    dict1 = give_similar(words_typed[0], length)
    dict2 = give_similar(words_typed[1], length)
    dict3 = give_similar(words_typed[2], length)
  except Exception:
    pass
  values_list1 = []
  values_list2 = []
  values_list3 = []
  
  #print(dict1)

  if(dict1):
    values1 = dict1.values()
    values_list1 = list(values1)
  if(dict2):
    values2 = dict2.values()
    values_list2 = list(values2)
  if(dict3):
    values3 = dict3.values()
    values_list3 = list(values3)

  ### combine dictionaries into one list
  long_list = []
  for i in range(0, length - 1):
    if (values_list1):    
      long_list.append(values_list1[0][i])
    if (values_list2):
      long_list.append(values_list2[0][i])
    if (values_list3):
      long_list.append(values_list3[0][i])
  
  #print("Combined:")
  #print(long_list)
  return long_list

#fetch_model()
#give_context_similar("the last book", 50)
#give_similar("hole", 10)