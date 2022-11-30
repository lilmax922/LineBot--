import axios from 'axios'
import * as cheerio from 'cheerio'
import tempTopic from '../templates/temp_topic.js'
import writejson from '../utils/writejson.js'

export default async (event) => {
  try {
    let name = ''
    const topicArr = [{ chi: '最新', eng: 'new', url: 'new' }, { chi: '!最新 英雄聯盟', eng: '!new lol', url: 'lol' }, { chi: '!最新 綜合遊戲討論', eng: '!new gaming', url: 'gaming' }, { chi: '!最新 Apex英雄', eng: '!new apex', url: 'apexleagues' }, { chi: '!最新 寶可夢', eng: '!new pokemon', url: 'pokemon' }, { chi: '!最新 鬥陣特工', eng: '!new overwatch', url: 'overwatch' }, { chi: '!最新 steam', eng: '!new steam', url: 'steam' }, { chi: '!最新 聯盟戰旗', eng: '!new tft', url: 'TFT' }, { chi: '!最新 遊戲王', eng: '!new yugioh', url: 'yugioh' }, { chi: '!最新 爐石戰記', eng: '!new hs', url: 'hs' }, { chi: '!最新 激鬥峽谷', eng: '!new lolm', url: 'lolm' }, { chi: '!最新 特戰英豪', eng: '!new valorant', url: 'valorant' }, { chi: '!最新 傳說對決', eng: '!new aov', url: 'moba' }, { chi: '!最新 俠盜獵車手', eng: '!new gta', url: 'gta' }, { chi: '!最新 絕地求生', eng: '!new pubg', url: 'PUBG' }, { chi: '!最新 絕對武力CS:GO', eng: '!new csgo', url: 'csgo' }, { chi: '!最新 手遊綜合討論', eng: '!new mobilegame', url: 'mobileGame' }, { chi: '!最新 福利', eng: '!new hso', url: 'hotchick' }, { chi: '!最新 八卦新聞', eng: '!new gossiping', url: 'gossiping' }, { chi: '!最新 休閒娛樂', eng: '!new funny', url: 'funny' }, { chi: '!最新 電影', eng: '!new movie', url: 'movie' }, { chi: '!最新 寵物', eng: '!new pet', url: 'pet' }, { chi: '!最新 動漫', eng: '!new acg', url: 'acg' }, { chi: '!最新 3C', eng: '!new 3c', url: '3c' }, { chi: '!最新 運動', eng: '!new sport', url: 'sport' }, { chi: '!最新 迷因', eng: '!new meme', url: 'meme' }]

    for (let i = 0; i < topicArr.length; i++) {
      // console.log(topicArr[i])
      if (event.message.text === topicArr[i].chi || event.message.text === topicArr[i].eng) {
        name = topicArr[i].url
        break
      }
    }
    console.log(name)
    const { data } = await axios.get('https://www.league-funny.com/' + name + '/new')
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
