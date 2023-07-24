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
  Payment,
} from '@prisma/client';
import { CardPaymentParams } from '@/protocols';

export async function createPayment(ticketId: number, value: number) {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer: faker.name.findName(),
      cardLastDigits: faker.datatype.number({ min: 1000, max: 9999 }).toString(),
    },
  });
}

export function generateCreditCardData() {
  const futureDate = faker.date.future();

  return {
    issuer: faker.name.findName(),
    number: faker.datatype.number({ min: 100000000000000, max: 999999999999999 }).toString(),
    name: faker.name.findName(),
    expirationDate: `${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`,
    cvv: faker.datatype.number({ min: 100, max: 999 }).toString(),
  };
}

// Adicionados por mim
// Get ticket with payment
export async function getTicket() {
  const expected: Ticket & {Enrollment: Enrollment } = {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status: TicketStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date(),
    Enrollment: {
      id: 1,
      userId: 1,
      name: 'Teste',
      cpf: '56987533214',
      birthday: new Date(),
      phone: '5678945358',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  return expected;
}

// Get ticket with type with id
export async function getTicketTypeWithId() {
  const expected: Ticket & { TicketType: TicketType } = {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status: TicketStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: 1,
      name: 'Teste',
      price: 100,
      isRemote: false,
      includesHotel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  return expected;
}

// Get payment with ticket
export async function getPayment() {
  const expected: Payment = {
    id: 1,
    ticketId: 1,
    value: 100,
    cardIssuer: '545454888484848',
    cardLastDigits: '545',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return expected;
}

// Get enrollment
export async function getEnrollment() {
  const expected: Enrollment = {
    id: 1,
    userId: 1,
    name: 'Teste',
    cpf: '56987533214',
    birthday: new Date(),
    phone: '5678945358',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return expected;
}

// Get payment params
export async function getPaymentParams() {
  const expected: CardPaymentParams = {
    issuer: '5555555555555555',
    number: 555,
    name: 'Teste',
    expirationDate: new Date(),
    cvv: 555
  };

  return expected;
}