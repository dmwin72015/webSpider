/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50524
Source Host           : localhost:3306
Source Database       : dongmin

Target Server Type    : MYSQL
Target Server Version : 50524
File Encoding         : 65001

Date: 2016-06-22 18:47:53
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blog_admin_menu
-- ----------------------------
DROP TABLE IF EXISTS `blog_admin_menu`;
CREATE TABLE `blog_admin_menu` (
  `ID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(100) NOT NULL DEFAULT '',
  `menu_level` int(5) NOT NULL DEFAULT '1',
  `menu_parentID` int(5) NOT NULL DEFAULT '0',
  `menu_status` int(5) NOT NULL DEFAULT '0',
  `menu_permission` int(5) NOT NULL DEFAULT '1',
  `menu_url` varchar(100) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `create_userID` int(10) NOT NULL DEFAULT '0',
  `create_userlogin` varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_admin_users
-- ----------------------------
DROP TABLE IF EXISTS `blog_admin_users`;
CREATE TABLE `blog_admin_users` (
  `ID` bigint(20) unsigned NOT NULL DEFAULT '0',
  `user_login` varchar(60) NOT NULL DEFAULT '',
  `user_pass` varchar(255) NOT NULL DEFAULT '',
  `user_nicename` varchar(50) NOT NULL DEFAULT '',
  `user_email` varchar(100) NOT NULL DEFAULT '',
  `user_url` varchar(100) NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_roleID` int(5) NOT NULL DEFAULT '0',
  `user_rolename` varchar(100) NOT NULL DEFAULT '',
  `user_activation_key` varchar(255) NOT NULL DEFAULT '',
  `user_status` int(5) NOT NULL DEFAULT '0',
  `display_name` varchar(250) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_area_f
-- ----------------------------
DROP TABLE IF EXISTS `blog_area_f`;
CREATE TABLE `blog_area_f` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country` varchar(20) NOT NULL,
  `country_code` varchar(10) NOT NULL DEFAULT '',
  `name1` varchar(100) DEFAULT NULL,
  `code1` varchar(10) DEFAULT NULL,
  `name2` varchar(100) DEFAULT NULL,
  `code2` varchar(10) DEFAULT NULL,
  `name3` varchar(100) DEFAULT NULL,
  `code3` varchar(10) DEFAULT NULL,
  `name4` varchar(100) DEFAULT NULL,
  `code4` varchar(10) DEFAULT NULL,
  `name5` varchar(100) DEFAULT NULL,
  `code5` varchar(10) DEFAULT NULL,
  `create_date` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`,`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6906 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_article
-- ----------------------------
DROP TABLE IF EXISTS `blog_article`;
CREATE TABLE `blog_article` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `arti_name` varchar(255) NOT NULL DEFAULT '',
  `arti_author_id` bigint(20) NOT NULL DEFAULT '0',
  `arti_author_name` varchar(60) NOT NULL DEFAULT '',
  `arti_textcontent` text NOT NULL,
  `arti_htmlcontent` text NOT NULL,
  `arti_sorce` varchar(100) NOT NULL DEFAULT '',
  `arti_status` int(5) NOT NULL DEFAULT '0',
  `arti_label` varchar(255) NOT NULL DEFAULT '',
  `arti_cate_id` int(5) NOT NULL DEFAULT '0',
  `arti_editor` varchar(255) DEFAULT NULL,
  `arti_cate_name` varchar(100) NOT NULL DEFAULT '',
  `arti_from` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `pub_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last_edit_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `read_permission` int(5) NOT NULL DEFAULT '0',
  `read_num` bigint(20) unsigned NOT NULL DEFAULT '0',
  `like_num` bigint(20) unsigned NOT NULL DEFAULT '0',
  `unlike_num` bigint(20) unsigned NOT NULL DEFAULT '0',
  `hot` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_article_label
-- ----------------------------
DROP TABLE IF EXISTS `blog_article_label`;
CREATE TABLE `blog_article_label` (
  `ID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `label_name` varchar(100) NOT NULL DEFAULT '',
  `label_description` varchar(255) NOT NULL DEFAULT '',
  `label_status` int(5) NOT NULL DEFAULT '0',
  `label_style` varchar(255) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `create_userID` int(10) NOT NULL DEFAULT '0',
  `create_userlogin` varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_category
-- ----------------------------
DROP TABLE IF EXISTS `blog_category`;
CREATE TABLE `blog_category` (
  `ID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `cate_name` varchar(100) NOT NULL DEFAULT '',
  `cate_description` varchar(255) NOT NULL DEFAULT '',
  `label_personal` int(5) NOT NULL DEFAULT '0',
  `cate_status` int(5) NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `create_userID` int(10) NOT NULL DEFAULT '0',
  `create_userlogin` varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_reply_msg
-- ----------------------------
DROP TABLE IF EXISTS `blog_reply_msg`;
CREATE TABLE `blog_reply_msg` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `article_title` varchar(255) NOT NULL DEFAULT '',
  `reply_content` text NOT NULL,
  `reply_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `reply_userID` bigint(20) NOT NULL DEFAULT '0',
  `reply_userName` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_users
-- ----------------------------
DROP TABLE IF EXISTS `blog_users`;
CREATE TABLE `blog_users` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(60) NOT NULL DEFAULT '',
  `user_pass` varchar(255) NOT NULL DEFAULT '',
  `user_nicename` varchar(50) NOT NULL DEFAULT '',
  `user_email` varchar(100) NOT NULL DEFAULT '',
  `user_url` varchar(100) NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_roleID` int(5) NOT NULL DEFAULT '0',
  `user_rolename` varchar(100) NOT NULL DEFAULT '',
  `user_activation_key` varchar(255) NOT NULL DEFAULT '',
  `user_status` int(5) NOT NULL DEFAULT '0',
  `display_name` varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`),
  KEY `user_login_key` (`user_login`),
  KEY `user_nicename` (`user_nicename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_user_group
-- ----------------------------
DROP TABLE IF EXISTS `blog_user_group`;
CREATE TABLE `blog_user_group` (
  `ID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(60) NOT NULL DEFAULT '',
  `group_description` text,
  `group_roleID` int(5) NOT NULL DEFAULT '0',
  `group_rolename` varchar(100) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `create_userID` int(10) NOT NULL DEFAULT '0',
  `create_userlogin` varchar(60) NOT NULL DEFAULT '',
  `group_status` int(5) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for blog_user_role
-- ----------------------------
DROP TABLE IF EXISTS `blog_user_role`;
CREATE TABLE `blog_user_role` (
  `ID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL DEFAULT '',
  `role_menu` text,
  `create_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `create_userID` int(10) NOT NULL DEFAULT '0',
  `create_userlogin` varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
