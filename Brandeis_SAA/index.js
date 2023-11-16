const mongoose = require("mongoose");
const express=require("express");
const homeController=require("./controller/homeController")
const errorController=require("./controller/errorController");
const usersController=require("./controller/usersController");
const eventsController=require("./controller/eventsController");
const jobsController=require("./controller/jobsController");
const layouts=require("express-ejs-layouts")
const methodOverride = require("method-override");
const connectFlash = require("connect-flash");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");

const router = express.Router();

mongoose.connect("mongodb://localhost:27017/the_kitchen");
const db=mongoose.connection;
db.once("open",()=>{
  console.log("Connected to the database!");
});

const app=express();
app.set("view engine","ejs");
app.use(layouts);
app.use(express.static("public"));
app.set("port",process.env.PORT||8080);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
router.use(
    methodOverride("_method",{
        methods: ["POST","GET"],
    })
);
router.use(connectFlash());
router.use(
    expressSession({
        secret:"secret_passcode",
        cookie:{maxAge:4000000},
        resave:false,
        saveUninitialized:false,
    })
);
router.use(cookieParser("secret_passcode"));
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use("/",router);

router.get("/",homeController.showIndex);
router.get("/about",homeController.showAbout);
router.get("/contact",homeController.showContact);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
);
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);

router.get("/events", eventsController.index, eventsController.indexView);
router.get("/events/new", eventsController.new);
router.post(
  "/events/create",
  eventsController.create,
  eventsController.redirectView
);
router.get("/events/:id", eventsController.show, eventsController.showView);
router.get("/events/:id/edit", eventsController.edit);
router.put(
  "/events/:id/update",
  eventsController.update,
  eventsController.redirectView
);
router.delete(
  "/events/:id/delete",
  eventsController.delete,
  eventsController.redirectView
);

router.get("/jobs", jobsController.index, jobsController.indexView);
router.get("/jobs/new", jobsController.new);
router.post(
  "/jobs/create",
  jobsController.create,
  jobsController.redirectView
);
router.get("/jobs/:id",jobsController.show,jobsController.showView);
router.get("/jobs/:id/edit",jobsController.edit);
router.put(
  "/jobs/:id/update",
  jobsController.update,
  jobsController.redirectView
);
router.delete(
  "/jobs/:id/delete",
  jobsController.delete,
  jobsController.redirectView
);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.listen(app.get("port"),()=>{
    console.log(`Server running at http://localhost:${app.get("port")}`);
});