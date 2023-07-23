import { prisma } from '@/config';

// Create a new booking
async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

// Find all bookings
async function findBookings() {
    return prisma.booking.findMany();
}

// Find a booking by user id
async function findBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: {
        userId,
        },
    });
}

// Find a booking by room id
async function findBookingByRoomId(roomId: number) {
    return prisma.booking.findFirst({
        where: {
        roomId,
        },
    });
}

// Update a booking by id
async function updateBookingById(id: number, roomId: number, userId: number) {
    return prisma.booking.update({
        where: {
        id,
        },
        data: {
        userId,
        roomId,
        },
    });
}

// Find room by id
async function findRoomById(id: number) {
    return prisma.booking.findMany({
        where: {
        id,
        },
        include: {
            Room: true,
        },
    });
}

const bookingRepository = {
    createBooking,
    findBookings,
    findBookingByUserId,
    findBookingByRoomId,
    updateBookingById,
    findRoomById
};

export default bookingRepository;