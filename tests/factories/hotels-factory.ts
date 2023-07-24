import faker from '@faker-js/faker';
import { prisma } from '@/config';
import {
  Hotel,
  Room,
  User,
  Ticket,
  TicketType,
  TicketStatus,
  Enrollment,
  Address,
} from '@prisma/client';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}

// Adicionados por mim
// Get hotels
export async function getHotels() {
  const expected: Hotel[] = [{
    id: 1,
    name: 'Hotel 1',
    image: 'image',
    createdAt: new Date(),
    updatedAt: new Date(),
  }];

  return expected;
}

// Get Rooms
export async function getRooms() {
  const expected: Hotel & { Room: Room[] } = {
    id: 1,
    name: 'Hotel 1',
    image: 'image',
    createdAt: new Date(),
    updatedAt: new Date(),
    Room: [{
      id: 1,
      name: 'Room 3',
      capacity: 3,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  };

  return expected;
}

// Get a ticket failed
export async function getTicketFailed() {
  const expected: Ticket & { TicketType: TicketType } = {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status: TicketStatus.RESERVED,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: 1,
      name: 'Ticket 1',
      price: 100,
      isRemote: true,
      includesHotel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  return expected;
}