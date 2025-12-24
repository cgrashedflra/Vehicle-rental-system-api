import { Router, Request, Response } from "express";
import { pool } from "../../config/DB";
import config from "../../config";

const router = Router();

router.post("/booking-status", async (req: Request, res: Response) => {
  if (req.headers["x-secret"] !== config.cron_Secret) {
    return res.sendStatus(401);
  }

  const result = await pool.query(`
    UPDATE bookings
    SET status = 'returned'
    WHERE rent_end_date <= NOW()
    AND status = 'active';
  `);

console.log("Updated rows:", result.rowCount);

  res.sendStatus(200);
});

export default router