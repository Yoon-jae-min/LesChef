import { Request, Response } from 'express';
import { checkConnection } from '../../config/dbConnect';
import mongoose from 'mongoose';

/**
 * 헬스체크 - 서버 및 DB 연결 상태 확인
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
    try {
        const dbStatus = checkConnection();

        // 간단한 DB 쿼리 테스트
        let dbQueryTest = false;
        try {
            const db = mongoose.connection.db;
            if (db) {
                await db.admin().ping();
                dbQueryTest = true;
            }
        } catch (err) {
            dbQueryTest = false;
        }

        const health = {
            status: dbStatus.isConnected && dbQueryTest ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            database: {
                connected: dbStatus.isConnected,
                state: dbStatus.status,
                queryTest: dbQueryTest,
                host: mongoose.connection.host || 'N/A',
                name: mongoose.connection.name || 'N/A',
            },
            server: {
                uptime: process.uptime(),
                memory: {
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
                },
            },
        };

        const statusCode = health.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (error) {
        const err = error as Error;
        res.status(503).json({
            status: 'unhealthy',
            error: err.message,
            timestamp: new Date().toISOString(),
        });
    }
};
