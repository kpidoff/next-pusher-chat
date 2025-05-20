interface EmojiPickerProps {
    onEmojiClick: (emoji: string) => void;
    disabled?: boolean;
}
declare const EmojiPickerComponent: React.FC<EmojiPickerProps>;
export default EmojiPickerComponent;
