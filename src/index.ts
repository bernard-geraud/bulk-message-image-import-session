import "reflect-metadata";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

const httpServer = createServer(app);

const PORT = process.env.PORT || 3400;
httpServer.listen({ port: PORT }, () => {
    console.log(`httpServer ready at http://localhost:${PORT}`);
});