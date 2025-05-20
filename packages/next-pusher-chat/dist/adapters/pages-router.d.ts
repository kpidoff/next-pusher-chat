import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
export declare class PagesRouterAdapter {
    static convertRequest(req: NextApiRequest): NextRequest;
    static convertResponse(response: Response, res: NextApiResponse): Promise<void>;
}
