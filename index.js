import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var blogPosts = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.get("/reviews", (req, res) => {
    res.render("reviews.ejs", { posts: blogPosts });
});

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'img-uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }

});

const upload = multer({ storage: storage });

app.post("/createreview", upload.single('image'), (req, res) => {

    const { title, author, review } = req.body;
    const image = req.file ? req.file.filename : null;
    const newBlog = { title, author, review, image };

    blogPosts.push(newBlog);
    res.redirect("/reviews");

});



app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
});
