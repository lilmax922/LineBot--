import axios from 'axios'
import * as cheerio from 'cheerio'
import tempTopic from '../templates/temp_topic.js'
import writejson from '../utils/writejson.js'

export default async (event) => {
  try {
    let name = ''
    const topicArr = [{ chi: '!含金 英雄聯盟', eng: '!golden lol', url: 'lol' }, { chi: '!含金 遊戲', eng: '!golden gaming', url: 'gaming' }, { chi: '!含金 apex英雄', eng: '!golden apex', url: 'apexleagues' }, { chi: '!含金 寶可夢', eng: '!golden pokemon', url: 'pokemon' }, { chi: '!含金 鬥陣特工', eng: '!golden overwatch', url: 'overwatch' }, { chi: '!含金 steam', eng: '!golden steam', url: 'steam' }, { chi: '!含金 聯盟戰旗', eng: '!golden tft', url: 'TFT' }, { chi: '!含金 遊戲王', eng: '!golden yugioh', url: 'yugioh' }, { chi: '!含金 爐石戰記', eng: '!golden hs', url: 'hs' }, { chi: '!含金 激鬥峽谷', eng: '!golden lolm', url: 'lolm' }, { chi: '!含金 特戰英豪', eng: '!golden valorant', url: 'valorant' }, { chi: '!含金 傳說對決', eng: '!golden aov', url: 'moba' }, { chi: '!含金 俠盜獵車手', eng: '!golden gta', url: 'gta' }, { chi: '!含金 絕地求生', eng: '!golden pubg', url: 'PUBG' }, { chi: '!含金 csgo', eng: '!golden csgo', url: 'csgo' }, { chi: '!含金 手遊', eng: '!golden mobilegame', url: 'mobileGame' }, { chi: '!含金 福利', eng: '!golden hso', url: 'hotchick/' }, { chi: '!含金 八卦', eng: '!golden gossiping', url: 'gossiping' }, { chi: '!含金 娛樂', eng: '!golden funny', url: 'funny' }, { chi: '!含金 電影', eng: '!golden movie', url: 'movie' }, { chi: '!含金 寵物', eng: '!golden pet', url: 'pet' }, { chi: '!含金 動漫', eng: '!golden acg', url: 'acg' }, { chi: '!含金 3c', eng: '!golden 3c', url: '3c' }, { chi: '!含金 運動', eng: '!golden sport', url: 'sport' }, { chi: '!含金 迷因', eng: '!golden meme', url: 'meme' }]

    for (let i = 0; i < topicArr.length; i++) {
      if (event.message.text === topicArr[i].chi || event.message.text === topicArr[i].eng) {
        name = topicArr[i].url
        break
      }
    }
    const { data } = await axios.get('https://www.league-funny.com/' + name + '/golden')
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
      writejson(reply, 'debug_articles')
    }
  } catch (error) {
    console.error('發生錯誤', error)
  }
}
