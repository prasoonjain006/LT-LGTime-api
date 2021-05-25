

const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const { Server, ReplSet } = require("mongodb");
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));



// const {MongoClient} = require('mongodb');
async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    
    const uri=process.env.MONGODB_URI;
 

    
    var client = new MongoClient(uri,{useNewUrlParser: true, 
        useUnifiedTopology: true,
        useNewUrlParser:true,
     });

    app.listen(5000 || process.env.PORT, () => {
        console.log("listing");
    });


    
    // client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("faqdb").collection("faq");
        // perform actions on the collection object
        

        app.get("/", (request, response) => {
            collection.find({}).toArray((error, result) => {
                    console.log(result);
                    console.log(error);
                    if(error) {
                        return response.status(500).send(error);
                    }
                    response.send(result);
                });
        });

        app.get('/api',(req,res) =>
        res.send('Its working'));


        
      });
 
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    myCursor = client.db("faqdb");
    
}
;










