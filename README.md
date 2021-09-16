# react-hooks 租房 H5 移动端 apps （curVersion V0.6）持续开发
（... 仍在努力开发中，太多了，持续更新功能。剩余登录模块和路由权限为主）
## .env .env.development介绍
项目开发中配置的环境变量,代码获取时通过process.env.DEV_BASE_URL来获取，配置成功，重启app
## 流程 前端
yarn install
yarn start
## 流程 后端
拉取 server 代码至本地,启动 mysql,执行 sql 文件  https://github.com/PaulOS-hub/rankhome-server
### 功能这块基本涉及部分百度地图 API 目前版本 V0.3 , 持续开发中
城市联动组件 参考 react-virtualized，参考文档实现。（有部分问题未能解决，滚动未能加载， window.scroll未能奏效，后续解决）
### 地图找房功能完善 V1.0
根据当前定位,进入地图找房功能,通过 api 聚合解聚功能,层次寻找从区到街道 小区等,可查看房源信息等功能

### 房屋详情页的编写实现
已完成。

#### 预览截图
![](https://s3.bmp.ovh/imgs/2021/09/cac9b019c877c18b.png)