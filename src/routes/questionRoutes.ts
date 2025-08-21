import { Router } from "express";
import type { Request,Response } from "express";
import prisma from "../prisma";
const questionRouter = Router();

questionRouter.get("/questions", async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const questions = await prisma.question.findMany({
      where: {
        userId: user.id as string
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    return res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

questionRouter.post("/question",async(req:Request,res:Response)=>{
  const user=req.user;
  if(!user){
    return res.status(401).json({ message: "Unauthorized" });
  }
  const title=req.body.title as string;
  const body=req.body.body as string;
  const category=req.body.category as string;

  try{
    const question=await prisma.question.create({
      data:{
        title,
        body,
        category,
        userId:user.id as string
      }
    })
    return res.status(201).json(question);
  }catch(error){
    console.error('Error creating question:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

questionRouter.get("/question/:id",async(req:Request,res:Response)=>{
  const id=req.params.id;
  const user=req.user;
  if(!id){
    return res.status(400).json({ message: "Question id is required" });
  }

  if(!user){
    return res.status(401).json({ message: "Unauthorized" });
  }
  try{
    const question=await prisma.question.findUnique({
      where:{
        id:id
      },
      include:{
        user:true,
      }
    })
    return res.json(question);
  }catch(error){
    console.error('Error fetching question:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

export default questionRouter;