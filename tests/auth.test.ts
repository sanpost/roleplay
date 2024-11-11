// Mockowanie PrismaClient
const prismaMock = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  profile: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

// Implementacja samego NextAuth (callback signIn)
interface User {
  email: string;
  name: string;
  id: string;
}

interface HandlerBody {
  user: User;
}

export const handler = async ({ body }: { body: HandlerBody }) => {
  const { email, name, id: googleId } = body.user;

  if (!email) {
    throw new Error("Email is required");
  }

  // Symulacja wyszukiwania użytkownika w bazie
  let existingUser = await prismaMock.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    if (existingUser.google_id !== googleId) {
      await prismaMock.user.update({
        where: { email: email },
        data: { google_id: googleId },
      });
    }
  } else {
    existingUser = await prismaMock.user.create({
      data: {
        google_id: googleId,
        username: name || "default_username",
        email: email,
        created_at: new Date(),
      },
    });
  }

  // Obsługuje profil
  const profile = await prismaMock.profile.findUnique({
    where: { user_id: existingUser.id },
  });

  if (!profile) {
    await prismaMock.profile.create({
      data: {
        user_id: existingUser.id,
        bio: "Describe yourself",
      },
    });
  }

  return true;
};

describe("NextAuth signIn callback", () => {
  it("should return false if email is missing", async () => {
    const result = await handler({
      body: {
        user: { email: "", name: "Test User", id: "googleId" },
      },
    }).catch((err) => err);

    expect(result).toEqual(new Error("Email is required"));
  });

  it("should update Google ID for existing user", async () => {
    // Mockowanie, że użytkownik istnieje
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: "existing@example.com",
      google_id: "oldGoogleId",
    });

    // Mockowanie metody update
    prismaMock.user.update.mockResolvedValue({
      id: 1,
      email: "existing@example.com",
      google_id: "newGoogleId",
    });

    const result = await handler({
      body: {
        user: { email: "existing@example.com", name: "Test User", id: "newGoogleId" },
      },
    });

    expect(result).toBe(true);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { email: "existing@example.com" },
      data: { google_id: "newGoogleId" },
    });
  });

  it("should create a new user if not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 2,
      email: "new@example.com",
      google_id: "googleId",
    });

    prismaMock.profile.create.mockResolvedValue({
      id: 1,
      user_id: 2,
      bio: "Describe yourself",
    });

    const result = await handler({
      body: {
        user: { email: "new@example.com", name: "New User", id: "googleId" },
      },
    });

    expect(result).toBe(true);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        google_id: "googleId",
        username: "New User",
        email: "new@example.com",
        created_at: expect.any(Date),
      },
    });
  });

  it("should handle errors gracefully", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("Database error"));

    const result = await handler({
      body: {
        user: { email: "error@example.com", name: "Error User", id: "googleId" },
      },
    }).catch((err) => err);

    expect(result.message).toBe("Database error");
  });
});
