const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

app.use(express.json());

let todos = [
    { id: uuidv4(), title: 'task 1', content: "task" },
    { id: uuidv4(), title: 'task 2', content: "task" },
    { id: uuidv4(), title: 'task 3', content: "task" }
];

app.get("/todos", async (req, res) => {
    try{
        res.json(todos);
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


app.get("/todos/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const todo = todos.find(todo => todo.id === id);
        
        if (todo) {
            res.json(todo); 
        } else {
            res.status(404).json({ message: 'Todo not found' }); 
        }
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


app.post("/create", async (req, res) => {
    try{
        const { title, content } = req.body;
        const newTodo = { id: uuidv4(), title, content };

        todos.push(newTodo);
        res.status(201).json(newTodo);
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


app.put("/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content } = req.body;
        const todoIndex = todos.findIndex(todo => todo.id === id);
        
        if (todoIndex !== -1) {
            todos[todoIndex] = { ...todos[todoIndex], title, content };
            res.json(todos[todoIndex]);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


app.delete("/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex !== -1) {
            const deletedTodo = todos.splice(todoIndex, 1);
            res.json(deletedTodo);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});


app.get("/download", async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'todos.txt');
        fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
        res.download(filePath, 'todos.txt', (err) => {
            if (err) {
                res.status(500).json({ message: err.message });
            }
        });
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

port = 4000;
app.listen(4000, () => {
    console.log(`Server running on port ${port}`)
});