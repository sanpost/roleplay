import { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/users/search"; 
import { PrismaClient } from "@prisma/client";

// Mockowanie Prisma Client
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    profile: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe("POST /pages/api/profile/search", () => {
  let prisma: PrismaClient;
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      method: "POST",
      body: {},
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
  });

  it("should return 200 and an empty array if no filters are provided", async () => {
    (prisma.profile.findMany as jest.Mock).mockResolvedValue([]);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.profile.findMany).toHaveBeenCalledWith({
      where: {},
      include: {
        user: true,
        preferences: { include: { preference: true } },
        relationships: { include: { relationship: true } },
        ageRanges: { include: { ageRange: true } },
        contactMethods: { include: { contactMethod: true } },
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should return filtered users when filters are provided", async () => {
    const mockProfiles = [
      {
        id: 1,
        user: { username: "User1" },
        bio: "Bio1",
        age: 25,
        gender: "Male",
        preferences: [{ preference: { name: "Preference1" } }],
        relationships: [{ relationship: { name: "Relationship1" } }],
        ageRanges: [{ ageRange: { name: "AgeRange1" } }],
        contactMethods: [{ contactMethod: { name: "Email" }, contactLink: "user1@example.com" }],
      },
    ];

    (prisma.profile.findMany as jest.Mock).mockResolvedValue(mockProfiles);

    req.body = {
      preferences: [1],
      relationships: [2],
      ageRanges: [3],
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.profile.findMany).toHaveBeenCalledWith({
      where: {
        AND: [
          {
            preferences: {
              some: {
                preference_id: { in: req.body.preferences },
              },
            },
          },
          {
            relationships: {
              some: {
                relationship_id: { in: req.body.relationships },
              },
            },
          },
          {
            ageRanges: {
              some: {
                age_range_id: { in: req.body.ageRanges },
              },
            },
          },
        ],
      },
      include: {
        user: true,
        preferences: { include: { preference: true } },
        relationships: { include: { relationship: true } },
        ageRanges: { include: { ageRange: true } },
        contactMethods: { include: { contactMethod: true } },
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 1,
        user: { username: "User1" },
        bio: "Bio1",
        age: 25,
        gender: "Male",
        preferences: ["Preference1"],
        relationships: ["Relationship1"],
        ageRanges: ["AgeRange1"],
        contact_methods: [{ name: "Email", link: "user1@example.com" }],
      },
    ]);
  });

  it("should return 500 if an error occurs during search", async () => {
    (prisma.profile.findMany as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
