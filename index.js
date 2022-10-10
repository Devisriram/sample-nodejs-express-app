const express = require('express');
const app = express();
const port = 3000;
const request = require('request');

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
    credential: cert(serviceAccount),
}); 

const db = getFirestore();
 
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render('start.ejs');
 });

app.get("/signup", (req, res) => {
    res.render('signup');
 });
 
app.get('/signupsubmit', (req, res) => {
    
    const full_name = req.query.first_name;
    const last_name = req.query.last_name;
    const email = req.query.email;
    const password = req.query.psw;
    const rep_psw = req.query.psw_repeat;

    
    //Adding data to the collection
    if(password == rep_psw){
        db.collection('users')
        .add({
            name: full_name + last_name,
            email:email,
            password: password,
        })
        .then(() => {
            res.render("signin");
        });
    }else{
        res.send("SignUP Failed");
    }
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
                    res.render('home' , {userData: usersData},);
                }); 
            }else{
                res.send("Login Failed");
            }
        });
 });


 app.get("/end", (req, res) => {
    res.render('end');
 });

 app.get("/movie", (req, res) => {
    res.render('movie');
 });

const API_KEY = 'api_key=65c72562ffa13a6ef5e5967eb6186747';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY; 


 app.get("/movienamesearch", (req, res) => {
    const moviename = req.query.moviename;
    var movieData = []

//    getMovies(API_URL);
    var url;
    if(moviename){
        url = searchURL+'&query='+moviename;
    }
    else{
        url = API_URL;
    }
    request(url , function(error,response,body){
        var data = JSON.parse(body).results;
        if(data){
            //console.log(JSON.parse(body).results);
            showMovies(data);
            
            function showMovies(data) { 
                data.forEach(movie => {
                    movieData.push(movie);
                })
            }
            console.log(movieData);
            res.render('movie', {userData: movieData},);
            //const ejs = require('ejs');
            //const html = await ejs.renderFile('movie', {userData: movieData}, {async: true});
            //res.send(html);
        }
        else{
            console.log("not thier");
        }
    })
})

   /* function getMovies(url){

        fetch(url).then(ans => ans.json()).then(data => {
            console.log(data.results)
            showMovies(data.results);
        })
    }
    function showMovies(data) { 
        data.forEach(movie => {
            var innerdata = []
            innerdata.push(movie.title);
            innerdata.push(movie.poster_path);
            innerdata.push(movie.vote_average);
            innerdata.push(movie.overview);
            movieData.push(movie.innerdata);
        })
    }
    console.log(moviename);

    if(moviename){
        getMovies(searchURL+'&query='+moviename);
    }else{
        getMovies(API_URL);
    }
    request()
 })*/
 /*app.get("/movienamesearch",(req,res)=>{
    const moviename= req.query.moviename;
    request("https://www.omdbapi.com/?t="+moviename+"&apikey=3389068b",function(error,response,body){
        if(JSON.parse(body).Response=="True"){
            var movieData = [];
            movieData.push(JSON.parse(body).Director);
            movieData.push(JSON.parse(body).Title);
            movieData.push(JSON.parse(body).Actors);
            movieData.push(JSON.parse(body).Ratings);
            movieData.push(JSON.parse(body).Poster);
            movieData.push(JSON.parse(body).Country);
            movieData.push(JSON.parse(body).Awards);
            movieData.push(JSON.parse(body).imdbRating);
            movieData.push(JSON.parse(body).Plot);
            console.log(movieData)
            res.render('movie', {userData: movieData},);
            }
        else{
            res.send("movienameincorrect");
        }
    })
})*/

app.listen(port, () => {
    console.log(`Your APP is running in the port ${port}`);
})