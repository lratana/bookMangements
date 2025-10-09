import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import tutorialRoutes from "./app/routes/tutorial.routes.js";
import bookRoutes from "./app/routes/book.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import librarianRoutes from "./app/routes/librarian.routes.js";
import borrowRoutes from "./app/routes/borrow.routes.js";

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Tutorial Application." });
});

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


// Routes
tutorialRoutes(app);
bookRoutes(app);
userRoutes(app);
librarianRoutes(app);
borrowRoutes(app);

// Sync database
db.sequelize.sync().then(() => {
    console.log("Synced db.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});