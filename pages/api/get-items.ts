// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
})

const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE || ''

async function getItems() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: 'price', direction: 'ascending' }],
    })
    return response
  } catch (e) {
    console.error(JSON.stringify(e))
  }
}

type Data = {
  message: string
  items?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await getItems()
    console.log(response)
    res.status(200).json({ items: response?.results, message: `Success` })
  } catch (e) {
    return res.status(400).json({ message: 'Failed' })
  }
}
