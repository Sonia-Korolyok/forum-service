import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGO_URI || 'mongodb://sonia:1234/localhost:27017/java61?authSource=admin',
        db: {
            dbName: process.env.DB_NAME || 'java61'
        }
    }

}
export default config;