Installing OpenNeo
==================

First, get Apache, PHP and MySQL set up. We'll assume you can do that on your
own, but if you need help, Google is your friend.



Install Other Dependencies
--------------------------

Follow the instructions in the links provided in the Readme for help installing
extensions. They are generally self-explanatory.

Tidy support may involve a custom PHP installation, depending on
where you installed from. (The Ubuntu installation came with Tidy support by
default).

PDO support may also require a custom installation, though, again, in Ubuntu it
comes by default.



Database Setup
--------------

Next, create a database for the application to use. The user for this database
needs to be able to create, drop, and modify tables, among other permissions,
so you will have to be fairly liberal in permission assignment.

Next, create a config/database.yml file, using config/database.sample.yml for
reference. This is where Impress will look to find out where your database lives
and how it will connect.

You'll note that database configurations are split among
environments. You will probably want to use the development environment, which
gives more in-depth error messages and the like. If not, you can change the
environment for Apache in the site configuration, or add the PWNAGE_ENV
argument to command-line scripts to change at runtime (since the PHP CLI doesn't
look at your Apache configuration). More on Apache in a minute.

Once ready, run "migrations/main.php db:migrate" to create all the necessary
tables. This process should run automatically. If you need to specify an
environment other than development, add "ENV=production" (or whatever
environment name).



Apache Setup
------------

When setting up the site in Apache, make sure of two things:

1. Set the webroot to the /www/ folder
2. If you want to be in production, add `SetEnv PwnageEnv production`

Load up the site, and you should be good to go! If there's a step missing, by
all means point it out. Thanks!
