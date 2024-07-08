# Techstack used 
1.NodeJS<br/>
2.ExpressJS<br/>
3.Redis<br/>
4.Mongoose<br/>
5.MongoDB<br/>

# Setting up the project
1.clone the project in your local repository by using command " git clone <project|_url> "<br/>
2.create a .env file as shown in ".env-example" file and put in the base url of server running<br/>
<br/>
MONGODB_URL=<mongodb_database_url><br/>
REDIS_URL=<redis_database_url><br/>
NODE_ENV="development"<br/>
<br/>
NOTE : It's recommended to run the project in development mode , that way you can see all the server logs<br/>
<br/>
JWT_ACCESS_SECRET=<access_token_secret><br/>
JWT_REFRESH_SECRET=<refresh_token_secret><br/>
JWT_REFRESH_EXPIRY_DAYS=<refresh_token_expriry_time_in_days><br/>

TEST_EMAIL=<your_email_id><br/>
TEST_EMAIL_PASSWORD=<app_password><br/>
TEST_EMAIL_SERVICE="Gmail"<br/>
TEST_EMAIL_HOST='smtp.gmail.com'<br/>
<br/>
We are using nodemailer to send email for various tasks like sending password reset pin , confirmation mails ,etc . So, we will need to setup our gmail account for that<br/>
Follow this article (at the bottom part "Setting up your Gmail account" section) for setting up above email enviormental variables "https://dev.to/viktoriabors/setting-up-nodemailer-with-gmail-after-2022-may-55af"
<br/>

ADMIN_NAME=<your_admin_name><br/>
ADMIN_EMAIL=<admin_email><br/>
ADMIN_PASSWORD=<admin_password><br/>
<br/>
NOTE : If you do not setup this part , there will be a default admin account created with email-"admin@admin.com" and password-"admin" .So, you can still check out the project.
<br/>

PASSWORD_RESETPIN_EXPIRY_DAYS=<password_reset_pin_expiry_time_in_days><br/>
<br/>
3.install all the necessary dependencies by running command " npm install "<br/>
4.Now run the server application by running the command "npm run dev" .The server should be running on default port 8000<br/>
  But , if you want to run it in different port , you can add another enviormental variable in .env file as " PORT=<your_port_number>"
