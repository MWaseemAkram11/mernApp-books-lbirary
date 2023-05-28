const BookModal = require("../models/books.model")

exports.bookAction = async (req, res, next) => {
    const {bookId} = req.params
    let data = req.body;
    try {
      if (bookId !== '' || data !== '') {
        email = email.toLowerCase();
        let updated = await BookModal.updateOne({_id:mongoose.Types.ObjectId(bookId)},{ $set:{status:data.status} });
        if (updated) {
          return res
            .status(200)
            .send({ status: false, message: "Status Updated Successfully" });
        }
      } else
        return res
          .status(200)
          .send({ status: false, message: "Required fields are missing" });
    } catch (error) {
      next(error);
    }
};

exports.add = async (req, res, next) => {
    let data = req.body;
    try {
      if (data) {
        const book = new BookModal(data);
        const savedBook = await book.save();
        if (savedBook) {
          return res
            .status(200)
            .send({ status: false, message: "Book Added Successfully" });
        }
      } else
        return res
          .status(200)
          .send({ status: false, message: "Required fields are missing" });
    } catch (error) {
      next(error);
    }
};

exports.delete = async (req, res, next) => {
    const {bookId} = req.params
    try {
      if (bookId !== '' && bookId !== undefined) {
        email = email.toLowerCase();
        let deleted = await BookModal.deleteOne({ _id: mongoose.Types.ObjectId(data._id)});
        if (deleted.deletedCount) {
          return res
            .status(200)
            .send({ status: false, message: "Book Deleted Successfully Successfully" });
        }
      } else
        return res
          .status(200)
          .send({ status: false, message: "Required Book is not found" });
    } catch (error) {
      next(error);
    }
};