

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
const User = require('./User');
const jwt =require('jsonwebtoken');



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


        app.post('/auth', (req,res)=>{
            const {email,password} = req.body;
            User.findOne({email},(err,user)=>{
                if(err){
                    res.status(500).send("Internal error");
                }else if(!user){
                    res.status(401).send("Incorect email");
                }else{
                    user.isCorrectPassword(password,(err,right)=>{
                        if(err){
                            res.status(500).send("Internal error");
                        }else if(!right){
                            console.log(right);
                            res.status(401).send("Incorect email or password");
                        }else {
                            // Issue token
                            const payload = { email };
                            const token = jwt.sign(payload, secret, {
                              expiresIn: '1h'
                            });
                            console.log("tokenLL",token);
                           // res.cookie('token', token, { httpOnly: true }).sendStatus(200);
                           res.json({
                            token: token
                            });
                        }
        
                    })
                }
            })
           
        })



        const chkToken = (req,res,next)=>{
            const token =  req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] 
            console.log("DD",token)
            if(!token){
                res.status(401).send('Unauthorised');
            }else{
                console.log("hre",token)
                jwt.verify(token,secret,(err,success)=>{
                    console.log("error",err);
                    if(err){
                        res.status(401).send('Unauthorised');
                    }else{
                        req.email = success.email;
                        next();
                    }
        
                })
            }
        }
        app.get('/checktoken',chkToken,(req,res)=>{
            res.sendStatus(200);
        })
        
        app.post('/register', (req,res)=>{
            const {email,password} = req.body;
            let user = new User({email,password});
            user.save((err)=>{
                if(err){
                    res.status(500).send("Internal error");
                }
                else{
                    res.status(200).send("Inserted");
                }
            })
        })
        
        app.get('/secret', chkToken, function(req, res) {
            res.send('Welcome to Secret Component from Server');
          });









     }catch(e){
         console.log(e);
     }

    }

    main().catch(console.error);

        

     
        
      












