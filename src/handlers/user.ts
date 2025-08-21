import prisma from "../prisma";
import type { Request, Response } from "express";
import { createJWT } from "../modules/auth";
import crypto from 'crypto';

export const createUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // Validate user input
  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      id: crypto.randomUUID(), // Generate a unique ID
      email,
      username,
      password,
      updatedAt: new Date(), // Set the current date/time for updatedAt
    }
  })

  return res.status(201).json(newUser);
}

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email, password } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create JWT
  const token = createJWT(user);

  return res.status(200).json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
}