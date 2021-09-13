# react-hooks 租房 H5 移动端 apps

## .env .env.development介绍
项目开发中配置的环境变量,代码获取时通过process.env.DEV_BASE_URL来获取，配置成功，重启app

## 流程 前端
yarn install
yarn start

## 流程 后端

拉取 server 代码至本地,启动 mysql,执行 sql 文件  

### 功能这块基本涉及部分百度地图 API 目前版本 V0.3 , 持续开发中

城市联动组件 参考 react-virtualized
![](https://s3.bmp.ovh/imgs/2021/09/d9ce12c008e6311d.png)
![](https://s3.bmp.ovh/imgs/2021/09/38e076a78de60c96.png)

### 地图找房功能完善 V1.0

根据当前定位,进入地图找房功能,通过 api 聚合解聚功能,层次寻找从区到街道 小区等,可查看房源信息等功能
![](https://s3.bmp.ovh/imgs/2021/09/500fd3a93407e2f4.png)
![](https://s3.bmp.ovh/imgs/2021/09/49e7365311ea52e4.png)
[![4pssCn.md.png](https://z3.ax1x.com/2021/09/12/4pssCn.md.png)](https://imgtu.com/i/4pssCn)
