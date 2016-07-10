/**
 * Created by mjj on 16/7/10.
 */
exports.movie = {
    tableName: 'blog_movie',
    charset: 'UTF-8',
    attributes: {
        id: {
            colName: 'id',
            type: 'integer',
            unique: true,
            length: 20,
            primaryKey: true
        },
        cn_name: {
            colName: 'mov_cn_name',
            type: 'string',
            // unique:true,
            length: 255,
            isNull: false,
            desc: '中文名字'
        },
        en_name: {
            colName: 'mov_en_name',
            type: 'string',
            length: 255,
            desc: '英文名字'
        },
        year: {
            colName: 'mov_year',
            type: 'string',
            length: 50,
            desc: '上映年代'
        },
        country: {
            colName: 'mov_country',
            type: 'string',
            length: 50,
            desc: '国家'
        },
        language: {
            colName: 'mov_language',
            type: 'string',
            length: 50,
            desc: '语言'
        },
        IMDB: {
            colName: 'mov_IMDb',
            type: 'string',
            length: 50,
            desc: '评分'
        },
        fileType: {
            colName: 'mov_fileType',
            type: 'string',
            length: 50,
            desc: '文件类型'
        },
        resolution: {
            colName: 'mov_fileResolution',
            type: 'string',
            length: 50,
            desc: '分辨率'
        },
        fileSize: {
            colName: 'mov_fileSize',
            type: 'string',
            length: 50,
            desc: '电影文件大小'
        },
        showTime: {
            colName: 'mov_showTime',
            type: 'string',
            length: 50,
            desc: '电影时长'
        },
        director: {
            colName: 'mov_director',
            type: 'string',
            length: 200
        },
        actor: {
            colName: 'mov_leadActor',
            type: 'string',
            length: 200
        },
        summary: {
            colName: 'mov_summary',
            type: 'string',
            length: 200
        },
        awards: {
            colName: 'mov_awards',
            type: 'string',
            length: 50
        },
        download: {
            colName: 'mov_downloadUrl',
            type: 'string',
            length: 2000
        },
        fromSite: {
            colName: 'mov_srcUrl',
            type: 'string',
            length: 2000
        },
        createTime: {
            colName: 'create_date',
            type: 'datetime',
            default: 'now()'
        }
    }
};
