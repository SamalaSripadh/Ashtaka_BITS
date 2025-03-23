const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  ticketId: {
    type: String,
    index: { 
      unique: true,
      sparse: true,
      background: true
    }
  },
  qrCode: {
    type: String, // Store QR code as data URL
    required: true
  },
  qrCodeImage: String,
  ticketCount: {
    type: Number,
    required: [true, 'Please specify number of tickets'],
    min: [1, 'Must book at least 1 ticket']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  checkIn: {
    status: {
      type: Boolean,
      default: false
    },
    time: Date
  },
  bookingReference: {
    type: String,
    unique: true
  }
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  if (!this.ticketId) {
    this.ticketId = 'TK-' + Math.random().toString(36).substr(2, 9).toUpperCase() + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema); 