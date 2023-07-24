import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findMany({
    where: {
      id: hotelId,
    },
  });
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function findAllRoomsInHotel(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomById,
  findHotelById,
  findAllRoomsInHotel,
};

export default hotelRepository;
