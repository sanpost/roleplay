import { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/users/random-user"; // Ścieżka do pliku random-user.ts
import { PrismaClient } from "@prisma/client";

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    profile: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Mock fetch
global.fetch = jest.fn();

describe("POST /pages/api/profile/random-user", () => {
  let prisma: PrismaClient;
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      method: "POST",
      headers: {
        cookie: "test-cookie",
      },
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if method is not POST", async () => {
    req.method = "GET";

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["POST"]);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith("Method GET Not Allowed");
  });

  it("should return 404 if no profiles are found", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ profile_id: 1 }),
    });
    (prisma.profile.findMany as jest.Mock).mockResolvedValue([]);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No profiles found" });
  });

  it("should return a random user profile successfully", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ profile_id: 1 }),
    });

    const mockProfiles = [
      {
        id: 2,
        user: { username: "RandomUser" },
        bio: "Random bio",
        age: 30,
        gender: "Male",
        preferences: [{ preference: { name: "Music" } }],
        relationships: [{ relationship: { name: "Friendship" } }],
        ageRanges: [{ ageRange: { name: "20-30" } }],
        contactMethods: [{ contactMethod: { name: "Email" }, contactLink: "random@example.com" }],
      },
    ];

    (prisma.profile.findMany as jest.Mock).mockResolvedValue(mockProfiles);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.profile.findMany).toHaveBeenCalledWith({
      where: { id: { not: 1 } },
      include: {
        user: true,
        preferences: { include: { preference: true } },
        relationships: { include: { relationship: true } },
        ageRanges: { include: { ageRange: true } },
        contactMethods: { include: { contactMethod: true } },
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 2,
      user: { username: "RandomUser" },
      bio: "Random bio",
      age: 30,
      gender: "Male",
      preferences: ["Music"],
      relationships: ["Friendship"],
      ageRanges: ["20-30"],
      contact_methods: [{ name: "Email", link: "random@example.com" }],
    });
  });

  it("should return 500 if an error occurs during profile retrieval", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ profile_id: 1 }),
    });

    (prisma.profile.findMany as jest.Mock).mockRejectedValue(
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
