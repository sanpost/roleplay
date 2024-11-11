import { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/profile/delete-user"; // Zmien ścieżkę na rzeczywistą lokalizację pliku
import { PrismaClient } from "@prisma/client";

// Mockowanie Prisma Client
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    userPreference: {
      deleteMany: jest.fn(),
    },
    userAgeRange: {
      deleteMany: jest.fn(),
    },
    userRelationship: {
      deleteMany: jest.fn(),
    },
    userContactMethod: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

type User = {
  id: number;
  email: string;
};

describe("DELETE /pages/api/profile/delete-user", () => {
  let prisma: PrismaClient;
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      method: "DELETE", // Dodajemy metodę DELETE
      body: {},
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
  });

  it("should return 400 if email is not provided", async () => {
    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email is required" });
  });

  it("should return 404 if user is not found", async () => {
    req.body = { email: "nonexistent@example.com" };

    // Symulujemy brak użytkownika
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should delete the user and related data successfully", async () => {
    const mockUser: User = { id: 1, email: "user@example.com" };
    const mockProfile = { id: 1, user_id: 1 };

    req.body = { email: "user@example.com" };

    // Symulowanie, że użytkownik istnieje
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.profile.findUnique as jest.Mock).mockResolvedValue(mockProfile);

    // Mocks dla metody transaction
    (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
      await callback(prisma);
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.profile.delete).toHaveBeenCalledWith({
      where: { user_id: 1 },
    });
    expect(prisma.userPreference.deleteMany).toHaveBeenCalledWith({
      where: { profile_id: 1 },
    });
    expect(prisma.userAgeRange.deleteMany).toHaveBeenCalledWith({
      where: { profile_id: 1 },
    });
    expect(prisma.userRelationship.deleteMany).toHaveBeenCalledWith({
      where: { profile_id: 1 },
    });
    expect(prisma.userContactMethod.deleteMany).toHaveBeenCalledWith({
      where: { profile_id: 1 },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User deleted successfully",
    });
  });

  it("should return 500 if an error occurs during deletion", async () => {
    req.body = { email: "user@example.com" };

    // Symulowanie błędu
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "Database error",
    });
  });
});
