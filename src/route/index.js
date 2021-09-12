import React, { lazy } from 'react'
import asyncComponent from './asyncRoute'
const Home = asyncComponent(() => import("../pages/Home"))
const CityList = asyncComponent(() => import('../pages/CityList'))
const Map = asyncComponent(() => import('../components/Map/Map'))
const ErrorPage = asyncComponent(() => import('../pages/404'))
// 子路由
const News = asyncComponent(() => import('../pages/News'))
const Index = asyncComponent(() => import('../pages/Index'))
const HouseList = asyncComponent(() => import('../pages/HouseList'))
const Profile = asyncComponent(() => import('../pages/Profile'))

const routerConfig = [
    {
        path: "/cityList",
        component: CityList,
        exact: true
    },
    {
        path: "/",
        component: Home,
        children: [{
            path: "/home",
            component: Index,
            exact: true
        },
        {
            path: "/home/news",
            component: News
        },
        {
            path: "/home/list",
            component: HouseList

        }, {
            path: "/home/profile",
            component: Profile
        }, {
            path: "/home/map",
            component: Map
        }]
    },

]
export default routerConfig