import app from './app';
import { connectDB } from './utils/db';

// Connect to database and start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});