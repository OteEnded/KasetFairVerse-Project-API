const Coupons = require('../entities/Coupons');
const Reward_Claim_Logs = require('../entities/Reward_Claim_Logs');

const Reward = require('../models/Reward');
const User = require('../models/User');

const putil = require('../utilities/projectutility')

// Function to get all coupons
async function getAllCoupons() {
    try {
        const all_coupons = await Coupons.findAll();
        const coupon_list = [];
        for (let i in all_coupons) {
            coupon_list.push(all_coupons[i].dataValues);
        }
        return coupon_list;
    } catch (error) {
        throw error;
    }
}

// Function to get coupons by user_id
async function getCouponsByUserId(user_id) {
    try {
        const coupons = await Coupons.findAll({
            where: {
                user_id: user_id
            }
        });
        return coupons;
    }
    catch (error) {
        throw error;
    }
}

// Function to get the coupon by coupon_uuid
async function getCouponByCouponUuid(coupon_uuid) {
    try {
        const coupon = await Coupons.findOne({
            where: {
                coupon_uuid: coupon_uuid
            }
        });
        return coupon;
    }
    catch (error) {
        throw error;
    }
}

// Function to get sum of coupons by user_id
async function getSumOfCouponsByUserId(user_id) {
    try {
        const sum_of_coupons = await Coupons.count({
            where: {
                user_id: user_id
            }
        });
        return sum_of_coupons;
    }
    catch (error) {
        throw error;
    }
}

// Function to get coupons by reward
async function getCouponsByReward(reward) {
    try {
        const coupons = await Coupons.findAll({
            where: {
                reward: reward
            }
        });
        return coupons;
    }
    catch (error) {
        throw error;
    }
}

// Function to check for create coupon request
// req = {
//     user_id: 0,
//     reward: "",
//     stars: ["", ""]
// }
async function createCouponRequest(req) {
    try {

        const Star = require('../models/Star');

        // Check if request is valid
        if(req.user_id == null || req.reward == null || req.stars == null || req.stars.length === 0) {
            return {
                is_success: false,
                message: "Invalid request",
                content: null
            }
        }

        // Check if the user exists
        const user = await User.getUser(req.user_id);
        if (!user) {
            return {
                is_success: false,
                message: "User not found with the given user_id -> " + req.user_id,
                content: null
            }
        }

        // Check if the reward exists
        if (!Reward.getRewardList().includes(req.reward)) {
            return {
                is_success: false,
                message: "Reward not found with the given reward -> " + req.reward + " from the list of rewards -> " + Reward.getRewardList(),
                content: null
            }
        }

        // // Check if the reward is still in stock
        // const reward_stocks = Reward.getRewardStocks();
        // const coupon_that_claim_this_reward = await Coupons.sum('coupon', {
        //     where: {
        //         reward: req.reward
        //     }
        // });
        // if (coupon_that_claim_this_reward >= reward_stocks[req.reward]) {
        //     return {
        //         is_success: false,
        //         message: "Reward is out of stock",
        //         content: null
        //     }
        // }

        // Check if the user really has the stars
        const star_inv = await Star.getStarInventoryByUserId(req.user_id);
        for (let i in req.stars) {
            if (!Object.keys(star_inv).includes(req.stars[i])) {
                return {
                    is_success: false,
                    message: "The star requested to use is not in user's inventory (req.stars -> "
                        + req.stars + " AND star_inv ->" + star_inv + ")",
                    content: null
                }
            }
            if (star_inv[req.stars[i]] === 0) {
                return {
                    is_success: false,
                    message: "The star requested to use is not in user's inventory (req.stars -> "
                        + req.stars + " AND star_inv ->" + star_inv + ")",
                    content: null
                }
            }
        }

        // Check if the stars are enough to claim the reward
        const stars_use = Reward.getStarsUseToTradeCoupon();
        if (!req.stars.length === stars_use[req.reward]) {
            return {
                is_success: false,
                message: "Not enough stars to claim the reward",
                content: null
            }
        }

        // List out the stars to use
        let stars_to_use = [];
        for (let i in req.stars) {
            let star = await Star.findStarToUse(req.user_id, req.stars[i]);
            if (star == null) {
                return {
                    is_success: false,
                    message: "Star not found with the given star_id -> " + req.stars[i],
                    content: null
                }
            }
            stars_to_use.push(star.star_id);
        }

        // Create a coupon
        const createCouponReq = {
            user_id: req.user_id,
            reward: req.reward,
            stars_to_use: stars_to_use
        }

        const coupon = await createCoupon(createCouponReq);
        if (!coupon) {
            return {
                is_success: false,
                message: "Failed to create a coupon",
                content: null
            }
        }
        return coupon;

    }
    catch (error) {
        throw error;
    }
}

// Function to create a coupon
async function couponUp(req) {
    try {
        putil.log("Coupon[couponUp]: req ->", req);

        // Check if the user already has the coupon that has the same reward and is still available
        const coupon_user_has = await getCouponsByUserId(req.user_id);
        for (let i in coupon_user_has) {
            let is_coupon_available = await isCouponAvailable(coupon_user_has[i].coupon_uuid);
            if (coupon_user_has[i].dataValues.reward === req.reward && is_coupon_available) {
                return {
                    is_success: false,
                    message: "User already has " + req.reward + " available coupon",
                    content: null
                }
            }
        }
        return await createCouponRequest(req);
    }
    catch (error) {
        throw error;
    }
}

// Function to create a coupon
async function createCoupon(req) {
    try {
        const Star = require('../models/Star');
        const Reward = require('../models/Reward');

        // Check reward is valid
        if (!Reward.getRewardList().includes(req.reward)) {
            return {
                is_success: false,
                message: "Reward not found with the given reward -> " + req.reward + " from the list of rewards -> " + Reward.getRewardList(),
                content: null
            }
        }

        const coupon = await Coupons.create({
            user_id: req.user_id,
            reward: req.reward,
        });
        for (let i in req.stars_to_use) {
            await Star.useStar(req.stars_to_use[i], coupon.coupon_uuid);
        }
        return coupon;
    }
    catch (error) {
        throw error;
    }
}

// Function to create major coupons
async function majorCouponUp(user_id) {
    try {
        putil.log("Coupon[majorCouponUp] -> user_id: ", user_id);
        const { getNumberOfDifferentStarSourcesByUserId } = require('../models/Star');
        const number_of_different_star_of_user = await getNumberOfDifferentStarSourcesByUserId(user_id, true);
        if (number_of_different_star_of_user < 7) {
            return {
                is_success: false,
                message: "Not enough different stars to claim the major coupon",
                content: null
            }
        }

        const coupon_user_has = await getCouponsByUserId(user_id);
        putil.log("coupon_user_has: ", coupon_user_has);
        for (let i in coupon_user_has) {
            if (coupon_user_has[i].dataValues.reward === "Major_ticket_2") {
                return {
                    is_success: false,
                    message: "User already has Major_ticket_2 coupon",
                    content: null
                }
            }
        }

        // check if Major_ticket_2 is still in stock
        const major_coupon_left = await Reward.getRewardLeftByReward("Major_ticket_2");
        if (major_coupon_left <= 0) {
            return {
                is_success: false,
                message: "Major_ticket_2 is out of stock",
                content: null
            }
        }

        return await createCoupon({
            user_id: user_id,
            reward: "Major_ticket_2",
            stars_to_use: []
        });

    }
    catch (error) {
        throw error;
    }
}

// Function to get sum of coupons by reward
async function getSumOfCouponsByReward(reward) {
    try {
        const amount_of_coupons = await Coupons.count({
            where: {
                reward: reward
            }
        });
        return amount_of_coupons;
    }
    catch (error) {
        throw error;
    }
}

// Function to get all available coupon by user_id
async function getAllAvailableCouponByUserId(user_id){
    try {
        const all_coupon = await getCouponsByUserId(user_id);
        putil.log("all_coupon: ", all_coupon);
        const available_coupon_list = [];

        const all = await Reward_Claim_Logs.findAll();
        let column_uuid = [];

        for (let i in all){
            column_uuid.push(all[i].dataValues.coupon_uuid)
        }

        for (let i in all_coupon){
            if (!column_uuid.includes(all_coupon[i].coupon_uuid)){
                available_coupon_list.push(all_coupon[i]);
            }
        }

        return available_coupon_list;
    }
    catch (error) {
        throw error;
    }
}

// Function to check if coupon is available
async function isCouponAvailable(coupon_uuid){
    try {
        const find_reward_claim_logs = await Reward_Claim_Logs.findOne({
            where: {
                coupon_uuid: coupon_uuid
            }
        });
        return find_reward_claim_logs == null;

    }
    catch (error) {
        throw error;
    }
}

// Function to redeem a coupon
async function redeemCoupon(coupon_uuid, staff){
    try {
        const coupon = await getCouponByCouponUuid(coupon_uuid);
        if (!coupon) {
            return {
                is_success: false,
                message: "Coupon not found with the given coupon_uuid -> " + coupon_uuid,
                content: null
            }
        }
        if (!isCouponAvailable(coupon_uuid)) {
            return {
                is_success: false,
                message: "Coupon is not available",
                content: null
            }
        }
        const reward_claim_log = await Reward_Claim_Logs.create({
            coupon_uuid: coupon_uuid,
            staff: staff
        });
        return {
            is_success: true,
            message: "Coupon is redeemed",
            content: reward_claim_log
        };
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    getAllCoupons,
    getCouponsByUserId,
    getCouponByCouponUuid,
    getSumOfCouponsByUserId,
    createCouponRequest,
    couponUp,
    createCoupon, // For TESTING ONLY! Remove this line in production
    majorCouponUp,
    getSumOfCouponsByReward,
    getCouponsByReward,
    getAllAvailableCouponByUserId,
    isCouponAvailable,
    redeemCoupon

}
