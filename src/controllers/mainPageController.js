const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function callStoredProcedure(seasonId) {
    try {
        const result = await sequelize.query('CALL get_media_by_season_id(:seasonId)', {
            replacements: { seasonId },
            type: Sequelize.QueryTypes.RAW,
        });

        console.log(result);
    } catch (error) {
        console.error('Error calling stored procedure:', error);
    }
}