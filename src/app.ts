import express from "express";
import connectDB from "./models";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(routes);

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on port ${port}`);
});
