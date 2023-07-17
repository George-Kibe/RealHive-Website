const mongoose = require("mongoose");

const RefereeSchema = new mongoose.Schema({
    user: {type:mongoose.Types.ObjectId, ref:"user", require: false},
    status: String
},
{timestamps: true}
)

const Referee = mongoose.models.referee || mongoose.model('property', RefereeSchema);

export default Referee