import axios from 'axios'
import * as cheerio from 'cheerio'
import tempTopic from '../templates/temp_topic.js'

const main = async () => {
  try {
    const { data } = await axios.get('https://www.league-funny.com/')
    const $ = cheerio.load(data)
    const articles = []
    $('.list .card').each(function (index) {
      if (index >= 12) return
      const bubble = JSON.parse(JSON.stringify(tempTopic))
      if ($(this).hasClass('video') || $(this).hasClass('article')) {
        // 圖片
        bubble.hero.url = $(this).find('.content-box .img img').attr('data-src') || '此篇無封面圖QQ'
        console.log('圖片:', bubble.hero.url)
        // 標題
        bubble.body.contents[0].text = $(this).find('.content-box .img a').attr('title') || $(this).find('.content-box .text h2 a:nth-child(2)').attr('title') || '此篇無標題QQ'
        console.log('標題:', bubble.body.contents[0].text)
        // 分類
        bubble.body.contents[1].contents[0].contents[0].text = $(this).find('.content-box .text a:nth-child(1)').text() || '此篇無分類QQ'
        console.log('分類:', bubble.body.contents[1].contents[0].contents[0].text)
        // 多久之前 post(未)
        // xx版
        bubble.body.contents[1].contents[1].contents[0].text = $(this).find('.content-box .member a:nth-child(2)').attr('title') || '此篇無相關版'
        console.log('xx版:', bubble.body.contents[1].contents[1].contents[0].text)
        // 文章簡介
        bubble.body.contents[2].contents[0].text = $(this).find('.content-box .list_post_description p').text() || '此篇無簡介QQ'
        console.log('文章簡介:', bubble.body.contents[2].contents[0].text)
        // 網址來源
        if ($(this).find('.content-box .img a').attr('href') === undefined) {
          bubble.footer.contents[0].action.uri = 'https://www.league-funny.com/' + $(this).find('.content-box .text h2 a:nth-child(2)').attr('href')
        } else {
          bubble.footer.contents[0].action.uri = 'https://www.league-funny.com/' + $(this).find('.content-box .img a').attr('href') || '此篇無網址來源QQ'
        }
        console.log('網址來源:', bubble.footer.contents[0].action.uri)
        articles.push(bubble)
        // console.log(articles)
      }
    })
  } catch (error) {
    console.error('發生錯誤', error)
  }
}
main()
