import flask
from recommender import Recommender
from diet_analysis import Diet_Analysis
app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
    print(Recommender(3298))
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

@app.route('/recommendation/user_id=?', methods=['GET'])
def recommender(user_id):
    print(Recommender(user_id))
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

@app.route('/diet/user_id=?', methods=['GET'])
def diet_analysis(user_id):
    print(Diet_Analysis(user_id))
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"


app.run()