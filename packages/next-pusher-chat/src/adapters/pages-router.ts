import type { NextApiRequest, NextApiResponse } from 'next';

import { NextRequest } from 'next/server';

export class PagesRouterAdapter {
  static convertRequest(req: NextApiRequest): NextRequest {
    const origin = req.headers.origin || 'http://localhost:3000';
    const url = new URL(req.url!, origin);

    // Créer les headers
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.append(key, Array.isArray(value) ? value.join(', ') : value);
      }
    });

    // Gérer le body en fonction du Content-Type
    let body: string | undefined;
    const contentType = headers.get('content-type') || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Pour les requêtes form-data, utiliser URLSearchParams
      const formData = new URLSearchParams();
      if (req.body) {
        Object.entries(req.body).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }
      body = formData.toString();
    } else if (req.body) {
      // Pour les autres types de requêtes, utiliser JSON
      body = JSON.stringify(req.body);
    }

    return new NextRequest(url.toString(), {
      method: req.method || 'GET',
      headers,
      body
    });
  }

  static async convertResponse(response: Response, res: NextApiResponse): Promise<void> {
    // Copier les headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Définir le status
    res.status(response.status);

    // Envoyer la réponse
    const data = await response.json();
    res.json(data);
  }
}