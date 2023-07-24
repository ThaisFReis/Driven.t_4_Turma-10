import { prisma } from '@/config';
import { Booking } from '@prisma/client';

type CreateParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateParams = Omit<Booking, 'createdAt' | 'updatedAt'>;

// Create a new booking
async function createBooking({ roomId, userId }: CreateParams) : Promise<Booking> {
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
        include: {
            Room: true,
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
async function updateBookingById({ id, roomId, userId }: UpdateParams) {
    return prisma.booking.upsert({
        where: {
            id,
        },
        create: {
            userId,
            roomId
        },
        update: {
            roomId
        },
    });
}

// Room
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

async function findRoomByUserId(userId: number) {
    return prisma.booking.findMany({
        where: {
            userId,
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
    findRoomById,
    findRoomByUserId
};

export default bookingRepository;
