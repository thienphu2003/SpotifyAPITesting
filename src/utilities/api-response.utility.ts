import { Response } from 'express';
import httpStatusCodes from 'http-status-codes';

// Interfaces
import { IPagination } from '../interfaces/common.interface';

export default class ApiResponse {
    static onSuccess = (
        res: Response,
        data: object,
        status: number = 200,
        pagination: IPagination = null,
    ) => {
        res.status(status);
        let responseData: any = { data, success: true };

        if (pagination) {
            responseData = { ...responseData, pagination };
        }

        res.json(responseData);
    };

    static error = (
        res: Response,
        status: number = 400,
        error: string = httpStatusCodes.getStatusText(status),
    ) => {
        res.status(status).json({
            error: {
                message: error,
            },
            success: false,
        });
    };
}
