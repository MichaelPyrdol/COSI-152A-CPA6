const Job = require("../models/job");
const getJobParams=(body)=>{
  return{
    title:body.title,
    company:body.company,
    location:body.location,
    description:body.description,
    requirements:body.requirements,
    salary:body.salary,
    contactEmail:body.contactEmail,
    contactPhone:body.contactPhone,
    postDate:body.postDate,
    deadlineDate:body.deadlineDate,
    isActive:body.isActive
  };
};
module.exports={
  // Show all jobs
  index: (req,res,next)=>{
    Job.find()
      .then((jobs)=>{
        res.locals.jobs=jobs;
        next();
      })
      .catch((error)=>{
        console.log(`Error fetching jobs: ${error.message}`);
        next(error);
      });
  },
  // Render jobs
  indexView:(req,res)=>{
    res.render("jobs/index");
  },
  // Render job creation page
  new:(req,res)=>{
    res.render("jobs/new");
  },
  // Create a job
  create:(req,res,next)=>{
    if(req.skip)next();
    let newJob=new Job(getJobParams(req.body));
    newJob.save().then((newJob)=>{
      if(newJob){
        req.flash(
          "success",
          `${newJob.title} created successfully!`
        );
        res.locals.redirect = "/jobs";
        next();
      }else{
        req.flash(
          "error",
          `Failed to create job because:${error.message}.`
        );
        res.locals.redirect = "/jobs/new";
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
  // Display a specific job
  show:(req,res,next)=>{
    let jobId=req.params.id;
    Job.findById(jobId)
      .then((job)=>{
        res.locals.job=job;
        next();
      })
      .catch((error)=>{
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },
  // Render a speicifc job
  showView:(req,res)=>{
    res.render("jobs/show");
  },
  // Render the edit page for a specific job
  edit:(req,res,next)=>{
    let jobId=req.params.id;
    Job.findById(jobId)
      .then((job)=>{
        res.render("jobs/edit",{
          job:job,
        });
      })
      .catch((error)=>{
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },
  // Edit a specific job
  update:(req,res,next)=>{
    let jobId=req.params.id,
      jobParams=getJobParams(req.body);
    Job.findByIdAndUpdate(jobId, {
      $set: jobParams,
    })
      .then((job)=>{
        res.locals.redirect = `/jobs/${jobId}`;
        res.locals.job=job;
        next();
      })
      .catch((error)=>{
        console.log(`Error updating job by ID: ${error.message}`);
        next(error);
      });
  },
  // Delete a specific job
  delete:(req,res,next)=>{
    let jobId=req.params.id;
    Job.findOneAndDelete(jobId)
      .then(()=>{
        res.locals.redirect="/jobs";
        next();
      })
      .catch((error)=>{
        console.log(`Error deleting job by ID: ${error.message}`);
        next();
      });
  }
};