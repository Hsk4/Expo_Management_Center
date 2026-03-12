const mongoose = require('mongoose');

const boothSchema = new mongoose.Schema({
    expoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Expo",
        required : true,
        index :true,
    },
    boothNumber : {
        type : String,
        required : [true, "Booth number is required"],

    },
    row : {
        type : Number,
        required : [true, "Row number is required"],
    },
    col: {
        type : Number,
        required : [true, "Column number is required"],
    },
    status : {
        type : String,
        enum : ["available", "reserved", "booked", "disabled"],
        default : "available",
    },
    exhibitorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null,
    },
    exhibitorDetails: {
        companyName: { type: String, default: "" },
        contactName: { type: String, default: "" },
        contactEmail: { type: String, default: "" },
        bannerImage: { type: String, default: "" },
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        instagram: { type: String, default: "" },
        description: { type: String, default: "" },
    }
},

    {
        timestamps : true,
    }
    );
// Unique index to ensure booth number is unique within the same expo
boothSchema.index({expoId:1, row : 1 , col : 1}, {unique : true});
// Unique booth number within the same expo
boothSchema.index({expoId:1, boothNumber : 1}, {unique : true});
module.exports = mongoose.model("Booth", boothSchema);