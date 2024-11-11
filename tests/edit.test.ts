import { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/profile/edit"; // Ścieżka do Twojej funkcji API
import { prismaMock } from "../pages/api/profile/singleton"; // Załaduj mocka dla PrismaClient

describe("PUT /api/profile/update-user", () => {
  let req: NextApiRequest;
  let res: NextApiResponse;

  beforeEach(() => {
    // Przygotowanie mocków
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;
  });

  it("should return 400 if email or username is missing", async () => {
    req = {
      method: "PUT",
      body: {
        email: "", // brak adresu e-mail
        username: "", // brak nazwy użytkownika
      },
    } as NextApiRequest;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email and username are required",
    });
  });

  it("should return 400 if bio contains invalid characters", async () => {
    req = {
      method: "PUT",
      body: {
        email: "user@example.com",
        username: "user123",
        bio: "<script>alert('XSS');</script>", // niepoprawna zawartość w biografii
      },
    } as NextApiRequest;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Bio contains invalid characters!",
    });
  });

  it("should return 404 if user is not found", async () => {
    // Mockowanie, że użytkownik nie istnieje
    prismaMock.user.findUnique.mockResolvedValue(null);

    req = {
      method: "PUT",
      body: {
        email: "nonexistent@example.com",
        username: "user123",
      },
    } as NextApiRequest;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should update profile successfully", async () => {
    const mockUser = {
      id: 1,
      email: "user@example.com",
      google_id: "",
      username: "user123",
      created_at: new Date(),
    };
  
    req = {
      method: "PUT",
      body: {
        email: "user@example.com",
        username: "user123",
        bio: "Updated bio", // Wolne od niebezpiecznych znaków
        age: "30",
        gender: "Man",
        preferences: [1, 2],
        age_range: [3, 4],
        relationship: [5],
        contact_methods: [{ id: 1, link: "example" }], // Wolne od niebezpiecznych znaków
      },
    } as NextApiRequest;
  
    // Mock findUnique, aby zwrócić istniejącego użytkownika
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
  
    // Mock update, aby symulować pomyślne zapisanie profilu
    prismaMock.profile.update.mockResolvedValue({
        id: 1,
        bio: "Updated bio",
        age: 30,
        gender: "Man",
        user_id: 0
    });
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Profile updated successfully",
    });
  });

  it("should return 500 if an error occurs during the update", async () => {
    req = {
      method: "PUT",
      body: {
        email: "user@example.com",
        username: "user123",
        bio: "Valid bio",
      },
    } as NextApiRequest;
  
    // Symulacja błędu podczas wyszukiwania użytkownika
    prismaMock.user.findUnique.mockRejectedValue(new Error("Database error"));
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "Database error",
    });
  });
});
