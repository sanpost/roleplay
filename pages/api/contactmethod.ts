import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const contactMethods = await prisma.contactMethod.findMany();
      return res.status(200).json(contactMethods.map(method => method.name));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching age ranges' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
