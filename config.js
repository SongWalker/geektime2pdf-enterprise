/**
 * 需要转换为 pdf 的配置信息 
 */
module.exports = {
    url: 'https://b.geekbang.org/app/v1/article/detail', // 该配置项不需要改动
    infoUrl: 'https://b.geekbang.org/app/v1/course/info', // 该配置项不需要改动
    commentUrl: 'https://b.geekbang.org/app/v1/comments', // 该配置项不需要改动
    columnBaseUrl: 'https://b.geekbang.org/member/course/detail/', // 该配置项不需要改动
    firstArticalId: "160463", //专栏第一篇文章的ID
    columnName: '',//可不填，会自动获取
    isdownloadVideo: true, // 是否下载音频
    isComment: false, // 是否导出评论
    commentCount: 0, // 评论导出数量，最大20个
    cookie: '' //登录后从浏览器将cookie拷贝到此处
};
