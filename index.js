import express from 'express';
const app = express();
const PORT = 3003;

const users = [
    { id: 1, name: 'Hov', age: 19 },
    { id: 2, name: 'Nar', age: 29 },
    { id: 3, name: 'Vle', age: 39 },
    { id: 4, name: 'Armenuhi', age: 49 },
];

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Home Page');
});
app.get('/users', (req, res) => {
    const { name, age } = req.query;
    if (name) {
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
        return res.status(200).json(filteredUsers);
    }
    if (age === 'min' || age === 'max') {
        const sortedUsers = [...users].sort((a, b) => age === 'max' ? b.age - a.age : a.age - b.age);
        return res.status(200).json(sortedUsers);
    }
    res.status(200).json(users);
});
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === Number(id));

    if (user) {
        return res.status(200).json(user);
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});
app.post('/users', (req, res) => {
    const newUser = req.body;
    if (!newUser || !newUser.id || !newUser.name || !newUser.age) {
        return res.status(400).json({ message: 'Invalid user data' });
    }
    users.push(newUser);
    res.status(201).json(users);
});
app.patch('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        return res.status(200).json(users);
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});
app.put('/users', (req, res) => {
    const newUsers = req.body;
    if (!Array.isArray(newUsers)) {
        return res.status(400).json({ message: 'Expected an array of users' });
    }
    users.length = 0;
    users.push(...newUsers);
    res.status(200).json(users);
});
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        return res.status(200).json(users);
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});