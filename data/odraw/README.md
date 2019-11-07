In this part, we will see how to get initial data for MongoDB

## How to get initials datas

This project run mongoDB Database. To make it work, you will have to make some little things:

### Initiate the Database

First of all, you will have to prepare mongoDB to be feed with datas. For that, first check if mongoDB fully install and ready to use:
In a new terminal, check:

`mongod --version` and `mongo --version`

If not, visit [MongoDB](https://www.mongodb.com/fr).

If all is fine, at root of project, in terminal, execute `mongod` to run database (if all is good, you should have something like 'waiting for connections on port 27017')

In another terminal, `mongo` (same thing, if it's good, you should have > and be able to send instruction to mongo)
Just verify with `show dbs` to check all your mongoDb database available.

#### Create the database

To do it, you only have to ` use odraw`, to create a new DB and feed it with initials data.

#### Feed the database

In the new terminal, run `show collections` (you should have nothing)
You are ready to feed your database.
Initial datas are in word.csv, others collections doesn't not need to have initial data.
To import word list: 

`mongoimport --db=odraw --collection=word --file=\data\odraw\word.csv`

When runing `show collections` you should now have 'word' in the list.

To make sur you get all you need to start, `db.word.find().pretty()` or `db.word.count()`

MongoDB is ready to work for Odraw!
