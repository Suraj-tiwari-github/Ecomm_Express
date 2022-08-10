const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: { type: Number, min: 1, max: 5000 },
  onSale:Boolean,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "review",
    },
  ],
});

//!post middleware to delete every reply associated with it.
productSchema.post("findOneAndDelete", async function (del) {
  // Just deleted document, can be taken inside of the async function which will contain an array of replies, we can dereference it to delete the replies too.
  if (del) {
    await review.deleteMany({
      _id: {
        $in: del.review,
        //! This query means it will delete those id, which contains in our document that was just deleted in its replies array.
      },
    });
  }
  console.log("Deleted.");
});

module.exports = mongoose.model("Product", productSchema);
