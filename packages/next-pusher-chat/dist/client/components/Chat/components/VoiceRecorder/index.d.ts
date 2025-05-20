interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
    disabled?: boolean;
}
export declare function VoiceRecorder({ onRecordingComplete, disabled, }: VoiceRecorderProps): import("react/jsx-runtime").JSX.Element;
export {};
