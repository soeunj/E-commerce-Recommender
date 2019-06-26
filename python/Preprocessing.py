
# coding: utf-8

# In[18]:


#import basic Libraries
import pandas as pd
import numpy as np
from tqdm import tqdm

#Importing Sklearn
from sklearn.preprocessing import StandardScaler, OneHotEncoder

#Import Market Basket Models
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules


# In[40]:


#import of files from the data folder.
aisles = pd.read_csv('./data/aisles.csv')
departments = pd.read_csv('./data/departments.csv')
products = pd.read_csv('./data/products.csv')


# # Cleaning Dataset

# In[20]:


opt = products.merge(aisles,how='left', on='aisle_id')
opt = opt.merge(departments,how='left', on='department_id')


# In[21]:


opt


# In[22]:


#adding food group for non food departments as 'other'
non_food_dep = ['household','pets','personal care', 'alcohol','beverages', 'babies', 'missing']
#adding food group for departments which are not ambiguous to proper food group
food_dep = {'bakery':'sugar, snacks, and bakeries','meat seafood':'proteins', 'canned goods':'processed foods'}

for (i, row) in opt.iterrows():
    if row['department'] in non_food_dep:
        opt.at[i,'foodgroup'] = 'others'
    elif row['department'] in food_dep:
        opt.at[i,'foodgroup'] = food_dep[row['department']]


# In[23]:


#converting the foodgroup to string to preserve order.
opt['foodgroup'] = opt['foodgroup'].astype(str)


# This project aims to implement recommender specifically for diet. Therefore, information related to diet could be different with other diet research and not percise. 
# 
# This project uses 8 food groups, such as #carbohydrates #proteins #vegetables and fruits #diary products and alternatives #fat #processed foods #sugar, sweets, and bakeries #others.

# In[24]:


#adding food group for aisle
food_aisle_carbohydrates = ['bulk grains rice dried goods', 'cereal', 'doughs gelatins bake mixes', 'dry pasta', 'fresh pasta', 'frozen breads doughs', 'grains rice dried goods', 'granola','hot cereal pancake mixes']
food_aisle_protein = ['eggs','frozen meat seafood', 'lunch meat','tofu meat alternatives']
food_aisle_vegetables_and_fruits = ['bulk dried fruits vegetables', 'fresh fruits', 'fresh herbs', 'fresh vegetables', 'frozen juice', 'packaged vegetables fruits', 'pickled goods olives', 'packaged produce']
food_aisle_diary_products_and_alternatives = ['cream', 'other creams cheeses', 'packaged cheese','soy lactosefree', 'specialty cheeses', 'yogurt', 'milk']
food_aisle_fat = ['butter', 'oils vinegars', 'nuts seeds dried fruit']
food_aisle_processed_foods = ['frozen meals', 'frozen pizza', 'instant foods', 'prepared meals', 'chips pretzels', 'crackers', 'energy granola bars', 'fruit vegetable snacks', 'breakfast bars pastries', 'frozen appetizers sides', 'prepared soups salads', 'frozen produce', 'frozen vegan vegetarian']
food_aisle_sugar_sweets_and_bakeries = ['frozen dessert','honeys syrups nectars', 'ice cream ice', 'refrigerated pudding desserts', 'candy chocolate', 'cookies cakes', 'ice cream toppings', 'mint gum', 'popcorn jerky', 'trail mix snack mix', 'baking ingredients', 'frozen breakfast']

for (i, row) in opt.iterrows():
    if row['aisle'] in food_aisle_carbohydrates:
        opt.at[i,'foodgroup'] = 'carbohydrates'
    elif row['aisle'] in food_aisle_protein:
        opt.at[i,'foodgroup'] = 'proteins'
    elif row['aisle'] in food_aisle_vegetables_and_fruits:
        opt.at[i,'foodgroup'] = 'vegetables and fruits'
    elif row['aisle'] in food_aisle_diary_products_and_alternatives:
        opt.at[i,'foodgroup'] = 'diary products and alternatives'
    elif row['aisle'] in food_aisle_fat:
        opt.at[i,'foodgroup'] = 'fat'
    elif row['aisle'] in food_aisle_processed_foods:
        opt.at[i,'foodgroup'] = 'processed foods'
    elif row['aisle'] in food_aisle_sugar_sweets_and_bakeries:
        opt.at[i,'foodgroup'] = 'sugar sweets and bakeries'
    else:
        opt.at[i,'foodgroup'] = 'others'


# In[25]:


unique_pair = opt[opt.foodgroup == 'nan'].groupby(['aisle','department']).size()


# In[26]:


unique_pair


# In[27]:


opt.head()


# In[28]:


#save_file = opt.to_csv('./data/merged_data.csv')

