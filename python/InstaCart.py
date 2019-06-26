
import pandas as pd
import numpy as np
from tqdm import tqdm

#Visualizaiton imports
import seaborn as sns

#Importing Sklearn
from sklearn.preprocessing import StandardScaler, OneHotEncoder

#Import Market Basket Models
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules


#import of all files from the data folder.
aisles = pd.read_csv('../data/aisles.csv')
departments = pd.read_csv('../data/departments.csv')
products = pd.read_csv('../data/products.csv')
order_products__prior = pd.read_csv('../data/order_products__prior.csv')
order_products__train = pd.read_csv('../data/order_products__train.csv')
orders = pd.read_csv('../data/orders.csv')
merged_products_aisles_departments = pd.read_csv('../data/merged_data.csv')
merged_products_aisles_departments = merged_products_aisles_departments.drop('Unnamed: 0', axis=1)


# # Preprocessing
opt = order_products__train.merge(merged_products_aisles_departments, how='left', on='product_id')
opt['aisle_id']= opt['aisle_id'].astype(str)

#instanciate Oone hot encoder ot break out the data my aisle.
ohe = OneHotEncoder(handle_unknown='ignore')

#test to  see # of aisles
print('# of unique aisles =',len(opt['aisle_id'].unique()))
aisle = ohe.fit_transform(opt['aisle_id'].astype(str).values.reshape(-1,1))

#one hot encode the aisles and create a dense matrix.
a_ohe = pd.DataFrame(aisle.toarray())
aisle = a_ohe.to_dense()

#add order_id to the one hot encoded matrix
basket = opt[['order_id']].join(aisle)

range(len(opt['aisle_id'].unique()))

#return the total items in the basket from the aisles
basket = basket.groupby('order_id').sum()

#covert any values to be a binary. 
def encode_units(x):
    if x <= 0:
        return 0
    if x >= 1:
        return 1

basket_sets = basket.applymap(encode_units)

aisle_dict = dict(zip(opt['aisle_id'].unique().astype('Int64'),opt['aisle'].unique()))

basket_sets.columns = list(range(1,len(aisle_dict)+1))
basket_sets.rename(columns=aisle_dict,inplace=True)

#creates conditions for the items in the basket.
frequent_itemsets = apriori(basket_sets, min_support=0.07, use_colnames=True)


# Apriori is an algorithm for extracting frequent itemsets with applications in association rule learning. The apriori algorithm has been designed to operate on databases containing transactions, such as purchases by customers of a store. An itemset is considered as "frequent" if it meets a user-specified support threshold. For instance, if the support threshold is set to 0.5, a frequent itemset is defined as a set of items that occur together in at least 50% of all transactions in the database.

# # Market Basket Results

#creates the rules to filter.
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)

# Support is the relatvie frequency that the rules show up.
# Confidence is a measure of the reliability of the rule.
# Lift is the ratio of the observed support to that expected if the two rules were independet.

#sorts to see the lift greater than or equal to 1
rules[rules['lift'] >= 1.5].head()


# # Market Basket for Products

reorders = opt[opt['reordered'] == 1]

reorders['product_id'] = reorders['product_id'].astype('int64')

# get list of hi volume products (products that occurr more than 1 time)
hivol = reorders.copy()['product_id'].value_counts().sort_values(ascending=False)    [reorders.copy()['product_id'].value_counts().sort_values(ascending=False) > 1].index.tolist()

# mask the reorders dataframe to only incluse dem hi
reorders = reorders[reorders['product_id'].isin(hivol)]

reorders['hi_dem'] = (reorders.copy()['product_id'].value_counts().sort_values(ascending=False)>1)

hidem_ord = reorders[reorders['hi_dem'] == True]

hidem_ord = hidem_ord.reset_index()

print('# of unique products =',len(hidem_ord['product_id'].unique()))
#tranposes the data to ensure that it is correctly fitted.
product = ohe.fit_transform(hidem_ord['product_id'].values.reshape(-1,1))

p_ohe = pd.DataFrame(product.toarray())
products = p_ohe.to_dense()

basket = hidem_ord[['order_id']].join(products)

#return the total items in the basket from the aisles
basket = basket.groupby('order_id').sum()

#covert any values to be a binary.
def encode_units(x):
    if x <= 0:
        return 0
    if x >= 1:
        return 1

basket_sets = basket.applymap(encode_units)

pro_dict = dict(zip(hidem_ord['product_id'].unique().astype('Int64'),hidem_ord['product_name'].unique()))

pro_dict = dict(zip(list(range(0,len(hidem_ord['product_id'].unique()))),hidem_ord['product_name'].unique()))

#rename the columns for easier analysis in rules. 
basket_sets.columns = list(range(0,len(pro_dict)))
basket_sets.rename(columns=pro_dict,inplace=True)


basket_sets.sum().head()

#creates conditions for the items in the basket.
frequent_itemsets = apriori(basket_sets, min_support=0.0005, use_colnames=True)


#creates the rules to filter.
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)



rules[(rules['lift'] >= 100) & (rules['confidence']>.5)]


rules.head()

