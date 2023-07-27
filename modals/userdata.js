const mongoose = require('mongoose')
const validator = require("validator")

const DataSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    FavSongs:[],
    FavArtists:[],
    histories:[],
})


const Data = mongoose.model('data',DataSchema)

module.exports = Data;

