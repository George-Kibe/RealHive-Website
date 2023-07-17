const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    title: { type: String, require: true},
    description: String,
    category: {type:mongoose.Types.ObjectId, ref:"category", require: false},
    price: {type: Number, require:true},
    images:{type:[String]},
    properties:{type:Object}
},
{timestamps: true}
)

const Property = mongoose.models.property || mongoose.model('property', PropertySchema);

export default Property