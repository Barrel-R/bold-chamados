import type {
    VercelRequest,
    VercelResponse,
} from '@vercel/node'

export default async function handler(
    req: VercelRequest,
    res: VercelResponse,
) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({
            error: 'Método não permitido',
        })
    }

    const { id } = req.query

    if (typeof id !== 'string') {
        return res.status(400).json({
            error: 'ID inválido',
        })
    }

    const baseUrl = process.env.N8N_UPDATE_TICKET_URL

    if (!baseUrl) {
        return res.status(500).json({
            error: 'N8N_UPDATE_TICKET_URL não configurada',
        })
    }

    try {
        const response = await fetch(`${baseUrl}/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        })

        const body = await response.text()

        res.status(response.status)

        const contentType = response.headers.get('content-type')

        if (contentType) {
            res.setHeader('Content-Type', contentType)
        }

        return res.send(body)
    } catch (error) {
        console.error('Erro ao chamar n8n:', error)

        return res.status(502).json({
            error: 'Erro ao comunicar com o n8n',
        })
    }
}
