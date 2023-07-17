const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    title: { type: String, require: true},
    description: String,
    category: {type:mongoose.Types.ObjectId, ref:"category", require: false},
    price: {type: Number, require:true},
    images:{type:[String]},
    properties:{type:Object}
},
{timestamps: true}
)

const User = mongoose.models.property || mongoose.model('user', UserSchema);

export default User