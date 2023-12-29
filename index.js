import express from "express";
import mongoose from "mongoose";
import router from "./routes/userRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();
app.use(express.json({limit: '5mb'}));

app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose
  .connect(
    "mongodb+srv://admin:gr4Dj8bb9ewhOK42@blogapp.o6w53pw.mongodb.net/Blog?retryWrites=true&w=majority"
  )
  .then(() => app.listen(5000))
  .then(() => console.clear())
  .then(() => console.log("Connected to MongoDB on Port 5000!"))
  .catch((err) => console.log(err));
