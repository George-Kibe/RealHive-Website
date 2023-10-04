const mongoose = require("mongoose");

const ComparableSchema = new mongoose.Schema({
    title: { type: String, require: true},
    description: String,
    LRNumber: String,
    type: String,
    userId: String,
    username: String,
    user: {type: mongoose.Types.ObjectId, ref:"user", require: false},
    image: String,
    images: [String],   
    address: String,
    amenities: [String],
    views: Number,
    verified: Boolean,
    published: Boolean,
    area: Number,
    date: String,
    priceType: String,
    price: {type: Number, require:true},
    latitude: {type: Number, require:true},
    longitude: {type: Number, require:true},
},
{timestamps: true}
)

const Comparable = mongoose.models.comparable || mongoose.model('comparable', ComparableSchema);

export default Comparable