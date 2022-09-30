const express = require('express');
const app = express();
const port = 3000;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
    credential: cert(serviceAccount),
}); 

const db = getFirestore();
 
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.send('Hellow World!.. how an i');
 });

app.get("/signup", (req, res) => {
    res.render('signup');
 });
 
app.get('/signupsubmit', (req, res) => {
    
    const full_name = req.query.full_name;
    const last_name = req.query.last_name;
    const email = req.query.emil;
    const password = req.query.passwrd;
    
    //Adding data to the collection
    // sample comments
    db.collection('users')
    .add({
        name: full_name + last_name,
        email:emil,
        password: passwrd,
    })
    .then(() => {
        res.send("SignUP successfully");
    });
});

app.get("/signin", (req, res) => {
    res.render('signin');
 }); 

 app.get('/signinsubmit', (req, res) => {
    const email = req.query.emil;
    const password = req.query.passwrd;

    db.collection("users")
        .where("email", "==", email)
        .where("password", "==", password)
        .get()
        .then((docs) => {
            if(docs.size>0){
                //query my data base with all the user data only when the login is successful
                var usersData = [];
                db.collection('users')
                    .get()
                    .then(() => {
                        docs.forEach((doc) => {
                            usersData.push(doc.data());
                    });
                })
                .then(() => {
                    console.log(usersData);
                    res.render('home', {userData: usersData});
                }); 
            }else{
                res.send("login failed");
            }
        });
 });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
 });