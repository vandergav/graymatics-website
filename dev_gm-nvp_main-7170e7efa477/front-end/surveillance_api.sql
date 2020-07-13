-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 31, 2018 at 10:38 AM
-- Server version: 5.7.20-0ubuntu0.17.04.1
-- PHP Version: 5.6.32-1+ubuntu17.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `surveillance_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `basic_notification`
--

CREATE TABLE `basic_notification` (
  `_id` varchar(300) NOT NULL,
  `user_id` int(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `media_type` varchar(50) NOT NULL,
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `basic_notification`
--

INSERT INTO `basic_notification` (`_id`, `user_id`, `type`, `status`, `media_type`, `start_time`) VALUES
('006d921d9649f99fe4c6e187d24df190', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:19:59'),
('05c7eca2dcef8367ed1fcc88e572b0d0', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:26:59'),
('16c1ebcc09a937d9bd3f6ccd5e6527d6', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:18:27'),
('1d1233920146ac44d203ab8d4b09d142', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 14:56:26'),
('1d6caf65bdb77bb09c626cb1fe98eb23', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:00'),
('2098df75dd49a56b77f9bed587f822d7', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:04'),
('22d946ad7847718252684c10ea7cd39a', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:06'),
('23979cc4c86080c1b1957836c3c7aa51', 22, 'People_Count', 'pending', 'video', '2018-05-03 17:09:56'),
('283a4379fc8134edb76434a766d25089', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:15:11'),
('2ac4e81e3efb9ed8972e6d045537800c', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:19:57'),
('38e7e2f87478d56119a89e8a0e93e256', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:07'),
('3c21f223bc50429da011648fba62e58f', 22, 'People_Count', 'pending', 'video', '2018-05-03 15:58:48'),
('441f309ee892df54279b01a0abd33b14', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:09'),
('4492226bc1d47955cb9f36a00bf74b92', 22, 'People_Count', 'pending', 'video', '2018-05-03 17:07:18'),
('4b9e6fff0476f50cc68c9a6876bd5cf2', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 14:56:57'),
('4da366f52d8b5f74fc1a459c597f0b14', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:18:37'),
('4e4aa2a8b75466f11b1aefe080eed1e6', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:00'),
('53f664ed77e83f68bf0485e7e85eff8d', 22, 'People_Count', 'pending', 'video', '2018-05-03 17:11:41'),
('55ec45c0ad6c1751b6bb92104f8c0a03', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 14:59:57'),
('5b977c01f32fb2908f5e46c43cbc160b', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:15:18'),
('5ec942c75dcd76c27b671838131ce46f', 22, 'People_Count', 'pending', 'video', '2018-05-03 17:11:30'),
('5efe98f3641b34d15d7160148826b723', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:22:10'),
('64f09106f4833534bc5538f172ad775d', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:06'),
('681159c4064693453020cc499460cabc', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:19:58'),
('6dbff58201f3b303b6fc23fdbf971840', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 14:56:46'),
('6ebacbe4e58ad6134d71b1d448a48659', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 14:56:51'),
('7086d37a720dd78dad853aad7585c9a5', 22, 'People_Count', 'pending', 'video', '2018-05-03 17:10:55'),
('7802d0d9926d285ba22fcc0cb1d30f7d', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 14:56:47'),
('7c505a9998ee80a35ce3a7bb90cd6c2c', 22, 'People_Count', 'pending', 'video', '2018-05-03 15:43:23'),
('7e3c25fc44fad2bf157b447221c13ccf', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:19:57'),
('87c963a34b98930bf0b1a25e34f1b633', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:05'),
('87daae51dbc7b2558de13b951c446177', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:28:49'),
('8807006c142d71c34ee964ea77aff026', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 14:56:32'),
('8af735bcd57ad66e1afb15addf75e2c6', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:00:05'),
('936b7c34e8ab41578461f606783604bd', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:26'),
('98d270f7041d7dd344aef0c317ebc5af', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:15:20'),
('9e5d31c5235df84bd5382033d86db537', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:47:45'),
('a673ab5fb889b340787570be2d3d2b15', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:51:42'),
('adbb518ea43d8ea447383c52ba43e879', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:09'),
('ae3952dd87d7005f865e0ce603a34ef3', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:02'),
('ae6806afeebde94919eeba98d2819d9d', 22, 'People_Count', 'pending', 'video', '2018-05-03 15:49:29'),
('b7cd1c4b266a7629bac7f625543cfc80', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:18:34'),
('bfbc5f935d12e567c60cf2ffc8059f51', 22, 'People_Count', 'pending', 'video', '2018-05-03 17:11:23'),
('c3af516ca3348bdbaa1c27a987586faa', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:00:16'),
('c7ed3e5edc600a8cfd1e8e1d1234fa02', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:48:04'),
('caea48477897f1292dd5402312c660f3', 22, 'People_Count', 'pending', 'video', '2018-05-03 15:55:18'),
('d28efcfefb861e3251e115241748326c', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:04'),
('d7131c590961c38f3ffc3f0703daaebe', 22, 'People_Count', 'pending', 'video', '2018-05-03 15:45:27'),
('d97ed7e11aa84ae9f4b284b99b7469e9', 22, 'People_Count', 'pending', 'video', '2018-05-03 17:14:44'),
('dc4ab20faa2491d5cac252814defc431', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:50:30'),
('df6155009147d87f761fd3d52f9177ba', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:18:34'),
('dfbfa5255b4886ee64888ba73e3d0e79', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:12'),
('edd6cc66cb250facecaa40a96f28b467', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:20:03'),
('f4a447442edcdaa9856c4ac3570716a8', 22, 'Vehicle_Count', 'pending', 'camera', '2018-05-03 15:00:11'),
('f84673061287f56cf6f51a91e7b625ef', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:52:29'),
('f973002c60db4d639799e5d88ac9dfec', 22, 'People_Count', 'pending', 'video', '2018-05-03 16:32:39'),
('fa462eac79ad84a7c8b70176828f83f4', 22, 'People_Count', 'pending', 'video', '2018-05-03 17:09:51');

-- --------------------------------------------------------

--
-- Table structure for table `camera`
--

CREATE TABLE `camera` (
  `camera_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `source` varchar(4000) DEFAULT NULL,
  `protocol` varchar(100) DEFAULT NULL,
  `interface` varchar(500) DEFAULT NULL,
  `channel` varchar(2000) DEFAULT NULL,
  `fps` varchar(100) DEFAULT NULL,
  `algo` json DEFAULT NULL,
  `parameters` varchar(2000) DEFAULT NULL,
  `addi_info` varchar(500) DEFAULT NULL,
  `roi` json DEFAULT NULL,
  `frame` varchar(2000) DEFAULT NULL,
  `people_whitelist` varchar(200) DEFAULT NULL,
  `people_blacklist` varchar(200) DEFAULT NULL,
  `vehicle_whitelist` varchar(200) DEFAULT NULL,
  `vehicle_blacklist` varchar(200) DEFAULT NULL,
  `created_dtime` datetime DEFAULT NULL,
  `modified_dtime` datetime DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `agent` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `company_name` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `user_type` varchar(45) DEFAULT NULL,
  `mobile_number` varchar(45) DEFAULT NULL,
  `user_password` varchar(250) DEFAULT NULL,
  `user_email_confirmation_code` varchar(45) DEFAULT NULL,
  `user_registration_complete` varchar(45) DEFAULT NULL,
  `parent` int(11) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `user_email` varchar(250) DEFAULT NULL,
  `create_dtime` datetime DEFAULT NULL,
  `user_email_confirmed` varchar(45) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `update_dtime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `company_name`, `username`, `user_type`, `mobile_number`, `user_password`, `user_email_confirmation_code`, `user_registration_complete`, `parent`, `status`, `user_email`, `create_dtime`, `user_email_confirmed`, `last_login`, `update_dtime`) VALUES
(1, NULL, 'dev', 'user_type', '9898999999', '$2a$10$tZE08mu.ee2fEwey2oVk3.WsZKU8WPpRUzy4Wm9UfgHMOQeI9Q8Li', '08eeeb006cd901d0389129335b772744', 'Y', 0, NULL, 'dev@gmail.com', '2017-06-29 21:18:15', 'Y', NULL, '2017-08-06 15:28:56'),
(2, NULL, 'user', 'user_type', '9898999999', '$2a$10$BxzHyuROJMoPmjyJHVJMW.7flE6za9/mcYN9fVf/.2mIpEMB0aMj6', 'd39d02bc5fc021495422ef30250abb00', 'Y', 0, NULL, 'user@gmail.com', '2017-06-30 10:10:20', 'Y', NULL, NULL),
(3, 'graymatics', 'dev123', 'admin', NULL, '$2a$10$umKLYMTGqvnFkNLlg3/CKO.UCderCP7yxAbtVAquUziG9IPm.QkUm', '345e2747869983c220fff262844753e2', 'Y', 0, NULL, 'tosudhakarg@gmail.com', '2017-06-30 10:28:04', 'Y', '2017-07-05 11:25:33', '2017-07-28 11:01:16'),
(4, 'gm_banglr', 'dev_user', 'admin', NULL, '$2a$10$8ybcW3M58t3jmFU71Bvzkekmlz7M6a5HJbRip6ykaERiON4V8iLFq', '14ad6c07fc11d6639192f5c1c09ca469', 'Y', 0, NULL, 'dev_user@gmail.com', '2017-07-20 16:18:49', 'Y', '2017-07-25 15:31:07', '2017-07-27 15:38:03'),
(5, 'gm_flipkart', 'gm_flipkart', 'admin', NULL, '$2a$10$DF3Df9muSJ2/6LEQhZFwOu5zoacmR7Y/THej8pd5rZdY7YIUDMhh.', '0883e7da9517b5f1bf4a6ddfba1a23b0', 'Y', 0, NULL, 'gm_flipkart@gmail.com', '2017-07-21 11:09:13', 'Y', NULL, '2017-07-21 11:09:31'),
(6, 'gm_dev', 'gm_dev', 'admin', NULL, '$2a$10$j3mpfSfv2V9LCjRxOYgD0ukuWTgixgs8JLwHQKA6NMdLlacLuT4zO', 'c7071cc59f0533cff2b9667e00ea670b', 'Y', 0, NULL, 'gm_dev@gmail.com', '2017-07-24 14:22:21', 'Y', NULL, NULL),
(7, 'gm_dev_user', 'gm_dev_user', 'admin', NULL, '$2a$10$5D3wKAm7JnOkouxIkizdi.5MBWsRBkCfnwj2LvcAKoCYi35JjrmdW', 'ff391c5c55bda84a5ae53c91ca3bdab4', 'Y', 0, NULL, 'gm_dev_user@gmail.com', '2017-07-24 14:34:42', 'Y', '2017-07-31 11:07:34', '2017-07-27 12:11:40'),
(8, 'gm_dev_user1', 'gm_dev_user1', 'admin', NULL, '$2a$10$y9I8M1RyGI3G9TSmoUBs1uIY0FiGKLkxDAQIoSlzQJqrT5gj7XcpO', '20da9bac5e903b67e029eb07b1c5e3a2', 'Y', 0, NULL, 'sudha.mpc+01@gmail.com', '2017-07-25 15:39:30', 'Y', '2017-07-25 16:16:28', '2017-07-26 19:39:33'),
(9, 'gm_dev_user+1', 'gm_dev_user+1', 'admin', NULL, '$2a$10$I9nTapNW7cxMJLvpHOIJseMXC.EjttxvZkCO6rqJGXSAHpxXmn9Mq', '4cee6940aa8b2bd0b9931fc23d611d94', 'Y', 0, NULL, 'gm_dev_user+1@gmail.com', '2017-07-25 16:29:43', 'Y', NULL, NULL),
(10, 'gm_banglr_1', 'gm_banglr_1', 'admin', NULL, '$2a$10$VBbIDvUHyi3NmGBTST4L.OcHDN0isMqkqz0ug0s9UflAgBHmXRPf2', 'a0a6793ecd5be20bcadd290bf587b3cc', 'Y', 0, NULL, 'gm_banglr_1@gmail.com', '2017-07-25 16:33:51', 'Y', NULL, NULL),
(11, 'dev_user_2', 'dev_user_2', 'admin', NULL, '$2a$10$KNxTknbnZaym8aUvtNGIR.TR/VmwBBa2RTJvyjZplbCuRco4Rbg/K', 'aa7acc22e5ffd00ac0e0da45570f80bd', 'Y', 0, NULL, 'dev_user_2@gmail.com', '2017-07-25 16:35:17', 'Y', NULL, NULL),
(12, 'sfsa', 'ssaf', 'admin', NULL, '$2a$10$OXkZq3IJSJUOZROB5G1enOKYYh6suWu6.uuJHu/Vlprd6jlzjUbYu', '94b772ecda6216f82cc793cd5ae1c22a', 'Y', 0, NULL, 'sadf', '2017-07-26 15:16:26', 'Y', NULL, NULL),
(13, 'gm_user_5', 'gm_user_5', 'admin', NULL, '$2a$10$6P7dvlYBCfoXCeG15FJlNuNrQR2Zrj5oVT2CVKNgLsXftcW7SI70q', '7fdc283dc71c2bba5c4800354d678c50', 'Y', 0, NULL, 'sudha.mpc+05@gmail.com', '2017-07-26 19:04:24', 'Y', NULL, NULL),
(14, 'gm_user_6', 'gm_user_6', 'admin', NULL, '$2a$10$zR33tqzDixyEZKQEOcXN5.ZmZNQRuVMbj9WJclnZURAMVJYW0qidW', '4f99ea9892828acad57a08924bf23a74', 'Y', 0, NULL, 'sudha.mpc+06@gmail.com', '2017-07-26 19:15:40', 'Y', NULL, NULL),
(15, 'gm_user_7', 'gm_user_7', 'admin', NULL, '$2a$10$1dbD2B1dAZUsnhvA0EClVu3HZJyLxNpSLX.4lUpeBTL8iRFA1svLG', '363380b0ee757db51af120abca9e2a61', 'Y', 0, NULL, 'sudha.mpc+07@gmail.com', '2017-07-26 19:16:25', 'Y', NULL, NULL),
(16, 'gm_user_8', 'gm_user_8', 'admin', NULL, '$2a$10$3mZdv9n/69eTwsYyYGFvYOIv9L.Evsswtx2BfHeerBjSPa/9GQZ26', '37e7a334b7f69acf308c876c255e40a8', 'Y', 0, NULL, 'sudha.mpc+08@gmail.com', '2017-07-26 19:20:46', 'Y', NULL, NULL),
(17, 'asfasf', 'safasf', 'admin', NULL, '$2a$10$./4z0vKPjSBDcQ2OuMDYvuzM.fvdxb3rshQCgvki4.okzyO1GM7g.', '8d13e9fed8fb5dafdb8c789d75f79575', 'Y', 0, NULL, 'safasdf', '2017-07-26 19:22:38', 'Y', NULL, NULL),
(18, 'sadfa', 'afafa', 'admin', NULL, '$2a$10$NhVb167J7oV/68bIdY9NmePYmDrEFeJrCpAR0Yz8bb0kBM939HyQ2', '0bbdca25f9697ea58ec15e3ccc75f2aa', 'Y', 0, NULL, 'sdfasf', '2017-07-26 19:24:10', 'Y', NULL, NULL),
(19, 'gm_user_3', 'gm_user_3', 'admin', NULL, '$2a$10$ugU32o0o/8Vjnbxn5Juce.zix1uKT091Doav7RjWBYhdKZV.lGh1y', '05e6fde30e43ae17d41cb8816aa0fd99', 'Y', 0, NULL, 'dev3@gmail.com', '2017-07-27 12:39:22', 'Y', NULL, NULL),
(20, 'gm_user_4', 'gm_user_4', 'admin', NULL, '$2a$10$/ZZNZR8mPdohOvi/lGhKFOmfM5sSyLW9VrFtWFXL7EiRjocawfXcC', '3071e85611fe41d4563ff0fa81b246e7', 'Y', 0, NULL, 'dev4@gmail.com', '2017-07-27 12:41:50', 'Y', NULL, NULL),
(21, 'gm_user_21', 'gm_user_21', 'admin', NULL, '$2a$10$2W/Is1W8EAu1.aHuQv4bzu/bgunGjTEp2Misf.jo4hrWzT7ObiZIa', 'f49d6f52712417e864cdcd1bc610cf87', 'Y', 0, NULL, 'dev21@gmail.com', '2017-07-27 12:43:53', 'Y', NULL, NULL),
(22, 'gm_user_22', 'gm_user_22', 'admin', NULL, '$2a$10$DeKz0nQOotZyCKJurv.vH.yyeDNPwMGzdqzU2skDnkREJiH81eMQW', 'cda5150f2a10d9fcc75f0a02929f7839', 'Y', 0, NULL, 'dev22@gmail.com', '2017-07-27 12:46:13', 'Y', '2018-02-28 12:21:24', NULL),
(23, 'gm_user_23', 'gm_user_23', 'admin', NULL, '$2a$10$8NwlhUCgtkB/GD116fT5OuEeBdxI67hceQLwpFi31OXvuiqhl6ymK', 'b7bcc30922ee9039c32cb94185931ff5', 'Y', 0, NULL, 'dev23@gmail.com', '2017-07-27 12:56:27', 'Y', NULL, NULL),
(24, 'gm_user_24', 'gm_user_24', 'admin', NULL, '$2a$10$zBRO7zFY8yhhSjnYlc/AruK9G.Ur/spmqzqKEoyhrnNe.ginVK2oi', '686025e6eeef347042179cb970413c63', 'Y', 0, NULL, 'dev24@gmail.com', '2017-07-28 11:00:41', 'Y', NULL, NULL),
(25, 'gm_user_25', 'gm_user_25', 'admin', NULL, '$2a$10$bYwvyBcrxNwMDFFYsgrTfea2FLpLhTNLxVVHC105PtoKw3MKn5tfW', 'eb88a7f3dfb065ab545cab8467a06c9a', 'Y', 0, NULL, 'dev25@gmail.com', '2017-07-28 11:27:08', 'Y', '2017-07-28 11:33:57', NULL),
(26, 'gm_user_26', 'gm_user_26', 'admin', NULL, '$2a$10$KqmZJRDRxwtgAOt3k6Pes.oe89tVHpS.TIgcJaAU1XxNm/cHaXlA.', 'd9f5b6b3f4e508ded0d81b1824629c3c', 'Y', 0, NULL, 'dev26@gmail.com', '2017-08-06 15:29:27', 'Y', '2017-08-06 15:29:43', NULL),
(27, 'gm_user_29', 'gm_user_29', 'admin', NULL, '$2a$10$nKr5Hx4s8R4p4xKM0zmPZ.VP4BbYnVVKmqSNCqhIEMsE7wB6IwDWK', 'addd2b87aa203c834364886a4b783ecd', 'Y', 0, NULL, 'gm_user_29@gmail.com', '2017-08-22 10:51:04', 'Y', NULL, NULL),
(28, 'graymatics', 'superviser', 'admin', NULL, '$2a$10$v5cvpW5/2XenADV/TJhVcO3ZPlYD4amQZBBWT7CjjyxhL/QNsptOq', '8a3c0a73f16dae05a2c00c88ef7ef55c', 'Y', 0, NULL, 'sudhakarag@gmail.com', '2017-08-31 15:34:59', 'Y', '2018-01-24 11:23:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `camera_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `source` varchar(4000) DEFAULT NULL,
  `protocol` varchar(500) DEFAULT NULL,
  `interface` varchar(500) DEFAULT NULL,
  `channel` varchar(2000) DEFAULT NULL,
  `fps` varchar(100) DEFAULT NULL,
  `algo` json DEFAULT NULL,
  `parameters` varchar(2000) DEFAULT NULL,
  `addi_info` varchar(500) DEFAULT NULL,
  `roi` json DEFAULT NULL,
  `frame` varchar(2000) DEFAULT NULL,
  `created_dtime` datetime DEFAULT NULL,
  `modified_dtime` datetime DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `agent` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`camera_id`, `user_id`, `name`, `type`, `source`, `protocol`, `interface`, `channel`, `fps`, `algo`, `parameters`, `addi_info`, `roi`, `frame`, `created_dtime`, `modified_dtime`, `status`, `agent`) VALUES
(1, 22, 'people', '', '/home/gmind/graymatics/development/videoProceesing/crp/ch05_20171231172453.mp4', '', 'onvif', NULL, '', '[\"person_tracking\"]', NULL, NULL, '[[315, 218.02868178994163], [733, 462.9111429914255]]', 'http://192.168.1.185:9000/smart-surveillance/live-api/22/1/frame/1.jpg', '2018-05-03 15:29:59', '2018-05-03 15:30:11', 'processing', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `basic_notification`
--
ALTER TABLE `basic_notification`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `camera`
--
ALTER TABLE `camera`
  ADD PRIMARY KEY (`camera_id`),
  ADD UNIQUE KEY `camera_id_UNIQUE` (`camera_id`),
  ADD KEY `cam_user_id_fk` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_id_UNIQUE` (`user_id`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`camera_id`),
  ADD UNIQUE KEY `video_id` (`camera_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `camera`
--
ALTER TABLE `camera`
  MODIFY `camera_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `camera_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `camera`
--
ALTER TABLE `camera`
  ADD CONSTRAINT `cam_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
