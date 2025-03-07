// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Create a new PrismaClient instance
export default prisma; // Default export the Prisma client
