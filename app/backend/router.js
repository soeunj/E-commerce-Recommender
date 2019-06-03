const Recommendation = require('./controllers/recommendation');
const DietAnalysis = require('./controllers/diet_analysis');
const History = require('./controllers/history');

module.exports = function(app) {
    app.get('/recommendation/:id', Recommendation.getRecommendation);
    app.get('/dietanalysis/:id', DietAnalysis.getDietAnalysis);
    app.get('/dietanalysis/:id/:name', DietAnalysis.getListOfProductByDiet);
    app.get('/history/:id', History.getHistory);
    app.get('/history/:id/department', History.getDepartmentHistoryByUser);
    app.get('/history/:id/aisle', History.getAisleHistoryByUser);
    app.get('/history/:id/diet',History.getDietHistoryByUser);
    app.get('/history/:id/department/:name', History.getUserHistoryByDepartment);
    app.get('/history/:id/aisle/:name', History.getUserHistoryByAisle);
    app.get('/history/:id/diet/:name',History.getUserHistoryByDiet);
};