#import basic Libraries
import pandas as pd

def Diet_Analysis(user_id):
    opt = pd.read_csv('../data/merged_data_for_diet.csv')
    opt = opt.drop('Unnamed: 0', axis=1)

    #return the total items in the basket from the aisles
    user_diet = opt.groupby(['foodgroup','user_id']).size().sort_values(ascending=False).unstack().fillna(0)

    return user_diet.loc[:, user_id]