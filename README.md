# E-commerce-Recommender
This project is for capstone project

Dataset : https://www.kaggle.com/c/instacart-market-basket-analysis/data

## Prerequisites
- MongoDB
- Flask
- Python 3.x
- Node 10.x

## Instruction
- Run MongoDB:
```
mongod
```

- Create table 'ecommerce' and import processed dataset

- Add user in monogo shell ( You can choose user_id among 100330, 176478, 6409, 137629,164055 which have bigger size of data than other users )
```
db.user.insert({username : <<username>>, password : <<password>>, user_id : 100330 }})
```
- Go to app directory run those commands:
```
npm init
```
```
npm install
```

- Run your application:
```
npm start
```

- Go to python directory and run backend:
```
python api.py
```

- Open webpage 'localhost:4000'. You will see login page and login using username and password you just created.

## TODO
- Fix recommendation api

