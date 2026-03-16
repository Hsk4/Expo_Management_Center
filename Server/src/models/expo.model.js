const mongoose = require('mongoose');

const layoutBoothSchema = new mongoose.Schema({
    boothNumber: { type: String, required: true },
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    status: {
        type: String,
        enum: ["available", "reserved", "booked", "disabled"],
        default: "available",
    },
}, { _id: false });

const sessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    speaker: {
        type: String,
        trim: true,
        default: "",
    },
    topic: {
        type: String,
        trim: true,
        default: "",
    },
    location: {
        type: String,
        trim: true,
        default: "",
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    capacity: {
        type: Number,
        min: [1, "Session capacity must be at least 1"],
        default: 50,
    },
});

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
    totalBoothsGenerated : {
        type : Number,
        default : 0,
    },
    isActive : {
        type : Boolean,
        default : true,
    },
    layout: {
        templateType: { type: String, default: "" },
        eventType: { type: String, default: "" },
        customImageUrl: { type: String, default: "" },
        booths: { type: [layoutBoothSchema], default: [] },
        stagePosition: {
            x: { type: Number },
            y: { type: Number },
            width: { type: Number },
            height: { type: Number },
        },
        foodStallPositions: {
            type: [{ x: Number, y: Number, label: String }],
            default: [],
        },
    },
    sessions: {
        type: [sessionSchema],
        default: [],
    },
    paymentAmount: {
        type: Number,
        min: [0, "Payment amount cannot be negative"],
        default: 499,
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

expoSchema.pre('save', async function() {
    if(this.endDate <= this.startDate){
        throw new Error("End date must be after start date");
    }

    const gridCapacity = this.gridRows * this.gridCols;
    if(this.maxBooths > gridCapacity){
        throw new Error(`Max booths cannot exceed grid capacity of ${gridCapacity}`);
    }

    if (Array.isArray(this.sessions)) {
        this.sessions.forEach((session) => {
            if (session.endTime <= session.startTime) {
                throw new Error(`Session \"${session.title}\" must end after it starts`);
            }
        });
    }
});

const Expo = mongoose.model("Expo", expoSchema);

module.exports = Expo;
