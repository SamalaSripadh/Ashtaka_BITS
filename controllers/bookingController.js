const Booking = require('../models/Booking');
const Event = require('../models/Event');
const QRCode = require('qrcode');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { event, ticketCount, totalAmount } = req.body;

    // Generate booking reference
    const bookingReference = 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Generate QR code data
    const qrData = {
      bookingReference,
      eventId: event,
      userId: req.user._id,
      ticketCount
    };

    // Generate QR code as data URL
    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    const booking = await Booking.create({
      event,
      user: req.user._id,
      ticketCount,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'completed',
      qrCode: qrCodeImage,
      bookingReference
    });

    // Populate event details for response
    await booking.populate('event');

    res.status(201).json({
      success: true,
      data: {
        _id: booking._id,
        event: booking.event,
        ticketCount: booking.ticketCount,
        totalAmount: booking.totalAmount,
        status: booking.status,
        bookingDate: booking.bookingDate,
        qrCodeImage: qrCodeImage,
        bookingReference: bookingReference
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings/me
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event')
      .sort('-bookingDate')
      .select('event ticketCount totalAmount status bookingDate qrCode bookingReference');

    // Transform the response to include QR code image
    const transformedBookings = bookings.map(booking => ({
      _id: booking._id,
      event: booking.event,
      ticketCount: booking.ticketCount,
      totalAmount: booking.totalAmount,
      status: booking.status,
      bookingDate: booking.bookingDate,
      qrCodeImage: booking.qrCode, // The QR code data URL
      bookingReference: booking.bookingReference
    }));

    res.json({
      success: true,
      count: bookings.length,
      data: transformedBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('event')
      .populate('user', 'name email')
      .sort('-bookingDate');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.status = req.body.status;
    booking.paymentStatus = req.body.paymentStatus;
    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update event's available tickets
    const event = await Event.findById(booking.event);
    event.availableTickets += booking.ticketCount;
    await event.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const { qrCode } = req.body;

    // Parse QR code data
    const qrData = JSON.parse(qrCode);
    
    // Find booking by QR code data
    const booking = await Booking.findOne({
      event: qrData.e,
      'checkIn.status': false
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR code or booking not found'
      });
    }

    // Check if already checked in
    if (booking.checkIn.status) {
      return res.status(400).json({
        success: false,
        message: 'Ticket already checked in'
      });
    }

    // Update check-in status
    booking.checkIn.status = true;
    booking.checkIn.time = new Date();
    await booking.save();

    // Populate event details for response
    await booking.populate('event');

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: {
        bookingReference: booking.bookingReference,
        bookerName: booking.bookerName,
        eventName: booking.event.name,
        checkInTime: booking.checkIn.time
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing check-in',
      error: error.message
    });
  }
}; 