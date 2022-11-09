
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');
const cheerio = require('cheerio');



var Fs = require('fs'),
request = require('request');

var Https = require('https')


let CONTENT;
let titles=[];
let links = [];
let refs = [];
async function fetchData(){
    await axios('https://www.superherodb.com/list-ben-10-aliens/800-1308/')
        .then(res => res.data)
        .then(data => CONTENT = data)
        .then(() => {
            const $ = cheerio.load(CONTENT);
            $('.name').each((_idx, el) => {
                const title = $(el).text()
                titles.push(title)
            });
            // console.log(titles)
        })
        .then(() => {
            const $ = cheerio.load(CONTENT);
            const link = $('a').attr('href')
            console.log(link)
            console.log($('.shdbcard3 cat-10 > a').text())
            $(' .image>img').each((_idx, el) => {
                const title = $(el).attr('src')
                refs.push(title)
            });
            console.log(refs)
            // for(let i =0;i<refs.length;i++){
            //             links.push(refs[i])
            //     }
            // console.log(links)
        })
        .then(async()=>{
            console.log(refs.length)
            for (let i = 0; i < refs.length; i++) {
                let text = "/010/";
                let result = refs[i].replace("/010/", "/050/");
                await downloadFile(`https://www.superherodb.com${result}`, `alien${i}.jpg`);
            }
        })
        .catch(err => console.log(err))
}

fetchData();

    /**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
    async function downloadFile(url, targetFile) {
        console.log(url)
        return await new Promise((resolve, reject) => {
            Https.get(url, response => {
                const code = response.statusCode ?? 0

                if (code >= 400) {
                    return reject(new Error(response.statusMessage))
                }

                // handle redirects
                if (code > 300 && code < 400 && !!response.headers.location) {
                    return downloadFile(response.headers.location, targetFile)
                }

                // save the file to disk
                const fileWriter = Fs
                    .createWriteStream(targetFile)
                    .on('finish', () => {
                        resolve({})
                    })

                response.pipe(fileWriter)
            }).on('error', error => {
                reject(error)
            })
        })
    }






//https://www.superherodb.com/pictures2/portraits/10/050/20701.jpg?v=1665128928