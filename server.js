

const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const { Server, ReplSet } = require("mongodb");

const cors = require('cors');
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());

const uri=process.env.MONGO_URI;
    const client = new MongoClient(uri,{useNewUrlParser: true, 
        useUnifiedTopology: true,
     });

app.listen( 5000 || process.env.PORT  , () => {
    console.log("listening");
});
app.get('/api',(req,res) =>
        res.send('Its working'));

        // client.connect();

     client.connect(err => {
         app.get("/", (request, response) => {
            const collection = client.db("faqdb").collection("faq");
            collection.find({}).toArray((error, result) => {
                    console.log(result);
                    console.log(error);
                    if(error) {
                        return response.status(500).send(error);
                    }
                    response.send(result);
                });
        });
      });












