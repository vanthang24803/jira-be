import express from "express";
import request from "supertest";
import * as service from "../../src/functions/project.func";
import projectRouter from "../../src/routes/project.route";
const app = express();
app.use(express.json());
app.use("/projects", projectRouter);
jest.mock("@/functions/project.func");

import { faker } from "@faker-js/faker";
import type { ProjectSchema } from "../../src/validations";

import { generateAccessToken } from "../../src/helpers/jwt.helper";

const token = generateAccessToken({
  email: "example@mail.com",
});

describe("Project Controller", () => {
  beforeEach(() => {});

  describe("POST /projects", () => {
    it("should create a project", async () => {
      const projectData: ProjectSchema = {
        name: faker.internet.displayName(),
        description: faker.lorem.sentence(),
        category: "Category",
        url: faker.internet.domainName(),
      };

      (service.save as jest.Mock).mockResolvedValue(projectData);

      const response = await request(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData);

      expect(response.status).toBe(201);
    });

    it("should return an error if project creation fails", async () => {
      const projectData: ProjectSchema = {
        name: faker.internet.displayName(),
        description: faker.lorem.sentence(),
        category: "Category",
        url: faker.internet.domainName(),
      };

      (service.save as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to create project");
      });

      const response = await request(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData);

      expect(response.status).toBe(500);
    });
  });

  describe("GET /projects", () => {
    it("should return all projects", async () => {
      const projects: Object[] = [];
      (service.findAll as jest.Mock).mockResolvedValue(projects);

      const response = await request(app)
        .get("/projects")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(projects);
    });

    it("should return an error if fetching projects fails", async () => {
      (service.findAll as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to fetch projects");
      });

      const response = await request(app)
        .get("/projects")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });

  describe("GET /projects/:id", () => {
    it("should return a project by id", async () => {
      const project = { id: "1", name: "Project 1" };
      (service.findDetail as jest.Mock).mockResolvedValue(project);

      const response = await request(app)
        .get("/projects/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(project);
    });

    it("should return an error if project not found", async () => {
      (service.findDetail as jest.Mock).mockImplementation(() => {
        throw new Error("Project not found");
      });

      const response = await request(app)
        .get("/projects/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });

  describe("PUT /projects/:id", () => {
    it("should return an error if update fails", async () => {
      const updatedProject = { id: "1", name: "Updated Project" };

      (service.update as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to update project");
      });

      const response = await request(app)
        .put("/projects/1")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedProject);

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should remove a project", async () => {
      (service.remove as jest.Mock).mockResolvedValue({
        message: "Project deleted",
      });

      const response = await request(app)
        .delete("/projects/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Project deleted" });
    });

    it("should return an error if delete fails", async () => {
      (service.remove as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to delete project");
      });

      const response = await request(app)
        .delete("/projects/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });

  describe("GET /projects/:id/report", () => {
    it("should return an error if reporting fails", async () => {
      (service.reportProject as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to report project");
      });

      const response = await request(app)
        .get("/projects/1/report")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });
});
