const mongoose = require("mongoose");

const RefereeSchema = new mongoose.Schema({
    user: {type:mongoose.Types.ObjectId, ref:"user", require: false, unique:true},
    status: String
},
{timestamps: true}
)

export const Referee = mongoose.models.referee || mongoose.model('referee', RefereeSchema);


const UserSchema = new mongoose.Schema({
    username: { type: String, unique:true},
    email: { type: String, required: true, unique:true},
    password: String,
    full_name: String,
    phone_number: String,
    referer: {type:mongoose.Types.ObjectId, ref:"user", require: false},
    referees: {type:[mongoose.Types.ObjectId], ref:"referee", require: false},
    referralCode: { type: String, unique:true},
    homeLatitude: Number,
    homeLongitude: Number,
    dreamLatitude: Number,
    dreamLongitude: Number,
},
{timestamps: true}
)

const User = mongoose.models.user || mongoose.model('user', UserSchema);

export default User