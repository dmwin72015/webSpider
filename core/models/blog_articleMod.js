module.exports = {
    "tableName": "blog_article",
    "charset": "utf8",
    "attributes": {
        "ID": {
            "colName": "ID",
            "type": "bigint",
            "size": "20",
            "canNull": false,
            "autoIncrement": true,
            "unique": false,
            "sDefault": null
        },
        "arti_name": {
            "colName": "arti_name",
            "type": "varchar",
            "size": "255",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": ""
        },
        "arti_author_id": {
            "colName": "arti_author_id",
            "type": "bigint",
            "size": "20",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0"
        },
        "arti_author_name": {
            "colName": "arti_author_name",
            "type": "varchar",
            "size": "60",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": ""
        },
        "arti_textcontent": {
            "colName": "arti_textcontent",
            "type": "text",
            "size": 0,
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": null
        },
        "arti_htmlcontent": {
            "colName": "arti_htmlcontent",
            "type": "text",
            "size": 0,
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": null
        },
        "arti_sorce": {
            "colName": "arti_sorce",
            "type": "varchar",
            "size": "100",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": ""
        },
        "arti_status": {
            "colName": "arti_status",
            "type": "int",
            "size": "5",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0"
        },
        "arti_label": {
            "colName": "arti_label",
            "type": "varchar",
            "size": "255",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": ""
        },
        "arti_cate_id": {
            "colName": "arti_cate_id",
            "type": "int",
            "size": "5",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0"
        },
        "arti_cate_name": {
            "colName": "arti_cate_name",
            "type": "varchar",
            "size": "100",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": ""
        },
        "arti_editor": {
            "colName": "arti_editor",
            "type": "varchar",
            "size": "255",
            "canNull": true,
            "autoIncrement": false,
            "unique": false,
            "sDefault": null
        },
        "arti_from": {
            "colName": "arti_from",
            "type": "varchar",
            "size": "255",
            "canNull": true,
            "autoIncrement": false,
            "unique": false,
            "sDefault": null
        },
        "pub_time": {
            "colName": "pub_time",
            "type": "datetime",
            "size": 0,
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0000-00-00 00: 00: 00"
        },
        "last_edit_time": {
            "colName": "last_edit_time",
            "type": "datetime",
            "size": 0,
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0000-00-00 00: 00: 00"
        },
        "read_permission": {
            "colName": "read_permission",
            "type": "int",
            "size": "5",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0"
        },
        "read_num": {
            "colName": "read_num",
            "type": "bigint",
            "size": "20",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0"
        },
        "like_num": {
            "colName": "like_num",
            "type": "bigint",
            "size": "20",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0"
        },
        "unlike_num": {
            "colName": "unlike_num",
            "type": "bigint",
            "size": "20",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0"
        },
        "hot": {
            "colName": "hot",
            "type": "bigint",
            "size": "20",
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0"
        },
        "create_time": {
            "colName": "create_time",
            "type": "datetime",
            "size": 0,
            "canNull": false,
            "autoIncrement": false,
            "unique": false,
            "sDefault": "0000-00-00 00: 00: 00"
        }
    }
}
