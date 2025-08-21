import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { createUser, signin } from "./handlers/user";
import { protect } from "./modules/auth";
import questionRouter from "./routes/questionRoutes";
import answerRouter from "./routes/answerRoutes";
import votingRouter from "./routes/votingRoutes";
import userRouter from "./routes/userRoute";
import prisma from "./prisma";
import type { Request, Response } from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "exists ✅" : "missing ❌");

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.get("/public/questions", async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        user: true,
      },
    });
    return res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/signup", createUser);
app.post("/signin", signin);

app.use("/", protect, questionRouter);
app.use("/", protect, answerRouter);
app.use("/", protect, userRouter);
app.use("/", protect, votingRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
