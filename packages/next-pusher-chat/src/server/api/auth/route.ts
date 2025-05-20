import { NextRequest } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export async function POST(request: NextRequest) {
  const requestData = await request.formData();
  const socketId = requestData.get('socket_id') as string;
  const channel = requestData.get('channel_name') as string;
  const userId = request.headers.get('x-user-id');

  if (!socketId || !channel || !userId) {
    return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (!channel.startsWith('private-')) {
      return new Response(JSON.stringify({ error: 'Canal non autorisé' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const auth = pusher.authorizeChannel(socketId, channel);
    return new Response(JSON.stringify(auth), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error("⚠️ Auth failed:", err);
    return new Response(
      JSON.stringify({
        error: "Échec de l'authentification",
        details: err instanceof Error ? err.message : "Inconnu",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
} 