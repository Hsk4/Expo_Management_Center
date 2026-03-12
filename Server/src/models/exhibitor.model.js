const mongoose = require('mongoose');

const exhibitorSchema = new mongoose.Schema({

    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },
    companyName : {
        type : String,
        required : [true, "Company name is required"],
        trim : true,
    },
    description : {
        type : String,
        required : [true, "Description is required"],
        trim : true,
        maxLength : [1000, "Description cannot exceed 1000 characters"],
    },
    website : {
        type : String,
        trim : true,
        match : [
            /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/,
            "Please fill a valid URL"
        ]
    },
    contactEmail : {
        type : String,
        required : [true, "Contact email is required"],
        trim : true,
        match : [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address"
        ]
    },
    contactPhone : {
        type : String,
        trim : true,
        match : [
            /^\+?[1-9]\d{1,14}$/,
            "Please fill a valid phone number"
        ]
    },
    isVerified : {
        type : Boolean,
        default : false,
    }
},
    {timestamps : true,}
    );

module.exports = mongoose.model("Exhibitor", exhibitorSchema);