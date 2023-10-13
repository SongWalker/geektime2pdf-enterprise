// 获取专栏文章列表
const config = require('./config.js');
const superagent = require('superagent');
const utils = require('./utils');
const path = require('path');
const generaterPdf = require('./generaterPdf.js');
const downloadAudio = require('./downloadAudio.js');
const downloadComment = require('./downloadComment.js');
const mergePDF = require("./merge")

const userArg = process.argv; //获取用户输入的内容

/**
 * 执行方法
 */
(async function getColumnArticleList(firstArticalId, userArg) {
    if (userArg[2] != undefined) {
        let id = parseInt(userArg[2])
        if (id) {
            utils.Log('输入初始文章ID:', id)
            firstArticalId = id
        }
    }
    if (!firstArticalId) {
        utils.Log("请设置初始文章ID")
        return
    }
    utils.Log('专栏文章链接开始获取');
    let articalId = firstArticalId;
    let columnArticleUrlList = [];
    let index = 0
    let saveArticleDir
    let saveJsonDir
    let saveMp3Dir
    let savePdfDir
    let authorName

    async function init() {
        return new Promise(async (resolve) => {
            utils.Log("课程名称：", config.columnName)
            saveArticleDir = './download/article/geektime_' + config.columnName
            saveJsonDir = './download/json/geektime_' + config.columnName
            saveMp3Dir = './download/mp3/geektime_' + config.columnName
            savePdfDir = './download/pdf/'
            await utils.createDir(saveArticleDir);
            await utils.createDir(savePdfDir);
            await utils.createDir(saveJsonDir);
            if (config.isdownloadVideo) {
                await utils.createDir(saveMp3Dir);
            };
            resolve()
        });
    }

    async function getNextColumnArticleUrl() {
        try {
            let res = await superagent.post(config.url)
                .set({
                    'Content-Type': 'application/json',
                    'Cookie': config.cookie,
                    'Referer': config.columnBaseUrl + articalId,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
                }).send({
                    'article_id': articalId,
                    'id': articalId,
                    'include_neighbors': true
                });
            //console.log("课程详情", res.body);
            if (res.body && res.body.error && res.body.error.code) {
                utils.Log('数据读取错误', res.body.error.msg);
                throw new Error(res.body.error.msg);
            };
            //获取课程名称
            if (index == 0) {
                if (!config.columnName) {
                    let info = await superagent.post(config.infoUrl)
                        .set({
                            'Content-Type': 'application/json',
                            'Cookie': config.cookie,
                            'Referer': config.columnBaseUrl + articalId,
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
                        })
                        .send({
                            "id": res.body.data.pid,
                            "with_recommend_article": true
                        });
                    if (info.body && info.body.error && info.body.error.code) {
                        utils.Log("statusCode", info.statusCode)
                        utils.Log('课程信息读取失败', info.body);
                        throw new Error("课程信息读取失败");
                    };
                    //console.log("课程信息", info.body.data);
                    config.columnName = utils.ClearSaveName(info.body.data.title)
                }
                await init();
            }
            index++

            utils.Log(res.body.data.article.title);
            let columnArticle = res.body.data;
            //utils.Log("columnArticle", columnArticle);
            let articleInfo = {
                articleTitle: columnArticle.article.title, // 文章标题
                articalUrl: config.columnBaseUrl + articalId, // 文章地址
                articleContent: columnArticle.article.content, // 文章内容
                articleCover: columnArticle.article.cover, // 文章背景图
                authorName: columnArticle.author.name, // 文章作者
                articleCtime: utils.formatDate(columnArticle.article.ctime), // 文章创建时间 unix 时间戳 单位为 s
                articleNeighbors: columnArticle.article.relation,  //  上下篇文章信息
                audioDownloadUrl: columnArticle.audio_download_url,
                audioTitle: columnArticle.audio_title
            };
            if (!authorName) {
                authorName = columnArticle.author.name
            }
            columnArticleUrlList.push(articleInfo);
            articleInfo.commentsTotal = 0;
            articleInfo.commentsArr = [];
            // 是否导出评论
            if (config.isComment) {
                let { commentsTotal, commentsArr } = await downloadComment(
                    config.columnBaseUrl + articalId,
                    articalId);
                articleInfo.commentsTotal = commentsTotal;
                articleInfo.commentsArr = commentsArr;
            };
            // 替换文章名称的 / 线， 解决路径被分割的问题
            // let useArticleTtle = utils.ClearSaveName(utils.StrPad(index, 3) + '_' + columnArticle.article_title);
            let useArticleTtle = utils.ClearSaveName(utils.StrPad(index, 3) + '_' + articalId);
            //生成PDF
            await generaterPdf(articleInfo,
                useArticleTtle + '.pdf',
                path.resolve(__dirname, saveArticleDir)
            );
            // 是否下载音频
            if (config.isdownloadVideo && columnArticle.audio_download_url) {
                await downloadAudio(
                    columnArticle.audio_download_url,
                    useArticleTtle + '.mp3',
                    path.resolve(__dirname, saveMp3Dir)
                );
            };
            // 判断是否还有下一篇文章
            let nextId = columnArticle.article.relation.next_id;
            utils.Log("下一篇文章id:", nextId);
            if (nextId && nextId != "0") {
                articalId = nextId;
                let sleepTime = utils.GetRandInt(2, 6);
                utils.Log(`暂停${sleepTime}秒`);
                await utils.sleep(sleepTime);
                await getNextColumnArticleUrl();
            };
        } catch (err) {
            utils.Log(`访问地址 ${config.columnBaseUrl + articalId} 失败`, err);
        };
    };
    await getNextColumnArticleUrl(articalId);
    utils.Log('专栏文章处理完成，开始合并PDF文件');
    res = await mergePDF.ExecPy(saveArticleDir, [savePdfDir, authorName, "·", config.columnName, ".pdf"].join(""));
    utils.Log(res);
    utils.writeToFile(saveJsonDir, JSON.stringify(columnArticleUrlList, null, 4));
    utils.Log('json保存完毕')
    return columnArticleUrlList;
})(config.firstArticalId, userArg);