//replace IScreening, collection
import { Schema, model, CallbackError } from 'mongoose';
import IScreening from '../interfaces/screening.interface';
import Movie from './movie.model';
const schema = new Schema<IScreening>({
  movie: { type: Schema.Types.ObjectId, ref: 'movies', required: true },
  startDate: { type: Date, required: true },
  hall: { type: Schema.Types.ObjectId, ref: 'halls', required: true }
},
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    },
    timestamps: { createdAt: 'createdAt' }
  });
//search Index not working yet
schema.index({
  'movie.title': "text"
})
export default model<IScreening>('screenings', schema);