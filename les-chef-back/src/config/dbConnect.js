const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try{
        const connect = await mongoose.connect(process.env.DB_CONNECT,{
      		ssl: true, // SSL 사용
      	});
        
        // 연결 성공 정보 출력
        console.log("✅ MongoDB 연결 성공!");
        console.log(`   - 호스트: ${connect.connection.host}`);
        console.log(`   - 데이터베이스: ${connect.connection.name}`);
        console.log(`   - 상태: ${connect.connection.readyState === 1 ? '연결됨' : '연결 안됨'}`);
        
        // 연결 이벤트 리스너
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB 연결됨');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB 연결 오류:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB 연결 끊김');
        });
        
        // 프로세스 종료 시 연결 종료
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB 연결이 종료되었습니다.');
            process.exit(0);
        });
        
        return connect;
    }catch(err){
        console.error("❌ MongoDB 연결 실패:");
        console.error("   - 오류:", err.message);
        if (err.message.includes('authentication')) {
            console.error("   - 인증 실패: 사용자 이름 또는 비밀번호를 확인하세요.");
        }
        if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
            console.error("   - 호스트를 찾을 수 없습니다: 연결 문자열을 확인하세요.");
        }
        throw err;
    }
}

// 연결 상태 확인 함수
const checkConnection = () => {
    const state = mongoose.connection.readyState;
    const states = {
        0: '연결 안됨',
        1: '연결됨',
        2: '연결 중',
        3: '연결 해제 중'
    };
    return {
        state: state,
        status: states[state] || '알 수 없음',
        isConnected: state === 1
    };
}

module.exports = { dbConnect, checkConnection };
