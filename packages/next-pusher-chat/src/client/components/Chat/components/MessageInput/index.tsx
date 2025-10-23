"use client";
import { InputContainer, StyledInput } from "./style";
import React, { useEffect, useRef, useState } from "react";

import { Box, CircularProgress } from "@mui/material";
import { Button } from "@mui/material";
import EmojiPickerComponent from "../EmojiPicker";
import FileList from "../FileList";
import FilePicker from "../FilePicker";
import { Send } from "lucide-react";
// import SendIcon from "@mui/icons-material/Send";
import { VoiceRecorder } from "../VoiceRecorder";
import { useChatContext } from "@/client/contexts/ChatContext";

export default function MessageInput() {
  const { sendMessage, updateTypingStatus, config, loadingSendMessage } =
    useChatContext();
  const inputRef = useRef<HTMLInputElement>(null);
  // État pour stocker le contenu du message
  const [message, setMessage] = useState("");
  // État pour suivre si l'utilisateur est en train de taper
  const [isTyping, setIsTyping] = useState(false);
  // Référence pour stocker le timer de désactivation du statut de frappe
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  // Référence pour suivre si le statut de frappe a été explicitement désactivé
  const isTypingDisabledRef = useRef(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Fonction pour nettoyer le timer de frappe
  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Fonction pour gérer l'envoi du message
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.trim() || selectedFiles.length > 0) {
      clearTypingTimeout();
      isTypingDisabledRef.current = true;
      setIsTyping(false);
      updateTypingStatus(false);
      sendMessage({
        content: trimmedMessage,
        attachments: selectedFiles,
        createdAt: new Date(),
      }).finally(() => {
        setMessage("");
        setSelectedFiles([]);
        // Remettre le focus sur l'input après l'envoi
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
    }
  };

  // Gestion de l'appui sur les touches (envoi avec Enter)
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Gestion du clic sur un emoji (ajout à la fin du message)
  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  // Gestion du changement de message
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Capitalisation de la première lettre
    const capitalizedValue =
      newValue.charAt(0).toUpperCase() + newValue.slice(1);
    setMessage(capitalizedValue);

    // Réinitialiser le statut désactivé et réactiver le statut de frappe si nécessaire
    if (newValue.length > 0) {
      isTypingDisabledRef.current = false;
      if (!isTyping) {
        setIsTyping(true);
        updateTypingStatus(true);
      }
    }
  };

  // Effet pour synchroniser l'état de frappe avec la longueur du message
  // et le statut de désactivation
  useEffect(() => {
    const newIsTyping = message.length > 0 && !isTypingDisabledRef.current;
    if (newIsTyping !== isTyping) {
      setIsTyping(newIsTyping);
      updateTypingStatus(newIsTyping);
    }
  }, [message, isTyping, updateTypingStatus]);

  // Gestion de la perte de focus (sortie du champ)
  const handleBlur = () => {
    clearTypingTimeout();
    // Délai de 10 secondes avant de désactiver le statut de frappe
    typingTimeoutRef.current = setTimeout(() => {
      isTypingDisabledRef.current = true;
      setIsTyping(false);
      updateTypingStatus(false);
    }, config?.typingTimeout);
  };

  // Gestion du focus (entrée dans le champ)
  const handleFocus = () => {
    // Si le timer est toujours actif, on ne fait rien
    if (typingTimeoutRef.current) {
      return;
    }

    // Si le timer est terminé, on réinitialise le statut
    isTypingDisabledRef.current = false;
    if (message.length > 0) {
      setIsTyping(true);
      updateTypingStatus(true);
    }
  };

  // Nettoyage du timer lors du démontage du composant
  useEffect(() => {
    return () => {
      clearTypingTimeout();
    };
  }, []);

  const handleFilesSelect = (attachments: File[]) => {
    setSelectedFiles((prev) => [...prev, ...attachments]);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
    const audioFile = new File(
      [audioBlob],
      `voice-message-${Date.now()}.webm`,
      {
        type: "audio/webm",
      }
    );
    setSelectedFiles((prev) => [...prev, audioFile]);
  };

  return (
    <Box>
      <FileList attachments={selectedFiles} onRemoveFile={handleRemoveFile} />
      <InputContainer>
        {config?.activeEmoji && (
          <EmojiPickerComponent
            onEmojiClick={handleEmojiClick}
            disabled={loadingSendMessage}
          />
        )}
         {config?.activeFile && (
          <FilePicker
            onFilesSelect={handleFilesSelect}
            disabled={loadingSendMessage}
          />
        )} 
        {config?.activeVoice && (
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecording}
            disabled={loadingSendMessage}
          />
        )}
        <StyledInput
          inputProps={{ ref: inputRef }}
          disabled={loadingSendMessage}
          fullWidth
          placeholder="Écrivez un message..."
          value={message}
          onChange={handleMessageChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          multiline
          autoFocus
          maxRows={4}
        />
        <Button
          disabled={loadingSendMessage}
          size="small"
          onClick={handleSend}
          color="primary"
          sx={{
            minWidth: { xs: "36px", sm: "48px" },
            height: { xs: "36px", sm: "48px" },
          }}
        >
          {loadingSendMessage ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Send size={20} />
          )}
        </Button>
      </InputContainer>
    </Box>
  );
}
