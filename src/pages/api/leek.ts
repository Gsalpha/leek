import {NextApiRequest, NextApiResponse} from 'next'
import axios from 'axios'

const token = 'aT1ByMLP2S';
export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const code = req.body.code;
        if (!code) {
            throw new Error('No code Input')
        }
        const result = await axios.get<{
            data: Leek.Unit[]
        }>(`https://api.doctorxiong.club/v1/fund`, {
            params: {
                token,
                code,
                v: +new Date()
            }
        })
        if (!result.data.data.length) {
            throw new Error('无效基金')
        }
        return res.status(200).json(result.data.data);
    } catch (e) {
        console.error(e);
        return res.status(500).end(e.message);
    }

}
