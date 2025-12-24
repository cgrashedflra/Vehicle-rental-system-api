import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on("finish", () => {
    if (process.env.NODE_ENV !== "production") {
      const duration = Date.now() - startTime;

      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`
      );
    }
  });

  next();
};

export default logger;
