//replace IScreening, collection
import { Schema, model, CallbackError } from 'mongoose';
import IScreening from '../interfaces/screening.interface';
import Movie from './movie.model';
import Ticket from './ticket.model';
const schema = new Schema<IScreening>({
  movie: { type: Schema.Types.ObjectId, ref: 'movies', required: true },
  startDate: { type: Date, required: true },
  hall:  {
    number: { type: Number, required: true },
    rows: {type: Number, required: true},
    seatsPerRow: {type: Number, required: true}
  } 
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

  schema.virtual('hall.capacity').get(function (this: IScreening) {
    return this.hall.rows * this.hall.seatsPerRow;
  });

//search Index not working yet
schema.index({
  'movie.title': "text"
})
export default model<IScreening>('screenings', schema);