import express from "express";
import request from "supertest";
import {
  login,
  refreshToken,
  register,
  verifyAccount,
} from "../../src/controllers/auth.controller";
import * as service from "../../src/functions/auth.func";

jest.mock("../../src/functions/auth.func");
jest.mock("../../src/libs", () => ({
  logger: {
    error: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.post("/register", register);
app.post("/login", login);
app.post("/refresh", refreshToken);
app.get("/verify", verifyAccount);

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password",
        firstName: "Test",
        lastName: "User",
      };

      (service.register as jest.Mock).mockResolvedValue({
        code: 201,
        result: "User registered",
      });

      const response = await request(app).post("/register").send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ code: 201, result: "User registered" });
      expect(service.register).toHaveBeenCalledWith(userData);
    });

    it("should return an error if registration fails", async () => {
      const userData = { email: "test@example.com", password: "password" };

      const registerMock = jest
        .spyOn(service, "register")
        .mockImplementation(() => {
          throw new Error("User already exists");
        });

      const response = await request(app).post("/register").send(userData);

      expect(response.status).toBe(500);
      registerMock.mockRestore();
    });
  });

  describe("POST /login", () => {
    it("should log in a user successfully", async () => {
      const loginData = { email: "test@example.com", password: "password" };

      (service.login as jest.Mock).mockResolvedValue({
        code: 200,
        result: "Login successful",
      });

      const response = await request(app).post("/login").send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ code: 200, result: "Login successful" });
      expect(service.login).toHaveBeenCalledWith(loginData);
    });

    it("should return an error if login fails", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongPassword",
      };

      (service.login as jest.Mock).mockRejectedValue(
        new Error("Invalid credentials"),
      );

      const response = await request(app).post("/login").send(loginData);

      expect(response.status).toBe(500);
      expect(service.login).toHaveBeenCalledWith(loginData);
    });
  });

  describe("POST /refresh", () => {
    it("should refresh the token successfully", async () => {
      const tokenData = { token: "oldToken" };

      (service.refreshToken as jest.Mock).mockResolvedValue({
        code: 200,
        result: "Token refreshed",
      });

      const response = await request(app).post("/refresh").send(tokenData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ code: 200, result: "Token refreshed" });
      expect(service.refreshToken).toHaveBeenCalledWith(tokenData);
    });

    it("should return an error if token refresh fails", async () => {
      const tokenData = { token: "invalidToken" };

      (service.refreshToken as jest.Mock).mockRejectedValue(
        new Error("Token not found"),
      );

      const response = await request(app).post("/refresh").send(tokenData);

      expect(response.status).toBe(500);
      expect(service.refreshToken).toHaveBeenCalledWith(tokenData);
    });
  });

  describe("GET /verify", () => {
    it("should verify the account successfully", async () => {
      const token = "validToken";

      (service.verifyEmail as jest.Mock).mockResolvedValue({
        code: 200,
        result: "Account verified",
      });

      const response = await request(app).get(`/verify?token=${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ code: 200, result: "Account verified" });
      expect(service.verifyEmail).toHaveBeenCalledWith(token);
    });

    it("should return an error if verification fails", async () => {
      const token = "invalidToken";

      (service.verifyEmail as jest.Mock).mockRejectedValue(
        new Error("Invalid token"),
      );

      const response = await request(app).get(`/verify?token=${token}`);

      expect(response.status).toBe(500);
      expect(service.verifyEmail).toHaveBeenCalledWith(token);
    });
  });
});
