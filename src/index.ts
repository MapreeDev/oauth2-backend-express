import express from "express";
import router from "./router";
import { LoadAuthMiddleware } from "./features/auth/Middelware";
import cors from "cors";

export const PORT = (process.env.PORT) ? Number(process.env.PORT) : 3333

const app = express();

app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(LoadAuthMiddleware)

app.use("/api/v1",router)

app.listen(PORT,()=>{
    console.log(`Servidor online em localhost:${PORT}`)
})

export default app;