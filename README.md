Northcoders News API

Overview

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

To set up, create a local repository using git clone https://github.com/phillee20/NC-News-backend-Project.git

Then create 2 new files on the root directory, as below

.env.test
.env.development

Each file should have the respective content below

PGDATABASE=nc_news_test
PGDATABASE=nc_news

Next, run run npm install and it will install a package and dependencies.
