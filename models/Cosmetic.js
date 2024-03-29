const Cosmetic_HoldYourBasket_PlayRecords = require('../entities/Cosmetic_HoldYourBasket_PlayRecords');
const Cosmetic_HoldYourBasket_PlayLifes = require("../entities/Cosmetic_HoldYourBasket_PlayLifes");
const Star = require('../models/Star');

const putil = require('../utilities/projectutility')

// Function to get all HoldYourBasket play records
async function getAllHoldYourBasketPlayRecords() {
    try {
        const all_play_records = await Cosmetic_HoldYourBasket_PlayRecords.findAll();
        const play_record_list = [];
        for (let i in all_play_records) {
            play_record_list.push(all_play_records[i].dataValues);
        }
        return play_record_list;
    } catch (error) {
        throw error;
    }
}

// Function to get HoldYourBasket play records by user_id
async function getHoldYourBasketPlayRecordsByUserId(user_id) {
    try {
        const play_record = await Cosmetic_HoldYourBasket_PlayRecords.findAll({
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

// Function to get HoldYourBasket play record by round_id
async function getHoldYourBasketPlayRecordsByRoundId(round_id) {
    try {
        const play_record = await Cosmetic_HoldYourBasket_PlayRecords.findOne({
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

// Function to get sum of HoldYourBasket scores by user_id
async function getSumOfHoldYourBasketScoresByUserId(user_id) {
    try {
        const sum_of_scores = await Cosmetic_HoldYourBasket_PlayRecords.sum('score', {
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

// Function to get HoldYourBasket high scores of a user by user_id
async function getHoldYourBasketHighScoresByUserId(user_id) {
    try {
        const high_scores = await Cosmetic_HoldYourBasket_PlayRecords.max('score', {
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

// Function to get HoldYourBasket the highest scores record of all records
async function getHoldYourBasketHighestScoresRecord() {
    try {
        const high_scores = await Cosmetic_HoldYourBasket_PlayRecords.max('score');
        return high_scores;
    }
    catch (error) {
        throw error;
    }
}

// Function to find HoldYourBasket play records
async function findHoldYourBasketPlayRecords(column, value) {
    try {
        const play_records = await Cosmetic_HoldYourBasket_PlayRecords.findAll({
            where: {
                [column]: value
            }
        });
        return play_records;
    } catch (error) {
        throw error;
    }
}

// Function to create a HoldYourBasket play record
async function createHoldYourBasketPlayRecord(req) {
    try {
        const play_record = await Cosmetic_HoldYourBasket_PlayRecords.create(req);
        await holdYourBasketStarUp(play_record);
        return play_record;
    } catch (error) {
        throw error;
    }
}

// Function to update a HoldYourBasket play record
async function updateHoldYourBasketPlayRecord(req) {
    try {
        const play_record = await Cosmetic_HoldYourBasket_PlayRecords.update(req, {
            where: {
                round_id: req.body.round_id
            }
        });
        return play_record;
    } catch (error) {
        throw error;
    }
}

// Function to delete a HoldYourBasket play record
async function deleteHoldYourBasketPlayRecord(round_id) {
    try {
        const play_record = await Cosmetic_HoldYourBasket_PlayRecords.findOne({
            where: {
                round_id: round_id
            }
        });
        if (!play_record){
            return "Cannot delete play record wtih round_id: " + round_id + " because it does not exist.";
        }
        await Cosmetic_HoldYourBasket_PlayRecords.destroy({
            where: {
                round_id: round_id
            }
        });
        return play_record;
    } catch (error) {
        throw error;
    }
}



// Function to get all HoldYourBasket play lifes
async function getAllHoldYourBasketPlayLifes() {
    try {
        const all_play_lifes = await Cosmetic_HoldYourBasket_PlayLifes.findAll();
        const play_life_list = [];
        for (let i in all_play_lifes) {
            play_life_list.push(all_play_lifes[i].dataValues);
        }
        return play_life_list;
    } catch (error) {
        throw error;
    }
}

// Function to get HoldYourBasket play lifes by user_id
async function getHoldYourBasketPlayLifesByUserId(user_id) {
    try {
        let play_life = await Cosmetic_HoldYourBasket_PlayLifes.findOne({
            where: {
                user_id: user_id
            }
        });
        // if it does not exist, create new one
        if (!play_life) {
            play_life = await Cosmetic_HoldYourBasket_PlayLifes.create({
                user_id: user_id
            });
        }
        return play_life["hold_your_basket"];
    }
    catch (error) {
        throw error;
    }
}


// Function to get SpinWheel play lifes by user_id
async function getSpinWheelPlayLifesByUserId(user_id) {
    try {
        let play_life = await Cosmetic_HoldYourBasket_PlayLifes.findOne({
            where: {
                user_id: user_id
            }
        });
        // if it does not exist, create new one
        if (!play_life) {
            play_life = await Cosmetic_HoldYourBasket_PlayLifes.create({
                user_id: user_id
            });
        }

        return play_life["spin_wheel"];
    }
    catch (error) {
        throw error;
    }
}

// Function to create a HoldYourBasket play lifes
async function createHoldYourBasketPlayLifes(req) {
    try {
        const play_lifes = await Cosmetic_HoldYourBasket_PlayLifes.create(req);
        return play_lifes;
    } catch (error) {
        throw error;
    }
}

// Function to create a SpinWheel play lifes
async function createSpinWheelPlayLifes(req) {
    try {
        const play_lifes = await Cosmetic_HoldYourBasket_PlayLifes.create(req);
        return play_lifes;
    } catch (error) {
        throw error;
    }
}


// Function to update HoldYourBasket play lifes
async function updateHoldYourBasketPlayLifes(user_id, offset) {
    try {
        putil.log(user_id, offset)
        let current_play_lifes = await getHoldYourBasketPlayLifesByUserId(user_id);
        putil.log(current_play_lifes)

        let new_play_lifes = {
            hold_your_basket: current_play_lifes + offset
        };

        if (new_play_lifes.hold_your_basket < 0) new_play_lifes.hold_your_basket = 0;
        if (new_play_lifes.hold_your_basket > 20) new_play_lifes.hold_your_basket = 20;

        putil.log(new_play_lifes)
        await Cosmetic_HoldYourBasket_PlayLifes.update(new_play_lifes, {
            where: {
                user_id: user_id
            }
        });
        return await getHoldYourBasketPlayLifesByUserId(user_id);
    }
    catch (error) {
        throw error;
    }
}

// Function to update a SpinWheel play lifes
async function updateSpinWheelPlayLifes(user_id, offset) {
    try {
        let current_play_lifes = await getSpinWheelPlayLifesByUserId(user_id);
        let new_play_lifes = {
            spin_wheel: current_play_lifes + offset
        };

        if (new_play_lifes.spin_wheel < 0) new_play_lifes.spin_wheel = 0;
        if (new_play_lifes.spin_wheel > 10) new_play_lifes.spin_wheel = 10;


        await Cosmetic_HoldYourBasket_PlayLifes.update(new_play_lifes, {
            where: {
                user_id: user_id
            }
        });

        return await getSpinWheelPlayLifesByUserId(user_id);
    }
    catch (error) {
        throw error;
    }
}

// Function to check if user should be given a HoldYourBasket star and perform star up if so
async function holdYourBasketStarUp(play_record){
    try {

        const sum_score = await getSumOfHoldYourBasketScoresByUserId(play_record.user_id);
        if (sum_score < 30000) return;

        const is_starred = await Star.getStarsByUserId(play_record.user_id, true);
        for (let i in is_starred) {
            if (is_starred[i].source === Star.star_config.Cosmetic_HoldYourBasket.code_name) return;
        }

        let starUpReq = {
            user_id: play_record.user_id,
            source: Star.star_config.Cosmetic_HoldYourBasket.code_name,
            message: "Game star from Cosmetic_HoldYourBasket at play_record id -> " + play_record.round_id + " that made user's sum score -> " + sum_score
        }
        await Star.starUp(starUpReq);

    } catch (error) {
        throw error;
    }
}

// Function to add spinwheel play lifes to every user in play lifes table every day at 00:00
async function addSpinWheelPlayLifesToAllUsers() {
    try {

        putil.log("Cosmetic[addSpinWheelPlayLifesToAllUsers]: Adding spinwheel play lifes to every user in Cosmetic_HoldYourBasket_PlayLifes table...");

        const all_play_lifes = await getAllHoldYourBasketPlayLifes();
        for (let i in all_play_lifes) {
            await updateSpinWheelPlayLifes(all_play_lifes[i].user_id, 5);
        }
    } catch (error) {
        throw error;
    }
}


// Exporting functions
module.exports = {
    getAllHoldYourBasketPlayRecords,
    getHoldYourBasketPlayRecordsByUserId,
    getHoldYourBasketPlayRecordsByRoundId,
    getSumOfHoldYourBasketScoresByUserId,
    getHoldYourBasketHighScoresByUserId,
    getHoldYourBasketHighestScoresRecord,
    findHoldYourBasketPlayRecords,
    createHoldYourBasketPlayRecord,
    updateHoldYourBasketPlayRecord,
    deleteHoldYourBasketPlayRecord,
    getAllHoldYourBasketPlayLifes,
    getHoldYourBasketPlayLifesByUserId,
    getSpinWheelPlayLifesByUserId,
    updateHoldYourBasketPlayLifes,
    updateSpinWheelPlayLifes,
    createHoldYourBasketPlayLifes,
    createSpinWheelPlayLifes,
    addSpinWheelPlayLifesToAllUsers
};
