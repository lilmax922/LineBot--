import axios from 'axios'
import * as cheerio from 'cheerio'
import tempTopic from '../templates/temp_topic.js'
import writejson from '../utils/writejson.js'

export default async (event) => {
  try {
    const { data } = await axios.get('https://www.league-funny.com/s/' + event.message.text)
    const $ = cheerio.load(data)
    const articles = []
    $('.list .card').each(function (index) {
      if (index >= 12) return
      const bubble = JSON.parse(JSON.stringify(tempTopic))
      if ($(this).hasClass('video') || $(this).hasClass('article')) {
        // 圖片
        bubble.hero.url = $(this).find('.content-box .img img').attr('src') || 'https://raw.githubusercontent.com/lilmax922/Photos/main/640px-Image_not_available.png'
        // 標題
        bubble.body.contents[0].text = $(this).find('.content-box .text a h2').text() || $(this).find('.content-box .img img').attr('alt') || '此篇無標題QQ'
        // 分類
        bubble.body.contents[1].contents[0].contents[0].text = event.message.text
        // 多久之前發表在
        const text = $(this).find('.member').text().split(' ').map((text) => {
          const newText = text.split('在')[0] + '在'
          if (newText.includes('發表')) {
            return newText
          } else return
        }).filter((obj) => {
          return obj !== '' && obj !== undefined
        })
        bubble.body.contents[1].contents[1].contents[0].text = text[0]
        // 看版
        bubble.body.contents[1].contents[1].contents[1].text = $(this).find('.content-box .member a:nth-child(2)').text() || '此篇無相關版'
        // 文章簡介
        bubble.body.contents[2].contents[0].text = $(this).find('.functionLine .pv').text()
        // 網址來源
        if ($(this).find('.content-box .img a').attr('href') === undefined) {
          bubble.footer.contents[0].action.uri = 'https://www.league-funny.com/' + $(this).find('.content-box .text a').attr('href')
        } else {
          bubble.footer.contents[0].action.uri = 'https://www.league-funny.com/' + $(this).find('.content-box .img a').attr('href') || '此篇無網址來源QQ'
        }
        articles.push(bubble)
      }
    })
    const reply = {
      type: 'flex',
      altText: '遊戲圈時事文章',
      contents: {
        type: 'carousel',
        contents: articles
      }
    }
    if (articles.length === 0) event.reply('查無此類型文章')
    else {
      event.reply(reply)
      writejson(reply, 'debug_articles')
    }
  } catch (error) {
    console.error('發生錯誤', error)
  }
}
