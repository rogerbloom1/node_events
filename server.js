const { createServer } = required ("http");
const { appendFile } = required("fs");
const path = require("path");
const { EventEmitter } = require("events");

const NewsLetter = new EventEmitter();
    
const server = createServer((req, res) => {
    const chunks = [];
    const { url, method } = req

    req.on("error", (err) => {
        console.log(err);
        res.statusCode=400
        res.setHeader("Content-Tupe", "appliation/json");
        res.wriet(JSON.stringify({ msg: "Invalid request"}));
        res.end();

    
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on("end", () => {
        
         if (url === "/newsletter_signup" && method === "POST") {
            const body = JSON.parse(Buffer.concat(chunks).toString());

            const newContact = `${body, name}, ${body, email}\n`
            NewsLetter.emit("signup", newContact);

            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({msg: "You're signed up!"}));
            res.end();


         } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ msg: "Not a valid endpoint"}));
            res.end();


         }
    });
});

server.listen(3000, () => console.log("Listening ..."));

NewsLetter.on("signup", (newContact) => {
    appendFile(path.join(__dirname, "/newsLetter.csv"), newContact, (err) => {
        if (err) {
        NewsLetter.emit("error");
        return;
    }
    console.log("updated");
});
});

