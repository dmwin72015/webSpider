/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50524
Source Host           : localhost:3306
Source Database       : dongmin

Target Server Type    : MYSQL
Target Server Version : 50524
File Encoding         : 65001

Date: 2016-08-05 14:26:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dong_steps
-- ----------------------------
DROP TABLE IF EXISTS `dong_steps`;
CREATE TABLE `dong_steps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `sourceName` varchar(255) DEFAULT NULL,
  `walks` float(11,8) DEFAULT NULL,
  `steps` int(11) DEFAULT NULL,
  `unit` varchar(255) CHARACTER SET latin1 DEFAULT '',
  `sourceVersion` varchar(255) DEFAULT NULL,
  `device` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `creationDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19519 DEFAULT CHARSET=utf8;
