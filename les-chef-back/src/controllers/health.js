const { checkConnection } = require("../config/dbConnect");
const mongoose = require("mongoose");

/**
 * 헬스체크 - 서버 및 DB 연결 상태 확인
 */
const healthCheck = async (req, res) => {
    try {
        const dbStatus = checkConnection();
        
        // 간단한 DB 쿼리 테스트
        let dbQueryTest = false;
        try {
            await mongoose.connection.db.admin().ping();
            dbQueryTest = true;
        } catch (err) {
            dbQueryTest = false;
        }

        const health = {
            status: dbStatus.isConnected && dbQueryTest ? "healthy" : "unhealthy",
            timestamp: new Date().toISOString(),
            database: {
                connected: dbStatus.isConnected,
                state: dbStatus.status,
                queryTest: dbQueryTest,
                host: mongoose.connection.host || "N/A",
                name: mongoose.connection.name || "N/A"
            },
            server: {
                uptime: process.uptime(),
                memory: {
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB"
                }
            }
        };

        const statusCode = health.status === "healthy" ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (error) {
        res.status(503).json({
            status: "unhealthy",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { healthCheck };

