const mongoose = require ("mongoose");
const bcrypt = require ("bcryptjs");
// for attendee --> Track visited expos
const attendeeSchema = new mongoose.Schema({
    expoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Expo",
        required : true
    },
    visitedAt : {
        type : Date,
        default : Date.now
    },
    seatsBooked: {
        type: Number,
        min: 1,
        default: 1,
    },
    paymentStatus: {
        type: String,
        enum: ['paid'],
        default: 'paid',
    },
    paymentReference: {
        type: String,
        default: '',
    },
    paidAt: {
        type: Date,
        default: Date.now,
    },
    paymentAmount: {
        type: Number,
        min: 0,
        default: 0,
    },
},
    {_id: false}
)

const exhibitorSchema = new mongoose.Schema({
    expoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Expo",
        required : true
    },
    boothId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Booth",
        required : true
    },
    bookedAt:{
        type : Date,
        default : Date.now
    },

},
{_id: false})

const bookmarkedSessionSchema = new mongoose.Schema({
    expoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expo",
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    bookmarkedAt: {
        type: Date,
        default: Date.now
    }
}, {_id: false})

const profileSchema = new mongoose.Schema({
    avatarUrl: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    organization: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    companyName: { type: String, trim: true, default: "" },
    companyDescription: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    supportEmail: { type: String, trim: true, lowercase: true, default: "" }
}, {_id: false})

// main schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is required"],
        trim : true
    },
    email: {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        lowercase : true,
        trim : true,
        match:[
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address"
        ]
    },

    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : [6, "Password must be at least 6 characters long"],
        select : false ,
    },

    role : {
      type : String,
        enum : ["attendee", "admin", "exhibitor"],
        default : "attendee"
    },

    isActive:{
        type : Boolean,
        default : true
    },

    attendedExpos : {type :[attendeeSchema], default : []},
    bookedBooths : {type : [exhibitorSchema], default : []},
    bookmarkedSessions: { type: [bookmarkedSessionSchema], default: [] },
    profile: { type: profileSchema, default: () => ({}) },

    resetPasswordToken : {
        type : String,
        select : false,
        default : null
    },
    resetPasswordExpiry : {
        type : Date,
        select : false,
        default : null
    }
},{
    timestamps : true
    }
);

userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

