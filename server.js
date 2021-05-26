

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



     const host = '0.0.0.0';
    const port = process.env.PORT || 5000;
    app.listen( port, host , () => {
        console.log("listening");
    });

    app.get('/api',(req,res) =>
        res.send('Its working'));

    MongoClient.connect();


    async function main(){
        const uri=process.env.MONGODB_URI;
        const client = new MongoClient(uri,{useNewUrlParser: true, 
        useUnifiedTopology: true,
     });

     try{
        await client.connect();

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
     }catch(e){
         console.log(e);
     }

    }

    main().catch(console.error);

        

     
        
      












