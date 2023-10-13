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
    cookie: 'gksskpitn=908bf2ee-4c46-499f-82ae-bcd2808220ce; LF_ID=83d7253-b698316-83856d6-589270e; _ga=GA1.2.1016051202.1695278798; _gid=GA1.2.1053038184.1695278798; GCID=f2209b9-0822581-2b07032-59263c8; GRID=f2209b9-0822581-2b07032-59263c8; _ga_WK6J6CS6FN=GS1.2.1695278798.1.0.1695278798.60.0.0; GCESS=BgUEAAAAAAIE7.YLZQoEAAAAAAQEAI0nAAcEJW86uAYEmgUhzAwBAQgBAwkBEQsCBgADBO_mC2UNAQEBCJ11NwAAAAAA; __tea_cache_tokens_20000743={%22web_id%22:%224008438091212154413%22%2C%22user_unique_id%22:%223634589%22%2C%22timestamp%22:1695280466223%2C%22_type_%22:%22default%22}; SERVERID=3431a294a18c59fc8f5805662e2bd51e|1695280468|1695278795'
};
