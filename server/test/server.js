const express = require("express")
const path = require("path");
const app = express();
// app.use(express.static(path.join(__dirname, "index.html")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(8080, () => {
    console.log("The server is running on PORT 8080");
})