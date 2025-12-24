import { Response } from "express";

interface SendResponsePayload {
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: any;
}

export const sendResponse = (res: Response, payload: SendResponsePayload) => {
  res.status(payload.statusCode || 200).json({
    success: payload.success ?? true, 
    message: payload.message,
    ...(payload.data !== undefined && { data: payload.data }),
     })
  }
