const mongoose = require('mongoose');


// New Schema for users post
// will record users latitude and longitude. 
const PostSchema = new mongoose.Schema({
  long: {   },
  lat: {   }
});



module.exports = mongoose.model('Post', PostSchema);