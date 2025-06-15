import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  universityId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },  // for display convenience
  stars: { type: Number, required: true },
  comment: { type: String, maxlength: 200 },
  createdAt: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', RatingSchema);

export default Rating;
