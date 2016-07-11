/**
 * Created by mjj on 16/7/10.
 */
module.exports = {
    tableName: 'blog_movie',
    charset: 'UTF-8',
    attributes: {
        id: {
            colName: 'id',
            type: 'integer',
            unique: true,
            canNull:false,
            autoIncrement:true,
            size: 20,
            primaryKey:true,
            comment:'主键ID'
        },
        cn_name: {
            colName: 'mov_cn_name',
            type: 'string',
            // unique:true,
            size: 255,
            isNull: false,
            comment: '中文名字'
        },
        en_name: {
            colName: 'mov_en_name',
            type: 'string',
            size: 255,
            comment: '英文名字'
        },
        year: {
            colName: 'mov_year',
            type: 'string',
            size: 50,
            comment: '上映年代'
        },
        country: {
            colName: 'mov_country',
            type: 'string',
            size: 50,
            desc: '国家'
        },
        language: {
            colName: 'mov_language',
            type: 'string',
            size: 50,
            comment: '语言'
        },
        IMDB: {
            colName: 'mov_IMDb',
            type: 'string',
            size: 50,
            comment: '评分'
        },
        fileType: {
            colName: 'mov_fileType',
            type: 'string',
            size: 50,
            comment: '文件类型'
        },
        resolution: {
            colName: 'mov_fileResolution',
            type: 'string',
            size: 50,
            comment: '分辨率'
        },
        fileSize: {
            colName: 'mov_fileSize',
            type: 'string',
            size: 50,
            comment: '电影文件大小'
        },
        showTime: {
            colName: 'mov_showTime',
            type: 'string',
            size: 50,
            comment: '电影时长'
        },
        director: {
            colName: 'mov_director',
            type: 'string',
            length: 200,
            comment:'导演'
        },
        actor: {
            colName: 'mov_leadActor',
            type: 'string',
            length: 200,
            comment:'领衔主演'
        },
        summary: {
            colName: 'mov_summary',
            type: 'text',
            size: 200,
            comment:'简介'
        },
        awards: {
            colName: 'mov_awards',
            type: 'string',
            length: 50,
            comment:'获奖'
        },
        download: {
            colName: 'mov_downloadUrl',
            type: 'string',
            length: 2000,
            comment:'下载地址'
        },
        fromSite: {
            colName: 'mov_srcUrl',
            type: 'string',
            size: 2000,
            comment:'来源网址'
        },
        createTime: {
            colName: 'create_date',
            type: 'datetime',
            default: 'now()',
            comment:'创建时间'
        }
    },
    primaryKey:['id']
};
