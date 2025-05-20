import { Attachment } from "@/client/types/chat";
import React from "react";
type RegularFileProps = Pick<Attachment, "name" | "url">;
export declare const RegularFile: React.FC<RegularFileProps>;
export {};
