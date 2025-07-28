const express = require("express"); 
const mongoose = require("mongoose"); 
const cors = require('cors')


const app = express();  

// let todos = [];  

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// connecting mongoDB 
mongoose.connect('mongodb+srv://afsarcs020:afsarcs020@cluster0.zxgo89j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/todoapp')
.then(() => {
    console.log("Db connected")
})
.catch((err) => {
    console.log(err); 
})

// creating schema 
const todoSchema = new mongoose.Schema({
    title: String,
    description: String
})

const todoModel = mongoose.model('Todo', todoSchema); 

app.use(express.json())
app.use(cors())  

app.post('/todos', async (req, res) => { 
    const {title, description} = req.body; 
    
    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save(); 
        res.status(201).json(newTodo); 
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find(); 
        res.json(todos); 
        console.log(todos)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

app.put('/todos/:id', async (req, res) => {
    try {
        const {title, description} = req.body; 
        const id = req.params.id; 
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id, 
            {title, description}, 
            {new: true} // this line give the updated data to the console, if not used this then the data will get updated in the db but it gives the previous data as a response. 
        )
        if(!updatedTodo) { // if it is null 
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(updatedTodo); 
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message}); 
    }
}) 

app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();    
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
   
})

const port = 5000; 

app.listen(port, () => {
    console.log("Server is listening to port : " +port); 
})

