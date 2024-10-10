import { faker } from "@faker-js/faker";
import express from "express";
import request from "supertest";
import type { UserType } from "../../src/db";
import * as service from "../../src/functions/task.func";
import taskRouter from "../../src/routes/task.route";

const app = express();
app.use(express.json());
app.use("/projects/:projectId/tasks", taskRouter);

jest.mock("../../src/functions/task.func", () => ({
  save: jest.fn(),
  findAll: jest.fn(),
  findDetail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

describe("Task Controller", () => {
  let user: UserType;
  let token: string;

  beforeEach(() => {
    user;
    token;
  });

  describe("POST /projects/:projectId/tasks", () => {
    it("should return an error if task creation fails", async () => {
      const projectId = crypto.randomUUID();
      const taskData = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: "pending",
      };

      (service.save as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to create task");
      });

      const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .set("Authorization", `Bearer ${token}`)
        .send(taskData);

      expect(response.status).toBe(500);
    });
  });

  describe("GET /projects/:projectId/tasks", () => {
    it("should return all tasks for a project", async () => {
      const projectId = crypto.randomUUID();
      const tasks = [
        {
          id: crypto.randomUUID(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: "pending",
        },
        {
          id: crypto.randomUUID(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: "completed",
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(tasks);

      const response = await request(app)
        .get(`/projects/${projectId}/tasks`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(tasks);
    });

    it("should return an error if fetching tasks fails", async () => {
      const projectId = crypto.randomUUID();

      (service.findAll as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to fetch tasks");
      });

      const response = await request(app)
        .get(`/projects/${projectId}/tasks`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });

  describe("GET /projects/:projectId/tasks/:id", () => {
    it("should return a specific task", async () => {
      const projectId = crypto.randomUUID();
      const taskId = crypto.randomUUID();
      const task = {
        id: taskId,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: "pending",
      };

      (service.findDetail as jest.Mock).mockResolvedValue(task);

      const response = await request(app)
        .get(`/projects/${projectId}/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(task);
    });

    it("should return an error if task not found", async () => {
      const projectId = crypto.randomUUID();
      const taskId = crypto.randomUUID();

      (service.findDetail as jest.Mock).mockImplementation(() => {
        throw new Error("Task not found");
      });

      const response = await request(app)
        .get(`/projects/${projectId}/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });

  describe("PUT /projects/:projectId/tasks/:id", () => {
    it("should return an error if updating task fails", async () => {
      const projectId = crypto.randomUUID();
      const taskId = crypto.randomUUID();

      (service.update as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to update task");
      });

      const response = await request(app)
        .put(`/projects/${projectId}/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /projects/:projectId/tasks/:id", () => {
    it("should remove a specific task", async () => {
      const projectId = crypto.randomUUID();
      const taskId = crypto.randomUUID();

      (service.remove as jest.Mock).mockResolvedValue({
        message: "Task deleted",
      });

      const response = await request(app)
        .delete(`/projects/${projectId}/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Task deleted" });
    });

    it("should return an error if removing task fails", async () => {
      const projectId = crypto.randomUUID();
      const taskId = crypto.randomUUID();

      (service.remove as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to remove task");
      });

      const response = await request(app)
        .delete(`/projects/${projectId}/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });
});
