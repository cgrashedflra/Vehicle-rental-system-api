import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: "customer" | "admin";
      };
    }
  }
}

export {};