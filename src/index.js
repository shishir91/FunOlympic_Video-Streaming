import express from "express";
import connection from "./models/index.js"
import userRoute from "./routes/userRoute.js"
import adminRoute from "./routes/adminRoute.js"
import videoModel from "./models/videoModel.js";
import liveModel from "./models/liveModel.js";
import newsModel from "./models/newsModel.js";
import session from "express-session";
import "dotenv/config";


const app = express();
app.use(express.json());
// app.use(express.static('src'));
// app.use('/views', express.static('./src/views'));
app.use(express.static('public'));
app.use('/css', express.static('./public/css'));
app.use('/img', express.static('./public/img'));
app.use('/js', express.static('./public/js'));
app.use('/uploads', express.static('./public/uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
    if (req.session.user_type == "admin") {
        res.redirect("admin");
    } else {
        const liveData = await liveModel.findAll();
        const videoData = await videoModel.findAll();
        const newsData = await newsModel.findAll();
        res.render("index.ejs", {
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
            liveData,
            videoData,
            newsData
        });
    }
});

app.use("/", userRoute);
app.use("/admin/", adminRoute);

app.listen(process.env.PORT || 3000, async () => {
    console.log(`Server has started!!!  http://localhost:${process.env.PORT}`);

    try {
        await connection.authenticate();
        connection.sync();
        console.log("Successfully connected to db");
    } catch (err) {
        console.log("Error while connecting to db", err);
    }
});


