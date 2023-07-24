import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

// Create a new booking
export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req;
    const { roomId } = req.body as Record<string, number>; // Because if we don't do this, we will have a any type

    try {
        const booking = await bookingService.createBooking(userId, roomId);

        res.status(httpStatus.OK).send({
            bookingId: booking.id
        });
    } catch (error) {
        next(error);
    }
}

// Get a booking by user id
export const getBookingById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req;
    const bookingId = await bookingService.findBookingByUserId(userId);

    if (!bookingId) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }

    try {
        const booking = await bookingService.findBookingByUserId(userId);

        if (!booking) {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }

        res.status(httpStatus.OK).send({
            bookingId: booking.id,
            Room: booking.Room
        });
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

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
    const bookingId = Number(req.params.bookingId);

    if (!bookingId) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    try {
        const booking = await bookingService.updateBookingById(userId, roomId);

        res.status(httpStatus.OK).send({
            bookingId: booking.id
        });
    }

    catch (error) {
        next(error);
    }
}