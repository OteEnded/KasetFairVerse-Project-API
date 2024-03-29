const Hemp_TheDrink_PlayRecords = require('../entities/Hemp_TheDrink_PlayRecords');
const Star = require('../models/Star');

const putil = require('../utilities/projectutility')

// Function to get all Hemp TheDrink play records
function getTheDrinkEndingList() {
    return ["Chocolate", "Coffee", "Plain", "Skim", "Strawberry", "Sweet"];
}

// Function to get all Hemp TheDrink play records
async function getAllTheDrinkPlayRecords() {
    try {
        const test = await Hemp_TheDrink_PlayRecords;
        const all_play_records = await Hemp_TheDrink_PlayRecords.findAll();
        const play_record_list = [];
        for (let i in all_play_records) {
            play_record_list.push(all_play_records[i].dataValues);
        }
        return play_record_list;
    } catch (error) {
        throw error;
    }
}

// Function to get Hemp TheDrink play records by user_id
async function getTheDrinkPlayRecordsByUserId(user_id) {
    try {
        const play_record = await Hemp_TheDrink_PlayRecords.findAll({
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

// Function to get Hemp TheDrink play record by round_id
async function getTheDrinkPlayRecordsByRoundId(round_id) {
    try {
        const play_record = await Hemp_TheDrink_PlayRecords.findOne({
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

// Function to get how many different TheDrink endings a user has played
async function getNumberOfDifferentTheDrinkEndingsPlayed(user_id) {
    try {
        let player_progress = await getTheDrinkProgressByUserId(user_id);
        let number_of_endings = 0;
        for (let i in getTheDrinkEndingList()) {
            if (player_progress[getTheDrinkEndingList()[i]] > 0) {
                number_of_endings += 1;
            }
        }
        return number_of_endings;
    }
    catch (error) {
        throw error;
    }
}

// Function to get TheDrink progress a user has played
// {
//     Chocolate: 1,
//     Coffee: 7,
//     Plain 0,
//     Skim: 3,
//     Strawberry: 2,
//     Sweet: 4
// }
async function getTheDrinkProgressByUserId(user_id) {
    try {
        const progress = {
            Chocolate: 0,
            Coffee: 0,
            Plain: 0,
            Skim: 0,
            Strawberry: 0,
            Sweet: 0
        }
        const play_records = await getTheDrinkPlayRecordsByUserId(user_id);
        for (let i in play_records) {
            progress[play_records[i].dataValues.ending] += 1;
        }
        return progress;
    }
    catch (error) {
        throw error;
    }
}

// Function to find Hemp TheDrink play records
async function findTheDrinkPlayRecords(column, value) {
    try {
        const play_records = await Hemp_TheDrink_PlayRecords.findAll({
            where: {
                [column]: value
            }
        });
        return play_records;
    } catch (error) {
        throw error;
    }
}

// Function to create a Hemp TheDrink play record
async function createTheDrinkPlayRecord(req) {
    try {
        const play_record = await Hemp_TheDrink_PlayRecords.create(req);
        await theDrinkStarUp(play_record);
        return play_record;
    } catch (error) {
        throw error;
    }
}

// Function to update a Hemp TheDrink play record
async function updateTheDrinkPlayRecord(req) {
    try {
        const play_record = await Hemp_TheDrink_PlayRecords.update(req, {
            where: {
                round_id: req.body.round_id
            }
        });
        return play_record;
    } catch (error) {
        throw error;
    }
}

// Function to delete a Hemp TheDrink play record
async function deleteTheDrinkPlayRecord(round_id) {
    try {
        const play_record = await Hemp_TheDrink_PlayRecords.findOne({
            where: {
                round_id: round_id
            }
        });
        if (!play_record){
            return "Cannot delete play record wtih round_id: " + round_id + " because it does not exist.";
        }
        await Hemp_TheDrink_PlayRecords.destroy({
            where: {
                round_id: round_id
            }
        });
        return play_record;
    } catch (error) {
        throw error;
    }
}

// Function to check if user should be given a TheDrink star and perform star up if so
async function theDrinkStarUp(play_record){
    try {

        // Check if last ending user played was the new ending for the user
        const player_progress = await getTheDrinkProgressByUserId(play_record.user_id);
        if (player_progress[play_record.ending] > 1) return;

        let starUpReq = {
            user_id: play_record.user_id,
            source: Star.star_config.Hemp_TheDrink.code_name,
            message: "Game star from Hemp_TheDrink at play_record id -> " + play_record.round_id
        }
        await Star.starUp(starUpReq);

    } catch (error) {
        throw error;
    }
}

async function resetTheDrinkPlayLifes() {
    try {

        // reset logic here
        putil.log("Hemp[resetTheDrinkPlayLifes] -> resetTheDrinkPlayLifes() called, work in progress...");

    } catch (error) {
        throw error;
    }
}

// Exporting functions
module.exports.getAllTheDrinkPlayRecords = getAllTheDrinkPlayRecords
module.exports = {
    getAllTheDrinkPlayRecords,
    getTheDrinkPlayRecordsByUserId,
    getTheDrinkPlayRecordsByRoundId,
    getNumberOfDifferentTheDrinkEndingsPlayed,
    getTheDrinkProgressByUserId,
    findTheDrinkPlayRecords,
    createTheDrinkPlayRecord,
    updateTheDrinkPlayRecord,
    deleteTheDrinkPlayRecord,
    theDrinkStarUp,
    resetTheDrinkPlayLifes
};
