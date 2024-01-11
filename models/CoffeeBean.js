const CoffeeBean_FindMyMeow_PlayRecords = require('../entities/CoffeeBean_FindMyMeow_PlayRecords');

// Function to get all FindMyMeow play records
async function getAllFindMyMeowPlayRecords() {
    try {
        const all_play_records = await CoffeeBean_FindMyMeow_PlayRecords.findAll();
        var play_record_list = [];
        for (i in all_play_records) {
            play_record_list.push(all_play_records[i].dataValues);
        }
        return play_record_list;
    } catch (error) {
        throw error;
    }
}

// Function to get FindMyMeow play records by user_id
async function getFindMyMeowPlayRecordsByUserId(user_id) {
    try {
        const play_record = await CoffeeBean_FindMyMeow_PlayRecords.findAll({
            where: {
                user_id: user_id
            }
        });
        return play_record;
    }
    catch (error) {
        throw error;
    }
}

// Function to get FindMyMeow play record by round_id
async function getFindMyMeowPlayRecordsByRoundId(round_id) {
    try {
        const play_record = await CoffeeBean_FindMyMeow_PlayRecords.findOne({
            where: {
                round_id: round_id
            }
        });
        return play_record;
    }
    catch (error) {
        throw error;
    }
}

// Function to get sum of FindMyMeow scores by user_id
async function getSumOfFindMyMeowScoresByUserId(user_id) {
    try {
        const sum_of_scores = await CoffeeBean_FindMyMeow_PlayRecords.sum('normal_cat', {
            where: {
                user_id: user_id
            }
        });
        return sum_of_scores;
    }
    catch (error) {
        throw error;
    }
}

// Function to get sum of FindMyMeow golden cat scores by user_id
async function getSumOfFindMyMeowGoldenCatScoresByUserId(user_id) {
    try {
        const sum_of_scores = await CoffeeBean_FindMyMeow_PlayRecords.sum('golden_cat', {
            where: {
                user_id: user_id
            }
        });
        return sum_of_scores;
    }
    catch (error) {
        throw error;
    }
}

// Function to get FindMyMeow high scores of a user by user_id
async function getFindMyMeowHighScoresByUserId(user_id) {
    try {
        const high_scores = await CoffeeBean_FindMyMeow_PlayRecords.max('normal_cat', {
            where: {
                user_id: user_id
            }
        });
        return high_scores;
    }
    catch (error) {
        throw error;
    }
}

// Function to get FindMyMeow golden cat high scores of a user by user_id
async function getFindMyMeowGoldenCatHighScoresByUserId(user_id) {
    try {
        const high_scores = await CoffeeBean_FindMyMeow_PlayRecords.max('golden_cat', {
            where: {
                user_id: user_id
            }
        });
        return high_scores;
    }
    catch (error) {
        throw error;
    }
}

// Function to create FindMyMeow play record
async function createFindMyMeowPlayRecord(req) {
    try {
        const play_record = await CoffeeBean_FindMyMeow_PlayRecords.create(req);
        return play_record;
    }
    catch (error) {
        throw error;
    }
}

// Function to update FindMyMeow play record
async function updateFindMyMeowPlayRecord(req) {
    try {
        const play_record = await CoffeeBean_FindMyMeow_PlayRecords.update(req, {
            where: {
                round_id: req.round_id
            }
        });
        return play_record;
    }
    catch (error) {
        throw error;
    }
}

// Function to delete FindMyMeow play record
async function deleteFindMyMeowPlayRecord(round_id) {
    try {
        const play_record = await CoffeeBean_FindMyMeow_PlayRecords.destroy({
            where: {
                round_id: round_id
            }
        });
        return play_record;
    } catch (error) {
        throw error;
    }
}

// export functions
module.exports = {
    getAllFindMyMeowPlayRecords,
    getFindMyMeowPlayRecordsByUserId,
    getFindMyMeowPlayRecordsByRoundId,
    getSumOfFindMyMeowScoresByUserId,
    getSumOfFindMyMeowGoldenCatScoresByUserId,
    getFindMyMeowHighScoresByUserId,
    getFindMyMeowGoldenCatHighScoresByUserId,
    createFindMyMeowPlayRecord,
    updateFindMyMeowPlayRecord,
    deleteFindMyMeowPlayRecord
}