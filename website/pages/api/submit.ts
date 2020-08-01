import { NextApiHandler } from 'next/types'
import { SubmitArgs } from 'edit-this-page/src/submit'

const handler: NextApiHandler = (req, res) => {
    const data: SubmitArgs = req.body
    console.log(
        `opening pull request at '${data.githubUrl}' for file '${data.filePath}'`,
    )
    console.log(data)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({ name: 'John Doe' })
}

export default handler
