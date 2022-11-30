// 引用 dotenv 讀取 .env 檔的設定
import 'dotenv/config'
// 引用 linebot
import linebot from 'linebot'
import express from 'express'
import hot_article from './commands/hot_article.js'
import new_article from './commands/new_article.js'
import golden_article from './commands/golden_article.js'
import comment_article from './commands/comment_article.js'

import quickReplyHot from "./quick_reply/quick_reply_hot.json" assert { type: "json" };
import quickReplyNew from "./quick_reply/quick_reply_new.json" assert { type: "json" };
import quickReplyGolden from "./quick_reply/quick_reply_golden.json" assert { type: "json" };
import quickReplyComment from "./quick_reply/quick_reply_comment.json" assert { type: "json" };

const app = express()

// 設定 linebot
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', event => {
  if (event.message.text === '熱門看板') event.reply(quickReplyHot)
  else if (event.message.text === '最新看板') event.reply(quickReplyNew)
  else if (event.message.text === '含金文章') event.reply(quickReplyGolden)
  else if (event.message.text === '最多討論') event.reply(quickReplyComment)

  if (event.message.text.includes('!最新') || event.message.text.includes('!new')) new_article(event)
  else if (event.message.text.includes('!含金') || event.message.text.includes('!golden')) golden_article(event)
  else if (event.message.text.includes('!討論') || event.message.text.includes('!comment')) comment_article(event)
  else hot_article(event)

})

const linebotParser = bot.parser()

app.post('/', linebotParser)

app.get('/', (request, response) => {
  response.status(200).send('ok')
})

// linebot 偵測指定 port 的請求
app.listen(process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
