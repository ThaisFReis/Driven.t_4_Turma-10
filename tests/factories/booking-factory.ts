import { Booking, Room, Ticket, TicketType, TicketStatus, Enrollment, Address, User } from '@prisma/client';
import { prisma } from '@/config';

// Type definitions
type BookingFactoryParams = {
    userId: number;
    roomId: number;
};

// Create a booking
export async function createBooking({ userId, roomId }: BookingFactoryParams) {
    return prisma.booking.create({
        data: {
            userId,
            roomId,
        },
    });
}

// Get a booking
export async function getBooking() {
    const expected: Booking & { Room: Room } = {
        id: 1,
        userId: 1,
        roomId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Room: {
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    };

    return expected;
}

// Get a booking with a different user
export async function getBookingWithDifferentUser() {
    const expected: Booking & { Room: Room } = {
        id: 1,
        userId: 2,
        roomId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Room: {
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    };
};

// Get an enrollment with adress
export async function getEnrollmentWithAddress() {
    const expected: Enrollment & { Address: Address[] } = {
        id: 1,
        userId: 1,
        name: 'Teste Test',
        cpf: '58764322597',
        phone: '687569123',
        birthday: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        Address: [
            {
                id: 1,
                enrollmentId: 1,
                cep: '56987532',
                street: 'Rua Teste',
                number: '123',
                addressDetail: 'Casa 01',
                city: 'Teste',
                state: 'Teste',
                neighborhood: 'Teste',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
    };

    return expected;
}

// Get an room by id
export async function getRoomById() {
    const expected: Room = {
        id: 1,
        hotelId: 1,
        name: 'Room 1',
        capacity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return expected;
}

// Get a booking by room id
export async function getBookingByRoomId() {
    const expected: (Booking & { Room: Room })[] = [{
        id: 1,
        userId: 1,
        roomId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Room: {
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    }];

    return expected;
}

// Get a booking by room id if no capacity
export async function getBookingByRoomIdIfNoCapacity() {
    const expected: Room = {
        id: 1,
        hotelId: 1,
        name: 'Room 1',
        capacity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return expected;
}

// Get a booking by room id if capacity
export async function getBookingByRoomIdIfCapacity() {
    const expected: Room = {
        id: 1,
        hotelId: 1,
        name: 'Room 1',
        capacity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return expected;
}

// Get a booking by room id if no room
export async function getBookingByRoomIdIfNoRoom() {
    const expected: Room = null;

    return expected;
}