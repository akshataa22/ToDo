"use client";
import Image from "next/image";
import React from "react";
import { useQuery, useIsFetching } from "@tanstack/react-query";
import { Box, Container, Typography, CircularProgress } from "@mui/material";

interface ToDo {
  id: number;
  title: string;
}

export default function Home() {
  const isFetching = useIsFetching();
  const { data: todosData, isLoading, isError } = useQuery<ToDo[]>({
    queryKey: ['todos'],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
        response.json()
      ),
    select: (todos) => todos.map((todo) => ({ id: todo.id, title: todo.title })),
  });

  const { data: usersData } = useQuery<any>({
    queryKey: ['users'],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users").then((response) =>
        response.json()
      ),
    enabled: !!todosData,
  });

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6" color="error">
            Error loading data
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          TODOS
        </Typography>
        <Box mb={3}>
          {todosData?.slice(0, 4).map((todo: ToDo) => (
            <Box key={todo.id} mb={1}>
              <Typography variant="body1">{todo.title}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="h4" gutterBottom mt={3}>
          USERS
        </Typography>
        <Box mb={3}>
          {usersData?.map((user: any) => (
            <Box key={user.id} mb={1}>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
