const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.send("hello world");
});
app.listen(PORT, (err) => {
    if (!err) {
        console.log(`app listening on post 4000`);

    } else {
        console.log(err);

    }
})




