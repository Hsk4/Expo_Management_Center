const mongoose = require('mongoose');

const expoSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Title is required"],
        trim : true ,
        minLength : [3, "Title must be at least 3 characters long"],
        maxLength : [100, "Title must be less than 100 characters long"]
    },
    description : {
        type : String,
        required : [true, "Description is required"],
        trim : true ,
        minLength : [10, "Description must be at least 10 characters long"],
        maxLength : [1000, "Description must be less than 1000 characters long"]
    },
    theme:{
        type : String,
        trim : true ,
    },
    location : {
        type : String,
        required : [true, "Location is required"],
        trim : true ,
    },

    startDate : {
        type : Date,
        required : [true, "Start date is required"],
    },
    endDate : {
        type : Date,
        required : [true, "End date is required"],
    },

    status : {
        type : String,
        enum : ["draft", "published", "completed"],
        default : "draft",
    },
    maxBooths : {
        type : Number,
        required : [true, "Max booths is required"],
        min : [1, "Max booths must be at least 1"],
    },
    maxAttendees : {
        type : Number,
        required : [true, "Max attendees is required"],
        min : [1, "Max attendees must be at least 1"],
    },

    boothsBookedCount : {
        type : Number,
        default : 0,
    },
    attendeesRegisteredCount : {
        type : Number,
        default : 0,
    },
    gridRows:{
        type : Number,
        required : [true, "Grid rows is required"],
        min : [1, "Grid rows must be at least 1"],
    },
    gridCols:{
        type : Number,
        required : [true, "Grid columns is required"],
        min : [1, "Grid columns must be at least 1"],
    },
    isActive : {
        type : Boolean,
        default : true,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    }
},
    {
        timestamps: true,
    }

);

expoSchema.pre('save', function(next) {
    if(this.endDate <= this.startDate){
        return next(new Error("End date must be after start date"));
    }

    const gridCapacity = this.gridRows * this.gridCols;
    if(this.maxBooths > gridCapacity){
        return next(new Error(`Max booths cannot exceed grid capacity of ${gridCapacity}`));
    }
    next();
});

const Expo = mongoose.model("Expo", expoSchema);