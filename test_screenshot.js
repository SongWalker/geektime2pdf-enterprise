const puppeteer = require('puppeteer');
const path = require('path');
const utils = require('./utils');

// 测试调用python脚本

(async function () {
    let browser, page;
    try {
        browser = await puppeteer.launch({
            //   headless: false
        });
        page = await browser.newPage();
        await page.goto('https://www.jb51.net/article/139808.htm');
        await page.setViewport({ width: 1920, height: 1080 });
        const documentSize = await page.evaluate(() => {
            return {
                width: document.documentElement.clientWidth,
                height: document.body.clientHeight,
            }
        })
        await page.screenshot({ path: './download/example.png', clip: { x: 0, y: 0, width: 1920, height: documentSize.height } });
        // 关闭浏览器资源
        await page.close();
        await browser.close();
        utils.LogSucess("PDF 生成成功")
    } catch (err) {
        utils.Log('Generater PDF 生成失败', err);
        page ? page.close() : '';
        browser ? browser.close() : '';
    };
})()