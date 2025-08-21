import { Router } from 'express';
import type { Request, Response } from "express";
import prisma from '../prisma';

const userRouter = Router();

userRouter.get("/user/:id/answers", async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const answers = await prisma.answer.findMany({
      where: {
        userId: userId
      },
      include: {
        question: true
      }
    });
    return res.json(answers);
  } catch (error) {
    console.error('Error fetching user answers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default userRouter;