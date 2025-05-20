"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { NextPusherChatProvider } from "@next-pusher-chat/core";
import type { ReactNode } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import { getManyUsers } from "./actions/user";

interface User {
  id: string;
  name: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3", // Bleu plus clair
    },
    secondary: {
      main: "#f50057", // Rose plus vif
    },
    success: {
      main: "#4caf50", // Vert
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await getManyUsers();
      setUsers(loadedUsers);
      if (loadedUsers.length > 0) {
        setSelectedUserId(loadedUsers[0].id);
      }
    };
    loadUsers();
  }, []);

  const handleUserChange = (event: SelectChangeEvent) => {
    setSelectedUserId(event.target.value);
  };

  if (!selectedUserId) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <div style={{ padding: "20px" }}>
          <FormControl fullWidth>
            <InputLabel id="user-select-label">
              Sélectionner un utilisateur
            </InputLabel>
            <Select
              labelId="user-select-label"
              id="user-select"
              value={selectedUserId}
              label="Sélectionner un utilisateur"
              onChange={handleUserChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} {user.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <NextPusherChatProvider userId={selectedUserId}>
          {children}
        </NextPusherChatProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
