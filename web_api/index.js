import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import bodyparser from 'body-parser'
import mongoose from 'mongoose';
import JobQuery from './models/JobQuery.js'
import cors from 'cors'
import Loans from './models/Loans.js'
import RealEstate from './models/RealEstate.js'
import CreditCard from './models/CreditCard.js'
import OtherInsurance from './models/OtherInsurances.js'
import SavingsInvestments from './models/SavingsInvestments.js'
import VechicleInsurance from './models/VehicleInsurance.js'
import JobQueryRoute from './routes/JobQuery.js';
import RealEstateRoute from './routes/RealEstate.js';
import CreditCardRoute from './routes/CreditCard.js';
import OtherInsuranceRoute from './routes/OtherInsurance.js';
import SavingsInvestmentsRoute from './routes/SavingsInvestments.js';
import LoanRoute from './routes/Loans.js';
import VechicleInsuranceRoute from './routes/VehicleInsurance.js';
import bodyParser from 'body-parser';
import AdminRoute from './routes/Admin.js';
import { authenticateAndAuthorize } from './utils/Validation.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json())
const port = process.env.PORT || 5000;
app.use(cors({ origin: '*' }));

try {
    const DB_URL = process.env.DB_URL || `mongodb+srv://taylorbuzz20:SB1p2oEbBAHeYBq4@lead.spukiba.mongodb.net/?retryWrites=true&w=majority `;
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
}


app.use(bodyParser.json())
app.use(morgan('combined'));
app.use(cors())
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get('/dashboard', async (req, res) => {
    try {
        const jobQueryData = await JobQuery.find();
        const loansData = await Loans.find();
        const creditCardData = await CreditCard.find();
        const realEstateData = await RealEstate.find();
        const savingsInvestmentsData = await SavingsInvestments.find();
        const otherInsurancesData = await OtherInsurance.find();
        const vehicleInsurancesData = await VechicleInsurance.find();

        // Calculate total number of leads for each service
        const leadsCount = {
            jobs: jobQueryData.length,
            loans: loansData.length,
            creditCards: creditCardData.length,
            realEstate: realEstateData.length,
            savingsInvestments: savingsInvestmentsData.length,
            otherInsurances: otherInsurancesData.length,
            vehicleInsurances: vehicleInsurancesData.length,
        };

        const totalServices = Object.keys(leadsCount).length; // Calculate the total number of services
const leadsPercentage = {};

for (const key in leadsCount) {
    if (leadsCount[key] !== 0) {
        leadsPercentage[key] = ((leadsCount[key] / totalServices) * 100).toFixed(2); // Calculate percentage based on total services
    } else {
        leadsPercentage[key] = 0; // Set percentage to 0 for services with no leads
    }
}



        const categorizedData = {
            jobs: jobQueryData,
            loans: loansData,
            creditCards: creditCardData,
            realEstate: realEstateData,
            savings: savingsInvestmentsData,
            others: otherInsurancesData,
            vehicle: vehicleInsurancesData,
        };

        res.status(200).send({ data: categorizedData, leadsCount, leadsPercentage, page: 'dashboard' });
    } catch (error) {
        console.error('Error fetching data for dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.use("/auth",AdminRoute)
app.use("/others", JobQueryRoute);
app.use("/services", RealEstateRoute);
app.use("/services", CreditCardRoute);
app.use("/services", LoanRoute);
app.use("/services", SavingsInvestmentsRoute);
app.use("/services", OtherInsuranceRoute);
app.use("/services", VechicleInsuranceRoute);

app.listen(port, () => {
    console.log(`The Server is on ${port}`);
});
