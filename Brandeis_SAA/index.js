const express=require("express");
const homeController=require("./controller/homeController")
const errorController=require('./controller/errorController');
const layouts=require("express-ejs-layouts")
const app = express();
app.set("view engine","ejs");
app.use(layouts);
app.use(express.static("public"));
app.set("port",process.env.PORT||8080);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.get("/",homeController.showIndex);
app.get("/about",homeController.showAbout);
app.get("/contact",homeController.showContact);
app.get("/event",homeController.showEvent);
app.get("/jobs",homeController.showJobs);
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);
app.listen(app.get("port"),()=>{
    console.log(`Server running at http://localhost:${app.get("port")}`);
});