const mongoose = require("mongoose");

/**
 *  Contract Schema
 * @private
 */

const BookSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true, 
        },
        bookName:{
            type:String,
            require:true
        },
        bookAuthor:{
            type:String
        },
        desctiption:{
            type:String
        },
        status:{
            type:String
        }
    }, {timestamps:true}
);

module.exports = mongoose.model('books', BookSchema);