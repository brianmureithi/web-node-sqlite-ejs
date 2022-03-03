const express= require("express")
const path = require("path")
const sqlite3= require("sqlite3").verbose();

const app = express();
app.set("view engine", "ejs")

app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

/* Connecting to database */
const db_name= path.join(__dirname, "database", "appdb.db")
const db = new sqlite3.Database(db_name, err => {
    if(err){
        return console.error(err.message);
    }
    console.log("Success connecting to database")
})
/* Creating Speakers table */
db.serialize(function() {
const sql_create_speakers_tbl = `CREATE TABLE IF NOT EXISTS Speakers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    about VARCHAR(100) NOT NULL,
    workplace VARCHAR(100) NOT NULL
  
  );`;
  db.run(sql_create_speakers_tbl, err => {
      if(err){
          return console.error(err.message)
      }
      console.log("successful creation of speakers table")
  });

  /* Seeding speakers table */
  const sql_insert = `INSERT INTO Speakers (id, name, title, about, workplace) VALUES
  (1, 'John Kennedy', 'Web development', 'John is a web developer at microsoft for 12 years', 'Microsoft'),
  (2, 'Johnstone Colombus', 'Environment Conservation', 'John has been a UN advocate for the past 6  years', 'United Nations'),
  (3, 'Timo Werner', 'Health and Exrecise', 'Werner is a professional football player at Chelsea', 'Chelsea Football');`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 3 books");
  });
})


/* Port listening */
app.listen(5000, ()=> {
    console.log("server started at port 5000")
})

/* Returning home screen */
app.get("/", (req,res) =>{
res.render("index");
})

/* Fetching all speakers data */
app.get("/speakers", (req, res) =>{
    const fetch_speakers= "SELECT * FROM Speakers ORDER BY id"
    db.all(fetch_speakers, [], (err,rows) => {
        if(err){
            return console.error(err.message);

        }
        res.render("speakers", {model: rows});

    })
})