const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    title: { type: String, require: true},
    description: String,
    userSub: String,
    user: {type: mongoose.Types.ObjectId, ref:"user", require: false},
    image: String,
    images: [String],
    type: String,
    address: String,
    video: String,
    perks: [String],
    amenities: [String],
    views: Number,
    verified: Boolean,
    published: Boolean,
    area: Number,
    rating: Number,
    ratings: Number,
    contactNumber: String,
    contactEmail: String,
    priceType: String,
    oldPrice: Number,
    newPrice: {type: Number, require:true},
    latitude: {type: Number, require:true},
    longitude: {type: Number, require:true},
},
{timestamps: true}
)

const Property = mongoose.models.property || mongoose.model('property', PropertySchema);

export default Property