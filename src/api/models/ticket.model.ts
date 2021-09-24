//replace PlaceHolderInterface, collection
import { Schema, model } from 'mongoose';
import ITicket from '../interfaces/ticket.interface';
const schema = new Schema<ITicket>({
    userID: { type: Schema.Types.ObjectId, ref: 'users' },
    user: {
        formOfAddress: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        address: {
            street: { type: String },
            postalCode: { type: Number },
            city: { type: String },
            country: { type: String}
        }
    },
    screening: { type: Schema.Types.ObjectId, ref: 'screenings' },
    status: { type: String, enum: ['available', 'selected', 'reserved', 'invalid', 'valid'], default: 'available' },
    seat: { type: Schema.Types.ObjectId, ref: 'seats'}
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
export default model<ITicket>('tickets', schema);