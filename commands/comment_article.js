import axios from 'axios'
import * as cheerio from 'cheerio'
import tempTopic from '../templates/temp_topic.js'
import writejson from '../utils/writejson.js'

export default async (event) => {
  try {
    let name = ''
    const topicArr = [{ chi: '!討論 英雄聯盟', eng: '!comment lol', url: 'lol' }, { chi: '!討論 遊戲', eng: '!comment gaming', url: 'gaming' }, { chi: '!討論 apex英雄', eng: '!comment apex', url: 'apexleagues' }, { chi: '!討論 寶可夢', eng: '!comment pokemon', url: 'pokemon' }, { chi: '!討論 鬥陣特工', eng: '!comment overwatch', url: 'overwatch' }, { chi: '!討論 steam', eng: '!comment steam', url: 'steam' }, { chi: '!討論 聯盟戰旗', eng: '!comment tft', url: 'TFT' }, { chi: '!討論 遊戲王', eng: '!comment yugioh', url: 'yugioh' }, { chi: '!討論 爐石戰記', eng: '!comment hs', url: 'hs' }, { chi: '!討論 激鬥峽谷', eng: '!comment lolm', url: 'lolm' }, { chi: '!討論 特戰英豪', eng: '!comment valorant', url: 'valorant' }, { chi: '!討論 傳說對決', eng: '!comment aov', url: 'moba' }, { chi: '!討論 俠盜獵車手', eng: '!comment gta', url: 'gta' }, { chi: '!討論 絕地求生', eng: '!comment pubg', url: 'PUBG' }, { chi: '!討論 csgo', eng: '!comment csgo', url: 'csgo' }, { chi: '!討論 手遊', eng: '!comment mobilegame', url: 'mobileGame' }, { chi: '!討論 福利', eng: '!comment hso', url: 'hotchick/' }, { chi: '!討論 八卦', eng: '!comment gossiping', url: 'gossiping' }, { chi: '!討論 娛樂', eng: '!comment funny', url: 'funny' }, { chi: '!討論 電影', eng: '!comment movie', url: 'movie' }, { chi: '!討論 寵物', eng: '!comment pet', url: 'pet' }, { chi: '!討論 動漫', eng: '!comment acg', url: 'acg' }, { chi: '!討論 3c', eng: '!comment 3c', url: '3c' }, { chi: '!討論 運動', eng: '!comment sport', url: 'sport' }, { chi: '!討論 迷因', eng: '!comment meme', url: 'meme' }]

    for (let i = 0; i < topicArr.length; i++) {
      // console.log(topicArr[i])
      if (event.message.text === topicArr[i].eng || event.message.text === topicArr[i].chi) {
        name = topicArr[i].url
        break
      }
    }
    const { data } = await axios.get('https://www.league-funny.com/' + name + '/comment')
    const $ = cheerio.load(data)
    const articles = []
    $('.list .card').each(function (index) {
      if (index >= 12) return
      const bubble = JSON.parse(JSON.stringify(tempTopic))
      if ($(this).hasClass('video') || $(this).hasClass('article')) {
        // 圖片
        bubble.hero.url = $(this).find('.content-box .img img').attr('data-src') || 'https://raw.githubusercontent.com/lilmax922/Photos/main/640px-Image_not_available.png'
        // 標題
        bubble.body.contents[0].text = $(this).find('.content-box .img a').attr('title') || $(this).find('.content-box .text h2 a:nth-child(2)').attr('title') || '此篇無標題QQ'
        // 分類
        bubble.body.contents[1].contents[0].contents[0].text = $(this).find('.content-box .text a:nth-child(1)').text() || '此篇無分類QQ'
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
        bubble.body.contents[1].contents[1].contents[1].text = $(this).find('.content-box .member a:nth-child(2)').attr('title') || '此篇無相關版'
        // 文章簡介
        bubble.body.contents[2].contents[0].text = $(this).find('.content-box .list_post_description p').text() || '此篇無簡介QQ'
        // 網址來源
        if ($(this).find('.content-box .img a').attr('href') === undefined) {
          bubble.footer.contents[0].action.uri = 'https://www.league-funny.com/' + $(this).find('.content-box .text h2 a:nth-child(2)').attr('href')
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
      // writejson(reply, 'debug_articles')
    }
  } catch (error) {
    console.error('發生錯誤', error)
  }
}
