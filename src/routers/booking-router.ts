import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBooking, getBookingByUserId, updateBookingById, getBookingById } from '@/controllers';

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('', getBookingByUserId)
    .get('/:userId', getBookingByUserId)
    .post('', createBooking)
    .put('/:bookingId', updateBookingById);

export { bookingRouter };