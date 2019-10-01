import flask
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo
import pandas as pd
import json
import numpy as np

from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules
from sklearn.metrics.pairwise import cosine_similarity

app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config['MONGO_DBNAME'] = 'ecommerce'
app.config["MONGO_URI"] = "mongodb://localhost:27017/ecommerce"
mongo = PyMongo(app)

def encode_units(x):
    if x <= 0:
        return 0
    if x >= 1:
        return 1

@app.route('/diet/<id>', methods=['GET'])
def diet(id):
    pipeline = [{"$match":{"user_id":int(id)}},{"$group":{"_id":"$foodgroup", "count":{"$sum":1}}},{"$sort":{"count":1}}]
    online_users = mongo.db.analysis.aggregate(pipeline)
    data = []
    label = []
    for u in online_users:
        print(u)
        label.append(u['_id'])
        data.append(u['count'])
    result = {"data":data,"label":label}
    df = json.dumps(result)
    
    return df

@app.route('/analysis/order_hour_of_day/<id>', methods=['GET'])
def analysis_order_hour_of_day(id):
    pipeline = [{"$match":{"user_id":int(id)}},{"$group":{"_id":"$order_hour_of_day", "count":{"$sum":1}}},{"$sort":{"_id":1}},{"$limit":25}]
    online_users = mongo.db.analysis.aggregate(pipeline)
    data = []
    label = []
    for u in online_users:
        label.append(u['_id'])
        data.append(u['count'])
    result = {"data":data,"label":label}
    df = json.dumps(result)
    return df

@app.route('/analysis/order_dow/<id>', methods=['GET'])
def analysis_order_dow(id):
    pipeline = [{"$match":{"user_id":int(id)}},{"$group":{"_id":"$order_dow", "count":{"$sum":1}}},{"$sort":{"_id":1}},{"$limit":25}]
    online_users = mongo.db.analysis.aggregate(pipeline)
    data = []
    label = []
    for u in online_users:
        label.append(u['_id'])
        data.append(u['count'])
    result = {"data":data,"label":label}
    df = json.dumps(result)
    return df

@app.route('/analysis/reorder_department/<id>', methods=['GET'])
def reordered_department(id):
    pipeline = [{"$match":{"user_id":int(id)}},{"$group":{"_id":"$department", "count":{"$sum":1}, "mean":{"$avg":"$reordered"}}},{"$sort":{"mean":-1}},{"$limit":20}]
    online_users = mongo.db.analysis.aggregate(pipeline)
    data = []
    label = []
    for u in online_users:
        label.append(u['_id'])
        data.append(round(u['mean'], 3))
    result = {"data":data,"label":label}
    df = json.dumps(result)
    return df

@app.route('/analysis/reorder_aisle/<id>', methods=['GET'])
def reordered_aisle(id):
    pipeline = [{"$match":{"user_id":int(id)}},{"$group":{"_id":"$aisle", "count":{"$sum":1}, "mean":{"$avg":"$reordered"}}},{"$sort":{"mean":-1}},{"$limit":20}]
    online_users = mongo.db.analysis.aggregate(pipeline)
    data = []
    label = []
    for u in online_users:
        label.append(u['_id'])
        data.append(round(u['mean'], 3))
    result = {"data":data,"label":label}
    df = json.dumps(result)
    return df

@app.route('/analysis/reorder_diet/<id>', methods=['GET'])
def reordered_diet(id):
    pipeline = [{"$match":{"user_id":int(id)}},{"$group":{"_id":"$foodgroup", "count":{"$sum":1}, "mean":{"$avg":"$reordered"}}},{"$sort":{"mean":-1}},{"$limit":20}]
    online_users = mongo.db.analysis.aggregate(pipeline)
    data = []
    label = []
    for u in online_users:
        label.append(u['_id'])
        data.append(round(u['mean'], 3))
    result = {"data":data,"label":label}
    df = json.dumps(result)
    return df

@app.route('/analysis/associations/<id>', methods=['GET'])

def associations(id):
    pipeline = [{"$match":{"user_id":int(id)}},{"$group":{"_id":{"order_id":"$order_id","product_id":"$product_id"}, "count":{"$sum":1},"product_name":{"$first":"$product_name"}, "product_id":{"$first":"$product_id"},"order_id":{"$first":"$order_id"}}}]
    associations = mongo.db.analysis.aggregate(pipeline)
    results = []
    for u in associations:
        results.append(u)
    result = json.dumps(results)
    return result

    data = pd.DataFrame(results)
    print(data)
    #preparting data for apriori algor
    basket = data.pivot(index='order_id', columns='product_id', values='count')
    basket = basket.fillna(0)
    basket_sets = basket.applymap(encode_units)
    pro_dict = dict(zip(data['product_id'].unique().astype('Int64'),data['product_name'].unique()))
    pro_dict = dict(zip(list(range(0,len(data['product_id'].unique()))),data['product_name'].unique()))
    basket_sets.columns = list(range(0,len(pro_dict)))
    basket_sets.rename(columns=pro_dict,inplace=True)
    #create association rules
    frequent_itemsets = apriori(data[['order_id', 'product_name', 'count']], min_support=0.4,use_colnames=True)

    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)
    save_data = rules.sort_values(['support', 'confidence'], ascending=False).head(20)
    df = save_data.to_json()
    return df


@app.route('/analysis/recommendation/<id>', methods=['GET'])
def recommendation(id):

    pipeline = [{"$match":{"user_id":int(id)}},{"$sort":{"antecedent support":-1}}]
    recommendation = mongo.db.association.aggregate(pipeline)
    results = []
    product = []
    association = []
    rate = []
    p_r = {}
    for u in recommendation:
        key = list(u.keys())
        product.append(u[key[2]])
        association.append(u[key[3]])
        #rate.append(round(u[key[4]],3))
        if u[key[2]] not in p_r.keys():
            p_r[u[key[2]]] = round(u[key[4]],3)
    print(p_r)
    results = {"product":product, "association":association, "p_r":p_r}#"rate":rate
    #results.append({"antecedents":product, "rate": rate, "association":association})
    result = json.dumps(results)
    print(result)
    '''
    results = []
    pipeline = [{"$match":{"user_id":int(id)}},{"$group":{"_id":{"order_id":"$order_id","product_id":"$product_id"}, "count":{"$sum":1},"user_id":{"$first":"$user_id"},"product_name":{"$first":"$product_name"}, "product_id":{"$first":"$product_id"},"order_id":{"$first":"$order_id"}}}]
    recommendation = mongo.db.analysis.aggregate(pipeline)
    for u in recommendation:
        results.append(u)
    data = pd.DataFrame(results)
    u = data.groupby(['user_id','product_name']).size().sort_values(ascending=False).unstack().fillna(0)
    u_sim = pd.DataFrame(cosine_similarity(u),index=u.index,columns=u.index)

    p = data.groupby(['product_name','user_id']).size().sort_values(ascending=False).unstack().fillna(0)

    recommendations = pd.Series(np.dot(p.values,u_sim[id]), index=p.index)
    save_data = recommendations.sort_values(ascending=False)[:11]

    df = save_data.to_json()
'''
    return result
    #return df

app.run()