const User = require("../models/user");
const getUserParams=(body)=>{
  return{
    name:body.name,
    email:body.email,
    password:body.password,
    role:body.role,
    graduationYear:body.graduationYear,
    major:body.major,
    job:body.job,
    company:body.company,
    city:body.city,
    state:body.state,
    country:body.country,
    zipCode:body.zipCode,
    bio:body.bio,
    interests:body.interests
  };
};
module.exports={
  // Show all users
  index:(req,res,next)=>{
    User.find()
      .then((users)=>{
        res.locals.users = users;
        next();
      })
      .catch((error)=>{
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  // Render users
  indexView:(req,res)=>{
    res.render("users/index");
  },
  // Render user creation page
  new:(req,res)=>{
    res.render("users/new");
  },
  // Create a user
  create:(req,res,next)=>{
    if(req.skip)next();
    let newUser = new User(getUserParams(req.body));
    newUser.save().then((newUser)=>{
      if(newUser){
        req.flash(
          "success",
          `${newUser.name}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        next();
      }else{
        req.flash(
          "error",
          `Failed to create user account because:${error.message}.`
        );
        res.locals.redirect="/users/new";
        next();
      }
    });
  },
  // Redirect the view
  redirectView:(req,res,next)=>{
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // Display a specific user
  show:(req,res,next)=>{
    let userId = req.params.id;
    User.findById(userId)
      .then((user)=>{
        res.locals.user=user;
        next();
      })
      .catch((error)=>{
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  // Render a specific user
  showView:(req,res)=>{
    res.render("users/show");
  },
  // Render the edit page for a specific user
  edit: (req,res,next)=>{
    let userId = req.params.id;
    User.findById(userId)
      .then((user)=>{
        res.render("users/edit",{
          user: user,
        });
      })
      .catch((error)=>{
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  // Edit a specific user
  update:(req,res,next)=>{
    let userId = req.params.id,
      userParams = getUserParams(req.body);
    User.findByIdAndUpdate(userId,{
      $set: userParams,
    })
      .then((user)=>{
        res.locals.redirect=`/users/${userId}`;
        res.locals.user=user;
        next();
      })
      .catch((error)=>{
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  // Delete a specific user
  delete:(req,res,next)=>{
    let userId=req.params.id;
    User.findOneAndDelete(userId)
      .then(()=>{
        res.locals.redirect="/users";
        next();
      })
      .catch((error)=>{
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  }
};