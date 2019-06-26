#import basic Libraries
import pandas as pd
import numpy as np

#Importing Sklearn
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity

def next_prod(df, num_col):
        return df[df.columns[num_col]].drop(df.columns[num_col]).sort_values(ascending=False).head()

def Recommender(user_id):
    hidem_ord = pd.read_csv('../data/hidem_ord.csv')
    hidem_ord = hidem_ord.drop('Unnamed: 0', axis=1)
    #return the total items
    users = hidem_ord.groupby(['user_id', 'product_name']).size().sort_values(ascending=False).unstack().fillna(0)
    #creates a similiarity by users.
    users_sim = pd.DataFrame(cosine_similarity(users), index=users.index, columns=users.index)
    # # Recommendations for Products by User ID
    #return the total items in the basket from the aisles
    products = hidem_ord.groupby(['product_name', 'user_id']).size().sort_values(ascending=False).unstack().fillna(0)
    #creates a similiarity by users.
    products_sim = pd.DataFrame(cosine_similarity(products), index=products.index, columns=products.index)
    #gives a recommendation for the last product added_to_cart
    profile = pd.Series(np.zeros(len(products.columns.tolist())), users_sim[user_id])
    
    recommendations = pd.Series(np.dot(products.values,users_sim[user_id]), index=products.index)
    
    return recommendations.sort_values(ascending=False).head()
    
