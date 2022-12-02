import axios from 'axios'
import * as cheerio from 'cheerio'
import tempTopic from '../templates/temp_topic.js'
import writejson from '../utils/writejson.js'

export default async (event) => {
  try {
    let name = ''
    const topicArr = [{ chi: '熱門', eng: 'hot', url: 'hot' }, { chi: '最新', eng: 'new', url: 'new' }, { chi: '!熱門 英雄聯盟', eng: '!hot lol', url: 'lol' }, { chi: '!熱門 遊戲', eng: '!hot gaming', url: 'gaming' }, { chi: '!熱門 apex英雄', eng: '!hot apex', url: 'apexleagues' }, { chi: '!熱門 寶可夢', eng: '!hot pokemon', url: 'pokemon' }, { chi: '!熱門 鬥陣特工', eng: '!hot overwatch', url: 'overwatch' }, { chi: '!熱門 steam', eng: '!hot steam', url: 'steam' }, { chi: '!熱門 聯盟戰旗', eng: '!hot tft', url: 'TFT' }, { chi: '!熱門 遊戲王', eng: '!hot yugioh', url: 'yugioh' }, { chi: '!熱門 爐石戰記', eng: '!hot hs', url: 'hs' }, { chi: '!熱門 激鬥峽谷', eng: '!hot lolm', url: 'lolm' }, { chi: '!熱門 特戰英豪', eng: '!hot valorant', url: 'valorant' }, { chi: '!熱門 傳說對決', eng: '!hot aov', url: 'moba' }, { chi: '!熱門 俠盜獵車手', eng: '!hot gta', url: 'gta' }, { chi: '!熱門 絕地求生', eng: '!hot pubg', url: 'PUBG' }, { chi: '!熱門 csgo', eng: '!hot csgo', url: 'csgo' }, { chi: '!熱門 手遊', eng: '!hot mobilegame', url: 'mobileGame' }, { chi: '!熱門 福利', eng: '!hot hso', url: 'hotchick/' }, { chi: '!熱門 八卦', eng: '!hot gossiping', url: 'gossiping' }, { chi: '!熱門 娛樂', eng: '!hot funny', url: 'funny' }, { chi: '!熱門 電影', eng: '!hot movie', url: 'movie' }, { chi: '!熱門 寵物', eng: '!hot pet', url: 'pet' }, { chi: '!熱門 動漫', eng: '!hot acg', url: 'acg' }, { chi: '3c', eng: '!hot 3c', url: '3c' }, { chi: '!熱門 運動', eng: '!hot sport', url: 'sport' }, { chi: '!熱門 迷因', eng: '!hot meme', url: 'meme' }]

    for (let i = 0; i < topicArr.length; i++) {
      // console.log(topicArr[i])
      if (event.message.text === topicArr[i].chi || event.message.text === topicArr[i].eng) {
        name = topicArr[i].url
        break
      }
    }
    const { data } = await axios.get('https://www.league-funny.com/' + name)
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
