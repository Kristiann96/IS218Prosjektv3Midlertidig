var express = require('express');
var router = express.Router();
const dataService = require('../services/supabaseService');

router.get('/', async function (req, res, next) {
    try {
        // Get all data using the data service
        const { shelterData, bunkerData, error } = await dataService.getAllData();

        if (error) {
            throw error;
        }

        res.render('index', {
            title: 'Express',
            shelterData: JSON.stringify(shelterData),
            bunkerData: JSON.stringify(bunkerData)
        });
    } catch (error) {
        console.error('Route error:', error);
        res.render('index', {
            title: 'Express',
            shelterData: 'null',
            bunkerData: 'null'
        });
    }
});

module.exports = router;