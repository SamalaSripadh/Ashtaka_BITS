const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
    maxlength: [100, 'Event title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  eventType: {
    type: String,
    required: [true, 'Please specify event type'],
    enum: ['tech', 'business', 'workshop', 'conference', 'seminar']
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide event time']
  },
  location: {
    type: String,
    required: [true, 'Please provide event location']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide event capacity']
  },
  ticketPrice: {
    type: Number,
    required: [true, 'Please provide ticket price']
  },
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  availableTickets: {
    type: Number
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set availableTickets equal to capacity before saving
eventSchema.pre('save', function(next) {
  if (!this.availableTickets) {
    this.availableTickets = this.capacity;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema); 