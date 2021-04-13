from skipy_skip_grams import fetch_model, give_similar, give_context_similar, randomize_start_string
from skipy_pos import build_pos, predict_pos
import pandas as pd
import spacy
import random

words_df = pd.read_csv("./dataset/tags.csv")

nlp = spacy.load("en_core_web_md")

fetch_model()
build_pos()
randomize_start_string()

### Methods:  

def isWhitespace(string_input):
  if len(string_input) > 0 and string_input[-1] == " ":
    return True
  else:
    return False

def analyze_string(string_input):
  words_typed = []
  string_input = string_input.lower()
  valid_letters = "abcdefghijklmnopqrstuvwxyz "
  for elem in string_input:
    if elem not in valid_letters: 
        string_input = string_input.replace(elem, "") 

  single_words = string_input.split()
  for i in range(0, len(single_words)):
    #print(i)
    if i < 3:
      words_typed.append(single_words[-1 -i])
      #print(i)
      #print(words_typed)
  #print(words_typed[0])
  return words_typed

def check_spacy(word1, word0):
  l_string = str(word1) + " " + str(word0)
  doc = nlp(l_string)
  # print(doc)
  similarity = doc[1].similarity(doc[0])
  Pos1 = nlp.vocab.strings[doc[1].pos_]
  Pos0 = nlp.vocab.strings[doc[0].pos_]
  Dep1 = nlp.vocab.strings[doc[1].dep_]
  Dep0 = nlp.vocab.strings[doc[0].dep_]

  # global spacy_data

  spacy_data = [Pos1, Pos0, Dep1, Dep0, similarity]
  #print(spacy_data)
  return spacy_data

# def verify_pos(long_list):
#   narrowed_list = []
#   for i in range (0, 10000):
#     for k in range (0, len(long_list)):
#       if words_df.iloc[i, 3] == pos and words_df.iloc[i, 1] == long_list[k]:
#         narrowed_list.append(long_list[k])
#         #print(narrowed_list)       
#   return narrowed_list

def start_pred(pos):
  start_list = []
  for i in range (0, 10000):
    if words_df.iloc[i, 3] == pos:
      start_list.append(words_df.iloc[i, 1])
  start_list = start_list[:5]
  return start_list

def merge_predictions(start_list, long_list):
  merged = []
  if long_list:
    for i in range(0, 3):
      merged.append(start_list[i])
      merged.append(long_list[i])
    merged.pop()
  else:
    merged.append(start_list[:5])
  return merged

#  select word from words
#  where word is longlist[i]
#  and pos is <int>
#  order by frequency desc

#### predict expected pos
#### check give_context_similar for predicted pos
#### take three suggestions with correct pos and one with incorrect
#### take fifth suggestion from frequency database

#### Run:

randword = randomize_start_string()

def make_prediction(string_input, randword):
  if isWhitespace(string_input):
    string_input = "www skipy " + randword + " " + string_input
    words_typed = analyze_string(string_input)
    spacy_data = check_spacy(words_typed[1], words_typed[0])
    pos = predict_pos(spacy_data[0], spacy_data[1], spacy_data[2], spacy_data[3], spacy_data[4])
    basic = start_pred(pos)
    #print(basic)
    skip_grams = give_context_similar(string_input, 5)
    #print(skip_grams)
    merged = merge_predictions(basic, skip_grams)
    result = {"suggestions": merged}
  else:
    empty = []
    result = {"suggestions": empty}
  return result

# myArray = make_prediction(" ")

# print(myArray)

# narrowed_list = verify_pos(long_list)  ----- turned of as it is too slow