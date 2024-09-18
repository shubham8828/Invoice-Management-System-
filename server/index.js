import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import cors from 'cors'

import userRoutes from './routes/User.js';
import InvoiceRoutes from './routes/InvoicRoutes.js';
 
dotenv.config();
const app = express();

app.use(cors(
    {
        origin: ["https://deploy-mern-frontend-dun.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));
app.use(express.json());

mongoose.connect(process.env.URL)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
}); 

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.json({ limit: "50mb" })); // Adjust the size limit (e.g., 10mb)
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/api', userRoutes );  
app.use('/invoice',InvoiceRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
   

