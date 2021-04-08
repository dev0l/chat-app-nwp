import pandas as pd
import numpy as np   
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

def build_pos():
  # load csv -> split to X,y -> split to train/test
  dataset = pd.read_csv("data_pos.csv")
  X = dataset.iloc[:, 1:-1].values
  y = dataset.iloc[:, -1].values
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 0)
  global classifier
  classifier = DecisionTreeClassifier(random_state = 0)
  classifier.fit(X_train, y_train)


def predict_pos(Pos1, Pos0, Dep1, Dep0, Sim):
  single_pred = classifier.predict([[Pos1, Pos0, Dep1, Dep0, Sim]])
  if single_pred == 97 or single_pred == 99:
    single_pred = 95
  return single_pred

build_pos()
#predict_pos(86,98,400,423,0.5554912686347961)



