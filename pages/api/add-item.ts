// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
})

const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE || ''

async function addItem(name: string, price: string, review: string) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        price: {
          rich_text: [
            {
              text: {
                content: price,
              },
            },
          ],
        },
        review: {
          rich_text: [
            {
              text: {
                content: review,
              },
            },
          ],
        },
      },
    })
    console.log(response)
  } catch (e) {
    console.error(JSON.stringify(e))
  }
}

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name, price, review } = req.query

  if (name == null) {
    return res.status(400).json({ message: 'No Name' })
  }

  try {
    await addItem(String(name), String(price), String(review))
    res.status(200).json({ message: `Success ${name} added` })
  } catch (e) {
    return res.status(400).json({ message: 'Fail to add' })
  }
}
