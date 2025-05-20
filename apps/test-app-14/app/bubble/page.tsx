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

import Bubble from "../components/Bubble";
import { User } from "@prisma/client";
import { getManyUsers } from "../actions/user";
import { useNextPusherChat } from "@next-pusher-chat/core";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await getManyUsers();
      setUsers(loadedUsers);
    };
    loadUsers();
  }, []);

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

        <Bubble conversationId="cmaco9sfj0002rlakrx9akuyt" />
      </Paper>
    </Box>
  );
}
