const Accessories = require('../models/Accessories');

async function testFunction() {
    try {
        const win_stat = await Accessories.getWinStat();
        console.log(win_stat);
    } catch (error) {
        console.error(error);
    }
}