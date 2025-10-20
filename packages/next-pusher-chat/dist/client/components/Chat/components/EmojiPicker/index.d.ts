interface EmojiPickerProps {
    onEmojiClick: (emoji: string) => void;
    disabled?: boolean;
}
declare function EmojiPickerComponent({ onEmojiClick, disabled, }: EmojiPickerProps): import("react/jsx-runtime").JSX.Element;
export default EmojiPickerComponent;
