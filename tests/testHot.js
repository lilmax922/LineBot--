import axios from 'axios'
import * as cheerio from 'cheerio'
// import tempArticle from '../templates/temp_hot.js'
import tempHot from '../templates/temp_hot.js'

// const main = async (event) => {
//   try {
//     const { data } = await axios.get('https://www.league-funny.com/')
//     const $ = cheerio.load(data)
//     const articles = []
//     $('.list .card').each(function () {
//       if ($(this).hasClass('video') || $(this).hasClass('article')) {
//         articles.push({
//           img: $(this).find('.content-box .img img').attr('data-src'),
//           title: $(this).find('.content-box .img a').attr('title'),
//           topic: `[${$(this).find('.content-box .text a:nth-child(1)').text()}] ${$(this).find('.content-box .member a:nth-child(2)').attr('title')}`,
//           description: $(this).find('.content-box .list_post_description p').text() || '無詳細資料',
//           link: 'https://www.league-funny.com/' + $(this).find('.content-box .img a').attr('href')
//         })
//       }
//     })
//     console.log(articles)
//   } catch (error) {
//     console.error('發生錯誤')
//   }
// }
// main()

const main = async () => {
  try {
    const { data } = await axios.get('https://www.league-funny.com/')
    const $ = cheerio.load(data)
    const articles = []
    $('.list .card').each(function () {
      const bubble = JSON.parse(JSON.stringify(tempHot))
      if ($(this).hasClass('video') || $(this).hasClass('article')) {
        bubble.hero.url = $(this).find('.content-box .img img').attr('data-src')
        bubble.body.contents[0].text = $(this).find('.content-box .img a').attr('title')
        bubble.body.contents[1].contents[0].contents[0].text = `[${$(this).find('.content-box .text a:nth-child(1)').text()}] ${$(this).find('.content-box .member a:nth-child(2)').attr('title')}`
        bubble.body.contents[1].contents[1].contents[1].text = $(this).find('.content-box .list_post_description p').text() || '無詳細資料'
        bubble.footer.contents[0].action.uri = 'https://www.league-funny.com/' + $(this).find('.content-box .img a').attr('href')
        articles.push(bubble)
        console.log(articles)
      }
    })
  } catch (error) {
    console.error('發生錯誤')
  }
}
main()
