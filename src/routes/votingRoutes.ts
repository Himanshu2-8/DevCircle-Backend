import { Router } from "express";
import type { Request, Response } from "express";
import prisma from "../prisma";
const votingRouter = Router();

votingRouter.put("/questions/:id/upvote", async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!questionId) {
      return res.status(400).json({ message: "Question id is required" });
    }

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        questionId,
        userId: String(userId)
      }
    });

    if (!existingVote) {
      const vote = await prisma.vote.create({
        data: {
          value: 1,
          questionId,
          userId: String(userId)
        }
      });
      return res.status(200).json(vote);
    }

    if (existingVote.value === 1) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
      return res.status(200).json({ message: "Vote removed" });
    }

    const updatedVote = await prisma.vote.update({
      where: { id: existingVote.id },
      data: { value: 1 }
    });
    return res.status(200).json(updatedVote);
  } catch (error) {
    console.error('Error handling upvote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

votingRouter.put("/questions/:id/downvote", async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!questionId) {
      return res.status(400).json({ message: "Question id is required" });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        questionId,
        userId: String(userId)
      }
    });

    if (!existingVote) {
      const vote = await prisma.vote.create({
        data: {
          value: -1,
          questionId,
          userId: String(userId)
        }
      });
      return res.status(200).json(vote);
    }

    if (existingVote.value === -1) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
      return res.status(200).json({ message: "Vote removed" });
    }

    // If existing vote is upvote, change to downvote
    const updatedVote = await prisma.vote.update({
      where: { id: existingVote.id },
      data: { value: -1 }
    });
    return res.status(200).json(updatedVote);
  } catch (error) {
    console.error('Error handling downvote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

votingRouter.put("/answers/:id/upvote", async (req: Request, res: Response) => {
  try {
    const answerId = req.params.id;
    const userId = req.user?.id as string;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!answerId) {
      return res.status(400).json({ message: "Answer id is required" });
    }

    const answer = await prisma.answer.findUnique({
      where: { id: answerId }
    });

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        answerId,
        userId
      }
    });

    if (!existingVote) {
      const vote = await prisma.vote.create({
        data: {
          value: 1,
          answerId,
          userId
        }
      });
      return res.status(200).json(vote);
    }

    if (existingVote.value === 1) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
      return res.status(200).json({ message: "Vote removed" });
    }

    const updatedVote = await prisma.vote.update({
      where: { id: existingVote.id },
      data: { value: 1 }
    });
    return res.status(200).json(updatedVote);
  } catch (error) {
    console.error('Error handling answer upvote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

votingRouter.put("/answers/:id/downvote", async (req: Request, res: Response) => {
  try {
    const answerId = req.params.id;
    const userId = req.user?.id as string;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!answerId) {
      return res.status(400).json({ message: "Answer id is required" });
    }

    const answer = await prisma.answer.findUnique({
      where: { id: answerId }
    });

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        answerId,
        userId
      }
    });

    if (!existingVote) {
      const vote = await prisma.vote.create({
        data: {
          value: -1,
          answerId,
          userId
        }
      });
      return res.status(200).json(vote);
    }

    if (existingVote.value === -1) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
      return res.status(200).json({ message: "Vote removed" });
    }

    const updatedVote = await prisma.vote.update({
      where: { id: existingVote.id },
      data: { value: -1 }
    });
    return res.status(200).json(updatedVote);
  } catch (error) {
    console.error('Error handling answer downvote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

export default votingRouter;