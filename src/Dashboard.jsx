import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TodoList from './TodoList';
import HarvestRecorder from './HarvestRecorder';
import './Dashboard.css';
import Weather from './Weather';
import { auth } from './firebase';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [harvestRecords, setHarvestRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate('/login');
                return;
            }

            const userId = user.uid;

            try {
                const todosResponse = await fetch(`https://farm-app-backend-ivory.vercel.app/todos?userId=${userId}`);
                const todosData = await todosResponse.json();
                setTodos(todosData);

                const harvestsResponse = await fetch(`https://farm-app-backend-ivory.vercel.app/harvest?userId=${userId}`);
                const harvestsData = await harvestsResponse.json();
                setHarvestRecords(harvestsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [navigate]);

    const addTodo = async (newTodo) => {
        const user = auth.currentUser;
        if (!user) return;

        const newTodoWithUserId = { ...newTodo, userId: user.uid };

        try {
            const response = await fetch('https://farm-app-backend-ivory.vercel.app/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodoWithUserId),
            });
            const savedTodo = await response.json();
            setTodos(prevTodos => [...prevTodos, savedTodo]);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const deleteTodo = async (todoId) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await fetch(`https://farm-app-backend-ivory.vercel.app/todos/${todoId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid }),
            });
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const updateTodo = async (updatedTodo) => {
        const user = auth.currentUser;
        if (!user) return;

        const updatedTodoWithUserId = { ...updatedTodo, userId: user.uid };

        try {
            const response = await fetch(`https://farm-app-backend-ivory.vercel.app/todos/${updatedTodo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTodoWithUserId),
            });
            await response.json();
            setTodos(prevTodos =>
                prevTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
            );
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const addHarvestRecord = async (newHarvest) => {
        const user = auth.currentUser;
        if (!user) return;

        const newHarvestWithUserId = { ...newHarvest, userId: user.uid };

        try {
            const response = await fetch('https://farm-app-backend-ivory.vercel.app/harvest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHarvestWithUserId),
            });
            const savedHarvest = await response.json();
            setHarvestRecords(prevRecords => [...prevRecords, savedHarvest]);
        } catch (error) {
            console.error('Error adding harvest record:', error);
        }
    };

    const deleteHarvestRecord = async (harvestId) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await fetch(`https://farm-app-backend-ivory.vercel.app/harvest/${harvestId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid }),
            });
            setHarvestRecords(prevRecords => prevRecords.filter(record => record.id !== harvestId));
        } catch (error) {
            console.error('Error deleting harvest record:', error);
        }
    };

    const updateHarvestRecord = async (updatedRecord) => {
        const user = auth.currentUser;
        if (!user) return;

        const updatedRecordWithUserId = { ...updatedRecord, userId: user.uid };

        try {
            const response = await fetch(`https://farm-app-backend-ivory.vercel.app/harvest/${updatedRecord.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRecordWithUserId),
            });
            await response.json();
            setHarvestRecords(prevRecords =>
                prevRecords.map(record => (record.id === updatedRecord.id ? updatedRecord : record))
            );
        } catch (error) {
            console.error('Error updating harvest record:', error);
        }
    };

    return (
        <div className="dashboard container">
            <div className="header mb-4">
                <h2>Dashboard</h2>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="dashboard-section">
                        <h3>Todo List</h3>
                        <TodoList
                            todos={todos}
                            setTodos={setTodos}
                            addTodo={addTodo}
                            deleteTodo={deleteTodo}
                            updateTodo={updateTodo}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="dashboard-section">
                        <h3>Harvest Recorder</h3>
                        <HarvestRecorder
                            harvestRecords={harvestRecords}
                            setHarvestRecords={setHarvestRecords}
                            addHarvestRecord={addHarvestRecord}
                            deleteHarvestRecord={deleteHarvestRecord}
                            updateHarvestRecord={updateHarvestRecord}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Weather />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
