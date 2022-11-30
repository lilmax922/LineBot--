import axios from 'axios'
import * as cheerio from 'cheerio'
import tempTopic from '../templates/temp_topic.js'
import writejson from '../utils/writejson.js'

export default async (event) => {
  try {
    let name = ''
    const topicArr = [{ chi: '熱門', eng: 'hot', url: 'hot' }, { chi: '最新', eng: 'new', url: 'new' }, { chi: '英雄聯盟', eng: 'lol', url: 'lol' }, { chi: '綜合遊戲討論', eng: 'gaming', url: 'gaming' }, { chi: 'Apex英雄', eng: 'apex', url: 'apexleagues' }, { chi: '寶可夢', eng: 'pokemon', url: 'pokemon' }, { chi: '鬥陣特工', eng: 'overwatch', url: 'overwatch' }, { chi: 'steam', eng: 'steam', url: 'steam' }, { chi: '聯盟戰旗', eng: 'tft', url: 'TFT' }, { chi: '遊戲王', eng: 'yugioh', url: 'yugioh' }, { chi: '爐石戰記', eng: 'hs', url: 'hs' }, { chi: '激鬥峽谷', eng: 'lolm', url: 'lolm' }, { chi: '特戰英豪', eng: 'valorant', url: 'valorant' }, { chi: '傳說對決', eng: 'aov', url: 'moba' }, { chi: '俠盜獵車手', eng: 'gta', url: 'gta' }, { chi: '絕地求生', eng: 'pubg', url: 'PUBG' }, { chi: '絕對武力CS:GO', eng: 'csgo', url: 'csgo' }, { chi: '手遊綜合討論', eng: 'mobilegame', url: 'mobileGame' }, { chi: '福利', eng: 'hso', url: 'hotchick/' }, { chi: '八卦新聞', eng: 'gossiping', url: 'gossiping' }, { chi: '休閒娛樂', eng: 'funny', url: 'funny' }, { chi: '電影', eng: 'movie', url: 'movie' }, { chi: '寵物', eng: 'pet', url: 'pet' }, { chi: '動漫', eng: 'acg', url: 'acg' }, { chi: '3C', eng: '3c', url: '3c' }, { chi: '運動', eng: 'sport', url: 'sport' }, { chi: '迷因', eng: 'meme', url: 'meme' }]

    for (let i = 0; i < topicArr.length; i++) {
      if (event.message.text === topicArr[i].chi || event.message.text === topicArr[i].eng) {
        name = topicArr[i].url
        break
      }
    }
    const { data } = await axios.get('https://www.league-funny.com/' + name || 'https://www.league-funny.com/s/' + event.message.text)
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
