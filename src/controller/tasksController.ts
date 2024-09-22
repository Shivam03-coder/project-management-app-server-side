import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AsyncHandler } from "../middleware/Asynhandler";
import { Apiresponse } from "../utils/Apiresponse";
import { ApiError } from "../utils/Apierror";

const prisma = new PrismaClient();

export const getTasksController = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.query;
    // VALIDATING PROJECT ID
    if (!projectId) {
      throw new ApiError(400, "Project id not found");
    }
    try {
      const Tasks = await prisma.task.findMany({
        where: {
          projectId: Number(projectId),
        },
        include: {
          comments: true,
          attachments: true,
          project: true,
          author: true,
        },
      });
      res.json(new Apiresponse(200, { data: Tasks }));
    } catch (error) {
      console.log("Error:", error);
      throw new ApiError(500, "An error occurred while getting Task");
    }
  }
);

export const createTasksController = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorUserId,
      assignedUserId,
    } = req.body;

    // CHECK REQUIRED FEILDS

    if (!title || !projectId || !authorUserId) {
      throw new ApiError(
        400,
        "Fields 'title' ,'projectId'  and 'authorUserId' cannot be blank"
      );
    }

    try {
      const newTasks = await prisma.task.create({
        data: {
          title,
          description,
          status,
          priority,
          tags,
          startDate,
          dueDate,
          points,
          projectId,
          authorUserId,
          assignedUserId,
        },
      });
      res.json(new Apiresponse(201, { data: newTasks }, "New Task created"));
    } catch (error) {
      console.log("🚀 ~ error:", error)
      throw new ApiError(500, "An error occurred while creating the Task");
    }
  }
);
