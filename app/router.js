const Main = require('./controllers/main');
const Recommendation = require('./controllers/recommendation');
const DietAnalysis = require('./controllers/diet_analysis');
const History = require('./controllers/history');
const Authentication = require('./controllers/authentication');


module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('login');
    });
    app.get('/main', Main.loadMain);
    app.post('/signin', Authentication.signIn);
    app.get('/recommendation', Recommendation.getRecommendation);
    app.get('/dietanalysis', DietAnalysis.getDietAnalysis);
    app.get('/dietanalysis/:name', DietAnalysis.getListOfProductByDiet);
    app.get('/history', History.getHistory);
    app.get('/history/group', History.getHistoryByGroup);
    app.get('/history/department', History.getUserHistoryByDepartment);
    app.get('/history/aisle', History.getUserHistoryByAisle);
    app.get('/history/diet',History.getUserHistoryByDiet);
};