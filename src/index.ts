import express from "express";

const app = express();

const PORT = process.env.PORT ?? 8000;

app.get('/', (req, res) => {
    res.json({message: "Welcome to landing page."})
})

app.get('/health', (req, res) => {
    res.json({message: "Everything is going good."})
})

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}.`)
})