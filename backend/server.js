/**
 * BloodLink AI Server Entry Point
 * Initializes database connection and starts Express server
 */

const app = require('./src/app');
const { testConnection, initDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // Test database connection first
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.error('❌ Cannot start server without database');
        process.exit(1);
    }
    
    // Initialize database tables if they don't exist
    await initDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
        console.log('═══════════════════════════════════════');
        console.log('🩸  BloodLink AI Backend Server');
        console.log('═══════════════════════════════════════');
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 API: http://localhost:${PORT}`);
        console.log(`🗺️  Google Maps API: Enabled`);
        console.log('═══════════════════════════════════════');
    });
};

startServer();