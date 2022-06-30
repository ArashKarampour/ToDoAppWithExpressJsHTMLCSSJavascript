const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const { Task } = require("../models/task");
const { User } = require("../models/user");
const config = require("config");

module.exports = function (){
  //sending email every day to users who have got tasks to do on that day
    cron.schedule("0 0 * * *", async () => {
        let todaysDate = new Date().toISOString().substring(0,10);
        todaysDate = new Date(todaysDate);
        const userTosendEmail = {};
        //console.log("test cron");
        try {
            const tasks = await Task.find();
            //console.log(todaysDate);
            tasks.forEach(task => {
                //console.log(task.dueDate,todaysDate);
                if((task.dueDate.toISOString() == todaysDate.toISOString()) && (task.done == false)){
                    //console.log("ok");
                    if(userTosendEmail[task.userId])
                        userTosendEmail[task.userId] += 1;
                    else
                        userTosendEmail[task.userId] = 1;
                }
            });
            //console.log(userTosendEmail);
            const userEmails = [];
            for(let key in userTosendEmail){
               const userEmail =  await User.findById(key).select("email");
               userEmails.push(userEmail);
            }

            //console.log(emails);
            userEmails.forEach(userEmail => {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                      user: "todo.web.app.mine@gmail.com",
                      pass: config.get("gmailpass") //finaly using app password after activating 2 step verfication on this google account
                    }
                });
                
                console.log(userEmail);
                const mailOptions = {
                    /*from: `from test accout: ${testAccount.user}`,*/
                    from: `todo.web.app.mine@gmail.com`,
                    to: userEmail.email,
                    subject: "You have got Tasks to Do from TodoApp",
                    html: `
                      <h2>You have got ${userTosendEmail[userEmail._id]} Tasks to Do Today</h2>
                      <a style="color:red;border-radius:5px" href=${config.get(
                        "UrlBase"
                      )}:${config.get("Port")}/>Check Your Panel</a>`
                };
              
                transporter.sendMail(mailOptions,function(error,info){
                  if(error){
                    console.log("Couldn't send email! with error: ", error);
                  }else{
                    console.log("Message sent: %s", info.response);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
                    // Preview only available when sending through an Ethereal account
                    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                  }
                });
    
            });

        } catch (e) {
            console.error("couldn't send email for tasks reminding with error", e);
        }
    });
}
