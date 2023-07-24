import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelRepository from '@/repositories/hotel-repository';
import { cannotBookError, badRequestError, notFoundError } from '@/errors';

// Check booking
async function checkBooking(roomId: number, userId: number) {
    // Check if the user is enrolled
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    // If the user is not enrolled, throw an error
    if (!enrollment) {
        throw cannotBookError();
    }

    // Check if the user has a ticket
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    // If the user does not have a ticket, throw an error
    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw cannotBookError();
    }
}

// Check if the room is available
async function checkRoom(roomId: number) {

    // Check if the room exists
    const room = await hotelRepository.findRoomById(roomId);

    // If the room does not exist, throw an error
    if (!room) {
        throw notFoundError();
    }

    // Check if the room is available
    const bookings = await bookingRepository.findRoomById(roomId);

    // If the room is not available, throw an error
    if (room.capacity <= bookings.length) {
        throw cannotBookError();
    }
}

// Create a new booking
async function createBooking(roomId: number, userId: number) {
    // Check if the room id is valid, if not throw a bad request error
    if (!roomId) {
        throw badRequestError();
    }

    // Check if the booking is possible
    await checkBooking(roomId, userId);

    // Check if the room is available
    await checkRoom(roomId);

    // Create the booking
    return bookingRepository.createBooking({ roomId, userId });
}

// Find a booking by user id
async function findBookingByUserId(userId: number) {
    // Check if the booking exists
    const booking = await bookingRepository.findBookingByUserId(userId);

    // If the booking does not exist, throw an error
    if (!booking) {
        throw notFoundError();
    }

    return booking;
}


// Update a booking
async function updateBookingById(roomId: number, userId: number) {
    // Check if the room id is valid, if not throw a bad request error
    if (!roomId) {
        throw badRequestError();
    }

    // Check if the booking is possible
    await checkRoom(roomId);

    // Check if the booking exists
    const booking = await bookingRepository.findBookingByUserId(userId);

    // If the booking does not exist, throw an error
    if (!booking || booking.userId !== userId) {
        throw cannotBookError();
    }

    // Update the booking
    return bookingRepository.updateBookingById({ id: booking.id, roomId, userId });

}

const bookingService = {
    createBooking,
    findBookingByUserId,
    updateBookingById
};

export default bookingService;