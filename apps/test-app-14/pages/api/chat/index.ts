import type { NextApiRequest, NextApiResponse } from 'next';
import { PagesRouterAdapter, POST as PusherPOST } from '@next-pusher-chat/core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
		return;
	}

	try {
		const nextRequest = PagesRouterAdapter.convertRequest(req);
		const response = await PusherPOST(nextRequest);
		
		if (!response) {
			res.status(500).json({ error: 'No response from Pusher handler' });
			return;
		}

		await PagesRouterAdapter.convertResponse(response, res);
	} catch (error) {
		console.error('Error in chat handler:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
