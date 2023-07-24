import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import {
    createBooking,
    createEnrollmentWithAddress,
    createHotel,
    createPayment,
    createRoomWithHotelId,
    createTicket,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createUser,
} from '../factories';

beforeAll(async () => {
    await init();
})

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when user has not a booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const enrollment = await createEnrollmentWithAddress(user);

            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);


            it('should respond with status 200 when user has a booking', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const enrollment = await createEnrollmentWithAddress(user);

                const ticketType = await createTicketTypeRemote();
                const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
                const payment = await createPayment(ticket.id, ticketType.price);

                const hotel = await createHotel();
                const room = await createRoomWithHotelId(hotel.id);

                const booking = await createBooking({ userId: user.id, roomId: room.id });

                const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(httpStatus.OK);
                expect(response.body).toEqual({
                    id: booking.id,
                    Room: {
                        id: expect.any(Number),
                        hotelId: expect.any(Number),
                        name: expect.any(String),
                        capacity: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }
                });
            });
        });
    });
});

describe('POST /booking', () => {
    function validBody() {
        return {
            roomId: 1,
        };
    }

    describe('when token is valid', () => {
        it('should respond with status 401 if no token is given', async () => {
            const response = await server.post('/booking');

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it('should respond with status 401 if given token is not valid', async () => {
            const token = faker.lorem.word();

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it('should respond with status 401 if there is no session for given token', async () => {
            const userWithoutSession = await createUser();
            const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        describe('when token is valid', () => {
            it('should respond with status 400 with a invalid body', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const enrollment = await createEnrollmentWithAddress(user);

                const ticketType = await createTicketTypeRemote();
                const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
                const payment = await createPayment(ticket.id, ticketType.price);

                const hotel = await createHotel();
                const room = await createRoomWithHotelId(hotel.id);

                const body = validBody();

                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 0 });

                expect(response.status).toBe(httpStatus.BAD_REQUEST);
            });

            it('should respond with status 403 when room is already full', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const enrollment = await createEnrollmentWithAddress(user);

                const ticketType = await createTicketTypeRemote();
                const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
                const payment = await createPayment(ticket.id, ticketType.price);

                const hotel = await createHotel();
                const room = await createRoomWithHotelId(hotel.id);

                await createBooking({ userId: user.id, roomId: room.id });

                await createBooking({ userId: user.id, roomId: room.id });

                await createBooking({ userId: user.id, roomId: room.id });

                await createBooking({ userId: user.id, roomId: room.id });

                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

                expect(response.status).toBe(httpStatus.FORBIDDEN);

            });

            it('should respond with status 404 when isnt a room with given id', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const enrollment = await createEnrollmentWithAddress(user);

                const ticketType = await createTicketTypeRemote();
                const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
                const payment = await createPayment(ticket.id, ticketType.price);

                const hotel = await createHotel();
                const room = await createRoomWithHotelId(hotel.id);

                const body = validBody();

                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id + 3 });

                expect(response.status).toBe(httpStatus.NOT_FOUND);
            });

            it('should respond with status 403 if no ticket is paid', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const enrollment = await createEnrollmentWithAddress(user);

                const ticketType = await createTicketTypeRemote();
                const ticket = await createTicket(user.id, ticketType.id, TicketStatus.RESERVED);
                const payment = await createPayment(ticket.id, ticketType.price);

                const hotel = await createHotel();
                const room = await createRoomWithHotelId(hotel.id);

                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

                expect(response.status).toBe(httpStatus.FORBIDDEN);
            });

            it('should respond with status 403 if no enrollment', async () => {
                const user = await createUser();
                const token = await generateValidToken(user);

                const ticketType = await createTicketTypeRemote();
                const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
                const payment = await createPayment(ticket.id, ticketType.price);

                const hotel = await createHotel();
                const room = await createRoomWithHotelId(hotel.id);

                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

                expect(response.status).toBe(httpStatus.FORBIDDEN);
            });
        });
    });
});

// Update
describe('PUT /booking', () => {
    function validBody() {
        return {
            roomId: 1,
        };
    }

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/booking/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 400 with an invalid booking id', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking({ userId: user.id, roomId: room.id });

            const otherRoom = await createRoomWithHotelId(hotel.id);

            const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send({ roomId: otherRoom.id });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);

        });

        it('should respond with status 400 with an invalid body', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking({ userId: user.id, roomId: room.id });

            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: 0 });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 403 when room is already full', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const enrollment = await createEnrollmentWithAddress(user);

            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const booking = await createBooking({ userId: user.id, roomId: room.id });

            await createBooking({ userId: user.id, roomId: room.id });

            await createBooking({ userId: user.id, roomId: room.id });

            await createBooking({ userId: user.id, roomId: room.id });

            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

            expect(response.status).toBe(httpStatus.FORBIDDEN);

        });

        it('should respond with status 404 when isnt a room with given id', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const enrollment = await createEnrollmentWithAddress(user);

            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(user.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const booking = await createBooking({ userId: user.id, roomId: room.id });

            const body = validBody();

            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: room.id + 3 });

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
    });
});