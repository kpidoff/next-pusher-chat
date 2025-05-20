import { NextRequest } from "next/server";
import { POST as POST_AUTH } from "./auth/route";
import { POST as POST_EVENTS } from "./events/route";

export async function POST(request: NextRequest) {
    const contentType = request.headers.get("content-type") || "";
    // Si c'est une requête form-data, c'est une demande d'authentification
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return POST_AUTH(request);
    }
  
    // Sinon, c'est une requête pour déclencher un événement
    return POST_EVENTS(request);
  }