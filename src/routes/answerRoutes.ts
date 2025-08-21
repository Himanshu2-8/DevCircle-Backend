import { Router } from "express";
import type { Request,Response } from "express";
import prisma from "../prisma";
const answerRouter=Router();

answerRouter.get("/:id/answers",async(req:Request,res:Response)=>{
  const id=req.params.id;
  if(!id){
    return res.status(400).json({ message: "Question id is required" });
  }
  try{
    const answers=await prisma.answer.findMany({
      where:{
        questionId:id,
      },
      include:{
        user:{
          select:{
            id:true,
            username:true,
            email:true
          }
        }
      }
    })
    return res.json(answers);
  }catch(error){
    console.error('Error fetching answers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

answerRouter.post("/question/:id/answer",async(req:Request,res:Response)=>{
  const user=req.user;
  const id=req.params.id;
  const body=req.body.body as string;
  if(!user){
    return res.status(401).json({ message: "Unauthorized" });
  }
  if(!id){
    return res.status(400).json({ message: "Question id is required" });
  }

  try{
    const answer=await prisma.answer.create({
        data:{
            body,
            userId:user.id as string,
            questionId:id
        },
        include:{
            user:{
                select:{
                    id:true,
                    username:true,
                    email:true
                }
            }
        }
    })
    return res.json(answer);
  }catch(error){
    console.error('Error creating answer:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

})

answerRouter.get("/question/:id/answer",async(req:Request,res:Response)=>{
    const id=req.params.id;
    const user=req.user;
    if(!user){
        return res.status(401).json({ message: "Unauthorized" });
    }
    if(!id){
        return res.status(400).json({ message: "Question id is required" });
    }
    try{
        const answers=await prisma.answer.findMany({
            where:{
                questionId:id
            },
            include:{
                user:{
                    select:{
                        id:true,
                        username:true,
                        email:true
                    }
                }
            }
        })
        return res.json(answers);
    }catch(error){
        console.error('Error fetching answer:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default answerRouter;