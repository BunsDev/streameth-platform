import { SheetType, StateStatus, StateType } from '@interfaces/state.interface';
import { Schema, model } from 'mongoose';

const StateSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    eventSlug: { type: String, default: '' },
    sheetType: { type: String, enum: Object.keys(SheetType) },
    status: {
      type: String,
      default: StateStatus.pending,
      enum: Object.keys(StateStatus),
    },
    type: { type: String, enum: Object.keys(StateType) },
  },
  {
    timestamps: true,
  },
);

const State = model('State', StateSchema);
export default State;
