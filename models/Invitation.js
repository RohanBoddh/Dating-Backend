const mongoose = require('mongoose');
const crypto = require('crypto');

const invitationSchema = new mongoose.Schema(
  {
    invitationId: {
      type: String,
      unique: true,
      index: true,
      default: () => 'DATE-' + crypto.randomBytes(4).toString('hex').toUpperCase()
    },
    senderName: {
      type: String,
      trim: true,
      default: 'My Love ❤️',
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    senderEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    restaurantId: {
      type: String,
      required: [true, 'Restaurant ID is required'],
      trim: true
    },
    restaurantName: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: function (value) {
          if (!value) return false;
          // Set to start of the day in local comparison
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(value) >= today;
        },
        message: 'Selected date cannot be in the past'
      }
    },
    timePreference: {
      type: String,
      trim: true,
      default: 'Evening Dinner',
      maxlength: [100, 'Time preference cannot exceed 100 characters']
    },
    specialRequest: {
      type: String,
      trim: true,
      maxlength: [500, 'Special request message cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    emailErrorMessage: {
      type: String,
      default: ''
    },
    notificationAttempts: {
      type: Number,
      default: 0
    },
    notificationSentAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    autoIndex: false,
    bufferCommands: false
  }
);

module.exports = mongoose.model('Invitation', invitationSchema);
