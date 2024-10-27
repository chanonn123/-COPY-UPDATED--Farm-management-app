import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const TodoList = ({ todos, setTodos, addTodo, deleteTodo, updateTodo }) => {
    const [task, setTask] = useState('');
    const [editingTodoId, setEditingTodoId] = useState(null);

    const handleAddOrUpdateTodo = async () => {
        if (task.trim()) {
            const newTodo = { task };

            if (editingTodoId) {
                await updateTodo({ id: editingTodoId, ...newTodo });
                setEditingTodoId(null);
            } else {
                await addTodo(newTodo);
            }
            setTask('');
        }
    };

    const handleDeleteTodo = async (index) => {
        const todoId = todos[index].id;
        await deleteTodo(todoId);
        setTodos(todos.filter((_, i) => i !== index));
    };

    const handleEditTodo = (todo) => {
        setTask(todo.task);
        setEditingTodoId(todo.id);
    };

    return (
        <div className="todo-list-container">
            <input
                type="text"
                placeholder="Add a new task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="form-control mb-3"
            />
            <Button variant={editingTodoId ? "primary" : "success"} onClick={handleAddOrUpdateTodo}>
                {editingTodoId ? "Update Task" : "Add Task"}
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Task</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo, index) => (
                        <tr key={todo.id}>
                            <td>{index + 1}</td>
                            <td>{todo.task}</td>
                            <td>
                                <Button variant="info" onClick={() => handleEditTodo(todo)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteTodo(index)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TodoList;
