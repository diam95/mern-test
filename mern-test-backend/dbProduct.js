const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {type: String, unique: true},
    description: String,
    code: String,
    attributes: [
        {
            isRequired: Boolean,
            entity: String,
            key: String
        }
    ],
    price: Number
})

export default