"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo, fetchTodos, addTodo, updateTodo, deleteTodo } from "./service";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

export default function Home() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const { data: todosData, isLoading, isError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo: Omit<Todo, "id">) => addTodo(newTodo),
    onSuccess: (newTodo) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => [
        ...(oldData || []),
        newTodo,
      ]);
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: (updatedTodo: Todo) => updateTodo(updatedTodo),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) =>
        oldData?.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: (id) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) =>
        oldData ? oldData.filter((todo) => todo.id !== id) : []
      );
    },
  });

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodoMutation.mutate({
        userId: 1,
        title: newTodo,
        completed: false,
      });
      setNewTodo("");
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.title);
  };

  const handleUpdateTodo = () => {
    if (editingTodo && newTodo.trim()) {
      updateTodoMutation.mutate({
        ...editingTodo,
        title: newTodo,
      });
      setEditingTodo(null);
      setNewTodo("");
    }
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  if (isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        Error
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        Loading...
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center"
      style={{ backgroundColor: "#555", fontSize: "20px" }}
    >
      <h1
        className="text-xl"
        style={{
          marginBottom: "12px",
          marginTop: "10px",
          fontSize: "20px",
          textDecoration: "underline",
        }}
      >
        TODOS Data
      </h1>
      <div className="flex flex-col ">
        {todosData?.slice(0, 5).map((todo) => (
          <div
            style={{ borderBottom: "1px solid grey" }}
            className="flex"
            key={todo.id}
          >
            <h2 style={{ width: "150px" }}>{" " + todo.title}</h2>
            <button
              onClick={() => handleEditTodo(todo)}
              style={{ marginRight: "10px" }}
            >
              <EditIcon fontSize="large"/>
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>
              <DeleteIcon fontSize="large"/>
            </button>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={{
            height: "35px",
            color: "black",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        />
        <button
          style={{
            height: "50px",
            width: "140px",
            border: "1px solid grey",
            padding: "8px",
            backgroundColor: "darkgrey",
            marginLeft: "10px",
            marginTop: "10px",
            borderRadius: "5px",
          }}
          onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
        >
          {editingTodo ? "Update Data" : "Add"}
        </button>
      </div>
    </main>
  );
}
