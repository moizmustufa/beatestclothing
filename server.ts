import express from "express";
import { configureApp } from "./server/_core/index";

const app = express();
await configureApp(app);

export default app;
