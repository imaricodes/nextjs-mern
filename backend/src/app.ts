import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";

const app = express();

//morgan is a middleware that logs requests to the console
app.use(morgan("dev"));

//express.json() is a middleware that parses the request body to a json object
//the reason we need this middleware is because the request body is sent as a string
app.use(express.json());

app.use("/api/notes", notesRoutes);

app.use((req, res, next)=>{
  //if a route is called that does not exist, this middleware will be called
  //the next function is called with an error object
  //the next function will then call the error handler middleware
  //next calls the next middleware in line
    next(createHttpError(404,"Endpoint Not found"));
})

//Error handler middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "Unknown error occured";
  //status code 500 means internal server error that prevents the request from being fulfilled, it is a generic catch all error

  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
