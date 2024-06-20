import express from 'express'

import manualRoutes from './routes/manualRoutes'
import cors from "cors"

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/v1/manualDeploy",manualRoutes);
// app.use("/api/v1/git-deploy");


export default app;