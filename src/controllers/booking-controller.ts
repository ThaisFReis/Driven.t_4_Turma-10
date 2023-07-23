import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import { number } from 'joi';

// Create a new booking
export const createBooking = async (req: AuthenticatedRequest, res: Response,  next: NextFunction) => {
    const { userId } = req;
    const { roomId } = req.body as Record<string, number>; // Because if we don't do this, we will have a any type

    try {
        const booking = await bookingService.createBooking(userId, roomId);

        res.status(httpStatus.CREATED).send(booking.id);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }

        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
};

// Get all bookings
export const getBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        const bookings = await bookingService.findBookings();

        res.status(httpStatus.OK).send(bookings);
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
};

// Get a booking by user id
export const getBookingByUserId = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req;

    try {
        const booking = await bookingService.findBookingByUserId(userId);

        if (!booking) {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }

        res.status(httpStatus.OK).send(booking);
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

// Update a booking by id
export const updateBookingById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req;
    const { roomId } = req.body as Record<string, number>;

    if (!roomId) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    try{
        const booking = await bookingService.updateBookingById(userId, roomId);

        res.status(httpStatus.OK).send(booking);
    }

    catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}