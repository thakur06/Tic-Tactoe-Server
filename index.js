const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt=require("bcrypt");
const StreamChat=require("stream-chat").StreamChat;
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const api_key=process.env.API_KEY;
const api_secret=process.env.API_SECRET;
const connection = StreamChat.getInstance(api_key,api_secret);

app.post("/signin", async(req, res) => {
    try {
        const { Fname, Lname, Uname, password } = req.body;
        const uId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = connection.createToken(uId);

        res.json({ token, Fname, Lname, Uname, uId, hashedPassword });
    }
    catch (err) {

        res.json(err);
    }
})

app.post("/login", async(req, res) => {
    const { name, password } = req.body;
    try {
       const {users}=await connection.queryUsers({Uname:name})

        if (users.length == 0) return res.json({ message: "User not found" })

        const pass = await bcrypt.compare(password, users[0].hashedPassword);
        const token = connection.createToken(users[0].id);

        if (pass) {

            res.json({
                token,
                Fname: users[0].Fname,
                Lname: users[0].Lname,
                Uname: users[0].Uname,
                uId: users[0].id
            })
        }
        else {

            res.status(401).send({ mgs: "User not found", status: 404 });
        }
console.log(users)
        res.send(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });

}
})


app.listen(PORT, (err) => {
    if (!err) {
        console.log(`app listening on post 4000`);

    } else {
        console.log(err);

    }
})