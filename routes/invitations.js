const express = require('express');
const router = express.Router();
const Invitation = require('../models/Invitation');
const restaurants = require('../config/restaurantsData');
const { sendDateConfirmationEmail } = require('../services/emailService');
const connectDB = require('../config/db');

/**
 * Helper to sanitize user string
 */
function sanitizeString(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

/**
 * @route   POST /api/invitations
 * @desc    Create a new romantic date invitation
 * @access  Public
 */
router.post('/', async (req, res, next) => {
  try {
    await connectDB();
    const { restaurantId, date, timePreference, specialRequest } = req.body;

    // 1. Validate required fields
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a restaurant for our date! 💕'
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please pick a lovely date on the calendar! 📅'
      });
    }

    // 2. Validate restaurant / food vibe existence
    const matchedRestaurant = restaurants.find(r => r.id === restaurantId);
    const chosenName = matchedRestaurant ? matchedRestaurant.name : (req.body.restaurantName || restaurantId);
    const finalId = matchedRestaurant ? matchedRestaurant.id : restaurantId;

    // 3. Validate date (must be today or future date)
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format provided.'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(parsedDate);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Our date must be in the future, silly! ⏳ Please pick today or an upcoming day.'
      });
    }

    // 4. Sanitize optional fields
    const cleanSenderName = sanitizeString(req.body.senderName || 'My Love ❤️', 100);
    const cleanSenderEmail = sanitizeString(req.body.senderEmail || '', 120).toLowerCase();
    const cleanTime = sanitizeString(timePreference || 'Evening Dinner', 100);
    const cleanSpecial = sanitizeString(specialRequest || '', 500);

    // 5. Save invitation to MongoDB
    const newInvitation = new Invitation({
      senderName: cleanSenderName,
      senderEmail: cleanSenderEmail,
      restaurantId: finalId,
      restaurantName: chosenName,
      date: parsedDate,
      timePreference: cleanTime,
      specialRequest: cleanSpecial,
      status: 'confirmed',
      emailStatus: 'pending',
      notificationAttempts: 0
    });

    const savedInvitation = await newInvitation.save();

    // 6. Attempt to send confirmation email
    let emailResult = { success: false };
    try {
      emailResult = await sendDateConfirmationEmail(savedInvitation);
      savedInvitation.notificationAttempts += 1;

      if (emailResult.success) {
        savedInvitation.emailStatus = 'sent';
        savedInvitation.notificationSentAt = new Date();
      } else {
        savedInvitation.emailStatus = 'failed';
        savedInvitation.emailErrorMessage = emailResult.error || emailResult.message || 'Unknown email failure';
      }
      await savedInvitation.save();
    } catch (emailErr) {
      console.error('⚠️ [Invitations Route] Email error caught:', emailErr.message);
      savedInvitation.notificationAttempts += 1;
      savedInvitation.emailStatus = 'failed';
      savedInvitation.emailErrorMessage = emailErr.message;
      await savedInvitation.save();
    }

    // 7. Return success response (invitation is preserved regardless of email outcome)
    return res.status(201).json({
      success: true,
      message: 'Date invitation successfully confirmed! 💖',
      data: {
        id: savedInvitation.invitationId,
        senderName: savedInvitation.senderName,
        senderEmail: savedInvitation.senderEmail,
        restaurantName: savedInvitation.restaurantName,
        restaurantId: savedInvitation.restaurantId,
        date: savedInvitation.date,
        timePreference: savedInvitation.timePreference,
        specialRequest: savedInvitation.specialRequest,
        status: savedInvitation.status,
        emailStatus: savedInvitation.emailStatus,
        createdAt: savedInvitation.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/invitations/:id
 * @desc    Get details of confirmed invitation for success page
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;

    // Search by custom invitationId (e.g. DATE-XXXXXX) or mongo _id
    let invitation;
    if (id.startsWith('DATE-')) {
      invitation = await Invitation.findOne({ invitationId: id });
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      invitation = await Invitation.findById(id);
    } else {
      invitation = await Invitation.findOne({ invitationId: id });
    }

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Romantic invitation not found.'
      });
    }

    // Return safe presentation payload
    return res.json({
      success: true,
      data: {
        id: invitation.invitationId,
        senderName: invitation.senderName || 'My Love ❤️',
        senderEmail: invitation.senderEmail || '',
        restaurantName: invitation.restaurantName,
        restaurantId: invitation.restaurantId,
        date: invitation.date,
        timePreference: invitation.timePreference,
        specialRequest: invitation.specialRequest,
        status: invitation.status,
        emailStatus: invitation.emailStatus,
        createdAt: invitation.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/invitations/:id/retry-notification
 * @desc    Safely retry a failed email notification without duplicating invitations
 * @access  Public (Rate limited)
 */
router.post('/:id/retry-notification', async (req, res, next) => {
  try {
    const { id } = req.params;

    const invitation = await Invitation.findOne({
      $or: [{ invitationId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])]
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found.'
      });
    }

    if (invitation.emailStatus === 'sent') {
      return res.json({
        success: true,
        message: 'Email notification has already been sent successfully! 💌',
        emailStatus: 'sent'
      });
    }

    // Protection against spamming email retry
    if (invitation.notificationAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Maximum notification retry attempts reached. Your date is already safely stored in database!'
      });
    }

    const emailResult = await sendDateConfirmationEmail(invitation);
    invitation.notificationAttempts += 1;

    if (emailResult.success) {
      invitation.emailStatus = 'sent';
      invitation.notificationSentAt = new Date();
      invitation.emailErrorMessage = '';
    } else {
      invitation.emailStatus = 'failed';
      invitation.emailErrorMessage = emailResult.error || emailResult.message;
    }

    await invitation.save();

    return res.json({
      success: emailResult.success,
      message: emailResult.success ? 'Notification email sent!' : 'Retry attempted, but email could not be sent.',
      emailStatus: invitation.emailStatus,
      attempts: invitation.notificationAttempts
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
