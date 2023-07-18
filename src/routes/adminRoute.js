import { Router } from "express";
import multer from "multer";
import path from "path";
import userModel from "../models/userModel.js";
import videoModel from "../models/videoModel.js";
import liveModel from "../models/liveModel.js";
import newsModel from "../models/newsModel.js";

const router = Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

var multipleUpload = upload.fields([{ name: 'video', maxCount: 10 }, { name: 'thumbnail', maxCount: 10 }]);
var liveUpload = upload.fields([{ name: 'live', maxCount: 10 }, { name: 'live_thumbnail', maxCount: 10 }]);
var newsUpload = upload.single('photo');




router.get("/addNews", async (req, res) => {
    if (req.session.user_id){
        
        res.render("admin_addNews", {
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
        });
    }else{
        res.redirect("/");
    }
});
router.get("/news", async (req, res) => {
    if (req.session.user_id){
        const data = await newsModel.findAll();
        res.render("admin_news", {
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
            data
        });
    }else{
        res.redirect("/");
    }
});
router.get("/addlive", async (req, res) => {
    if (req.session.user_id){
        res.render("admin_addLive", {
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
        });
    }else{
        res.redirect("/");
    }
});
router.get("/live", async (req, res) => {
    if (req.session.user_id){
        const data = await liveModel.findAll();
        res.render("admin_live", {
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
            data
        });
    }else{
        res.redirect("/");
    }
});
router.get("/addVideo", async (req, res) => {
    if (req.session.user_id){
        res.render("admin_addVideo", {
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
        });
    }else{
        res.redirect("/");
    }
});
router.get("/videos", async (req, res) => {
    if (req.session.user_id){
        const data = await videoModel.findAll();
        res.render("admin_videos", {
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
            data
        });
    }else{
        res.redirect("/");
    }
});

router.get("/users", async (req, res) => {
    if (req.session.user_id){
        const data = await userModel.findAll({
            where: {
                type: 'user'
            }
        });
        res.render("admin_users", {
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
            data
        });
    }else{
        res.redirect("/");
    }
});

router.get("/users/block/:id", async (req, res) => {
    const { id } = req.params;

    const data = await userModel.update({
        blocked: true
    }, {
        where: {
            id,
        }
    });

    if (data) {
        res.redirect("/admin/users");
    }

});
router.get("/users/unblock/:id", async (req, res) => {
    const { id } = req.params;

    const data = await userModel.update({
        blocked: false
    }, {
        where: {
            id,
        }
    });

    if (data) {
        res.redirect("/admin/users");
    }

});
router.get("/users/delete/:id", async (req, res) => {
    const { id } = req.params;

    const data = await userModel.destroy({
        where: {
            id,
        }
    });

    if (data) {
        res.redirect("/admin/users");
    }

});
router.get("/videos/delete/:id", async (req, res) => {
    const { id } = req.params;

    const data = await videoModel.destroy({
        where: {
            id,
        }
    });

    if (data) {
        res.redirect("/admin/videos");
    }

});
router.get("/live/delete/:id", async (req, res) => {
    const { id } = req.params;

    const data = await liveModel.destroy({
        where: {
            id,
        }
    });

    if (data) {
        res.redirect("/admin/live");
    }

});
router.get("/news/delete/:id", async (req, res) => {
    const { id } = req.params;

    const data = await newsModel.destroy({
        where: {
            id,
        }
    });

    if (data) {
        res.redirect("/admin/news");
    }

});






router.post("/addVideo", multipleUpload, async (req, res) => {
    const { title, description } = req.body;
    const { video, thumbnail } = req.files;
    console.log(req.body);
    console.log(req.files);
    console.log(video[0].filename);
    console.log(thumbnail[0].filename);

    const data = await videoModel.create({
        title,
        description,
        video: video[0].filename,
        thumbnail: thumbnail[0].filename
    });

    if (data && req.files) {
        console.log("Files Uploaded");
        res.redirect("/admin/videos")
    }

});

router.post("/addLive", liveUpload, async (req, res) => {
    const { title, description } = req.body;
    const { live, live_thumbnail } = req.files;
    console.log(req.body);
    console.log(req.files);
    console.log(live[0].filename);
    console.log(live_thumbnail[0].filename);

    const data = await liveModel.create({
        title,
        description,
        live: live[0].filename,
        live_thumbnail: live_thumbnail[0].filename
    });

    if (data && req.files) {
        console.log("Files Uploaded");
        res.redirect("/admin/live")
    }

});

router.post("/addNews", newsUpload, async (req, res) => {
    const { title, description } = req.body;
    const photo = req.file;
    console.log(req.body);
    console.log(req.file);
    console.log(photo);

    const data = await newsModel.create({
        title,
        description,
        photo: photo.filename,
    });

    if (data && req.file) {
        console.log("Files Uploaded");
        res.redirect("/admin/news")
    }

});




export default router;