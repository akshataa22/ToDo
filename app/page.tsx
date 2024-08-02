"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo, fetchTodos, addTodo, updateTodo, deleteTodo } from "./service";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NoteIcon from '@mui/icons-material/Note';

export default function Home() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const {
    data: todosData,
    isLoading,
    isError,
  } = useQuery<Todo[]>({
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
      <Container>
        <Typography variant="h5" align="center" color="error">
          Error
        </Typography>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          <CircularProgress />
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5} sx={{ backgroundColor: "#2c2c2c", borderRadius: 2, p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
      <NoteIcon sx={{ mr: 1, fontSize:30 }} />
      <Typography variant="h4" flexGrow={1} textAlign="center">
        TODOS Data
      </Typography>
    </Box>
        <Box>
          {todosData?.map((todo) => (
            <Box
              key={todo.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              borderBottom="1px solid grey"
              pb={1}
            >
              <Typography fontSize={16}>{todo.title}</Typography>
              <Box>
                <IconButton
                  onClick={() => handleEditTodo(todo)}
                  aria-label="edit"
                  sx={{
                    color: "grey",
                    "&:hover": {
                      borderRadius: "50%",
                      backgroundColor: "black",
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteTodo(todo.id)}
                  aria-label="delete"
                  sx={{
                    color: "grey",
                    "&:hover": {
                      borderRadius: "50%",
                      backgroundColor: "black",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          label="New Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          margin="normal"
          InputProps={{
            sx: {
              color: "white",
              fontSize: "16px",
              height: "47px",
              marginTop:'0',
              padding: "2px",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
          fullWidth
        >
          {editingTodo ? "Update Data" : "Add"}
        </Button>
      </Box>
    </Container>
  );
}
