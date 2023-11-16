const Event = require("../models/event");
const getEventParams=(body)=>{
  return{
    title:body.title,
    description:body.description,
    location:body.location,
    startDate:body.startDate,
    endDate:body.endDate,
    isOnline:body.isOnline,
    registrationLink:body.registrationLink,
    organizer:body.organizer,
    attendees:body.attendees
  };
};
module.exports={
  // Show all events
  index:(req,res,next)=>{
    Event.find()
      .then((events)=>{
        res.locals.events=events;
        next();
      })
      .catch((error)=>{
        console.log(`Error fetching events: ${error.message}`);
        next(error);
      });
  },
  // Render events
  indexView:(req,res)=>{
    res.render("events/index");
  },
  // Render event creation page
  new:(req,res)=>{
    res.render("events/new");
  },
  // Create an event
  create:(req,res,next)=>{
    if(req.skip)next();
    let newEvent=new Event(getEventParams(req.body));
    newEvent.save().then((newEvent)=>{
      if(newEvent){
        req.flash(
          "success",
          `${newEvent.title} created successfully!`
        );
        res.locals.redirect="/events";
        next();
      }else{
        req.flash(
          "error",
          `Failed to create event because:${error.message}.`
        );
        res.locals.redirect="/events/new";
        next();
      }
    });
  },
  // Redirect the view
  redirectView:(req,res,next)=>{
    let redirectPath=res.locals.redirect;
    if(redirectPath)res.redirect(redirectPath);
    else next();
  },
  // Display a specific event
  show:(req,res,next)=>{
    let eventId=req.params.id;
    Event.findById(eventId)
      .then((event)=>{
        res.locals.event=event;
        next();
      })
      .catch((error)=>{
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  // Render a specific event
  showView:(req,res)=>{
    res.render("events/show");
  },
  // Render the edit page for a specific event
  edit:(req,res,next)=>{
    let eventId=req.params.id;
    Event.findById(eventId)
      .then((event)=>{
        res.render("events/edit",{
          event:event,
        });
      })
      .catch((error)=>{
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  // Edit a specific event
  update:(req,res,next)=>{
    let eventId=req.params.id,
      eventParams=getEventParams(req.body);
    Event.findByIdAndUpdate(eventId,{
      $set: eventParams,
    })
      .then((event)=>{
        res.locals.redirect = `/events/${eventId}`;
        res.locals.event=event;
        next();
      })
      .catch((error)=>{
        console.log(`Error updating event by ID: ${error.message}`);
        next(error);
      });
  },
  // Delete a specific event
  delete:(req,res,next)=>{
    let eventId=req.params.id;
    Event.findOneAndDelete(eventId)
      .then(()=>{
        res.locals.redirect="/events";
        next();
      })
      .catch((error)=>{
        console.log(`Error deleting event by ID: ${error.message}`);
        next();
      });
  }
};