const Booth = require('../../models/booth.model');
const Expo = require('../../models/expo.model');

exports.generateBoothGrid = async (expoId, layoutBooths = []) => {
    // get expo and check if it exists
    const expo = await Expo.findById(expoId);
    if(!expo){
        throw new Error("Expo not found");
    }

    const {gridRows, gridCols, maxBooths} = expo ;

    const boothsToInsert = [];

    if (Array.isArray(layoutBooths) && layoutBooths.length > 0) {
        let fallbackCounter = 1;
        for (const booth of layoutBooths) {
            if (!booth || typeof booth.row !== 'number' || typeof booth.col !== 'number') continue;
            boothsToInsert.push({
                expoId,
                boothNumber: booth.boothNumber || `B${fallbackCounter}`,
                row: booth.row,
                col: booth.col,
                status: booth.status || 'available',
            });
            fallbackCounter++;
        }
    } else {
        const totalGridCapacity = gridRows * gridCols;
        let boothCounter = 1 ;

        for(let row = 1 ; row <= gridRows ; row++){
            for(let col = 1 ; col <= gridCols ; col++){
                const isWithinBookableRange = boothCounter <= maxBooths;

                boothsToInsert.push({
                    expoId,
                    boothNumber : `B${boothCounter}`,
                    row,
                    col,
                    status : isWithinBookableRange ? 'available' : 'disabled',
                });

                boothCounter++;
            }
        }
    }

    // remove existing booths if regenerating
    await Booth.deleteMany({expoId});

    // bulk insert new booths
    await Booth.insertMany(boothsToInsert);

    // update expo with total booths generated
    expo.totalBoothsGenerated = boothsToInsert.length;
    expo.boothsBookedCount = 0;
    await expo.save();
    return {
        totalGenerated : boothsToInsert.length,
        maxBooths : maxBooths,
    }

}