"use client";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Wifi,
  WifiFind,
  WifiOff,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

import Bubble from "./components/Bubble";
import Conversation from "./components/Conversation";
import { User } from "@prisma/client";
import { getManyUsers } from "./actions/user";
import { useNextPusherChat } from "@next-pusher-chat/core";

export default function Home() {
  const { isConnected, isLoading, error, connectionState } =
    useNextPusherChat();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await getManyUsers();
      setUsers(loadedUsers);
    };
    loadUsers();
  }, []);

  const getConnectionIcon = () => {
    switch (connectionState) {
      case "connected":
        return <Wifi color="success" />;
      case "disconnected":
        return <WifiOff color="error" />;
      case "connecting":
        return <WifiFind color="warning" />;
      case "error":
        return <ErrorIcon color="error" />;
      default:
        return <WifiFind color="info" />;
    }
  };

  const getConnectionColor = () => {
    switch (connectionState) {
      case "connected":
        return "success";
      case "disconnected":
        return "error";
      case "connecting":
        return "warning";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 4, bgcolor: "background.default" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 800,
          mx: "auto",
          mt: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Next Pusher Chat Demo
        </Typography>

        <Stack spacing={2} sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isLoading ? <CircularProgress size={24} /> : getConnectionIcon()}
            <Chip
              label={connectionState.toUpperCase()}
              color={getConnectionColor() as any}
              variant="outlined"
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {isConnected && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Connexion Pusher établie avec succès!
            </Alert>
          )}
        </Stack>

        <Bubble conversationId="cmaco9sfj0002rlakrx9akuyt" />
      </Paper>
    </Box>
  );
}
