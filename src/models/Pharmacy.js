import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    source: {
      type: String,
      enum: ['pharmacies', 'nearest_pharmacies'],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

pharmacySchema.index({ city: 1 });
pharmacySchema.index({ name: 1, city: 1 });

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

export default Pharmacy;
