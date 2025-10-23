import { AudioContainer, AudioProgress, AudioProgressBar } from "./styles";
import { Box, IconButton, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || isNaN(seconds)) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

interface AudioMessageProps {
  url: string;
}

export const AudioMessage: React.FC<AudioMessageProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);

      audioRef.current.addEventListener("error", (e) => {
        console.error("Erreur de chargement audio:", e);
      });

      audioRef.current.addEventListener("durationchange", () => {
        if (
          audioRef.current &&
          isFinite(audioRef.current.duration) &&
          audioRef.current.duration > 0
        ) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.addEventListener("progress", () => {
        if (
          audioRef.current &&
          isFinite(audioRef.current.duration) &&
          audioRef.current.duration > 0
        ) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.load();

      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });

      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AudioContainer>
      <IconButton
        size="medium"
        onClick={handlePlayPause}
        sx={{
          color: "primary.main",
          "&:hover": {
            backgroundColor: "action.hover",
          },
          flexShrink: 0,
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
        }}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0, pr: 1, overflow: "hidden" }}>
        <AudioProgress>
          <AudioProgressBar progress={progress} />
        </AudioProgress>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            width: "100%",
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
              minWidth: { xs: "30px", sm: "40px" },
            }}
          >
            {formatTime(currentTime)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
              minWidth: { xs: "30px", sm: "40px" },
              textAlign: "right",
            }}
          >
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>
    </AudioContainer>
  );
};
