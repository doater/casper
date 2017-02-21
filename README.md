#web自动化测试#
## 简介 ##
利用[casper.js](http://casperjs.org/)框架，结合phantom.js、chai模拟用户对网页进行一系列的操作，来完成测试。

## 功能 ##
对web项目进行自动化测试

## 使用 ##
**环境依赖**

1. 安装[python](https://www.python.org/)，并配置环境变量
2. 安装[phantomjs](https://www.npmjs.com/package/phantomjs)
3. 安装[node](https://nodejs.org/en/)


目录结构
	
    /
	|——data/ 放置测试结果
	|——project/ 项目地址
    	|——web/ 待测试项目
		|——test/ 自动化测试项目
			|——case/ 测试案例放置位置
			|——lib/  测试基本架构脚本
			|——example.js 示例


1. 进入test目录，运行`npm install`，安装项目依赖

2. 在项目之外创建一个目录用于输出测试结果，如

    /data

3. 目录结构

    测试脚本放于case目录下，按执行顺序通过数字作为前缀进行编号

4. 执行测试命令，必须切换到case所在目录下进行

    casperjs test ./case/1.login/1.login.js --host=192.168.1.183 --port=80 --out=/data/testing

    casperjs test 后面跟的是要测试的脚本

    --host 要测试的服务端地址

    --port 要测试的服务端端口

    --out 测试结果输出目录

    可选参数

    --token 用户token，用户测试需要登录的页面


    