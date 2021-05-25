

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
    
    
    const uri=process.env.MONGODB_URI;
 

    
    const client = new MongoClient(uri,{useNewUrlParser: true, 
        useUnifiedTopology: true,
     });

    


    
    // client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        
        // perform actions on the collection object
        

        app.get("/", (request, response) => {
            const collection = client.db("faqdb").collection("faq");
            collection.find({}).toArray((error, result) => {
                    console.log(result);
                    console.log(error);
                    response.send("HI");
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

app.listen( process.env.PORT, () => {
    console.log("listening");
});










