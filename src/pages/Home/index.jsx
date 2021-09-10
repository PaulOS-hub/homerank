import React, { useState, useMemo, useEffect, useReducer, createContext } from 'react'
import { Route, useHistory, Redirect } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { UPDATELOCATION } from './action'
import News from '../News'
import Index from '../Index'
import Map from '../../components/Map/Map'
import HouseList from '../HouseList'
import Profile from '../Profile'
import './index.scss'


const tabList = [{
    title: "首页",
    key: "home",
    icon: "iconfont icon-ind",
    currentPathname: "/home"
}, {
    title: "找房",
    key: "find",
    icon: "iconfont icon-findHouse",
    currentPathname: "/home/list"
}, {
    title: "资讯",
    key: "news",
    icon: "iconfont icon-infom",
    currentPathname: "/home/news"
}, {
    title: "我的",
    key: "my",
    icon: "iconfont icon-my",
    currentPathname: "/home/profile"
}]

const initalState = {
    longitude: null,
    latitude: null
}
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case UPDATELOCATION:
            return {
                ...state, longitude: action.data.longitude, latitude: action.data.latitude
            }
        default:
            return state
    }
}
export const AppContext = createContext();
// 这里对dispatch函数进行一个封装，使其支持处理异步action
// 简而言之就是判断传进来的action是不是Promise对象，如果是的话
// 先执行loading_start，将loading置为true
// 然后执行完成Promise后，将获得的结果执行一次action
// 再执行loading_end（实际项目中请求失败也应该执行loading_end，因项目而异，不展开了）
// 注意：这个loading是我项目中喜欢用的一个标志位，用来记录当前是不是处于请求中
// 因为经常需要有如果在请求中，按钮需要禁用，防止用户再点击这种需求
// 另外实际项目中,loading可以扩展成对象，记录各种异步请求的状态
function isPromise(obj) {
    return (
        !!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function"
    );
}

function wrapperDispatch(dispatch) {
    return function (action) {
        if (isPromise(action.payload)) {
            dispatch({ type: "loading_start" });
            action.payload.then(v => {
                dispatch({ type: action.type, payload: v });
                dispatch({ type: "loading_end" });
            });
        } else {
            dispatch(action);
        }
    };
}

export default function Home() {
    const history = useHistory()
    const { pathname } = history.location
    const [selectedTab, setSelectedTab] = useState('')
    const [hidden, setHidden] = useState(false)

    const [state, dispatch] = useReducer(reducer, initalState)

    useEffect(() => {
        // 渲染时获取pathname进行赋值
        setSelectedTab(pathname)
    }, [pathname])

    const renderTabItem = data => {
        return data.map(item =>
            <TabBar.Item
                title={item.title}
                key={item.key}
                icon={<i className={item.icon} />}
                selectedIcon={<i className={item.icon} />}
                selected={selectedTab === item.currentPathname}
                onPress={() => {
                    setSelectedTab(item.key)
                    history.push(item.currentPathname)
                }}
            >
            </TabBar.Item>
        )
    }
    return (
        <AppContext.Provider value={{ state, dispatch: wrapperDispatch(dispatch) }}>
            <div className="home">
                <Route exact path="/home" component={Index}></Route>
                <Route path="/home/news" component={News}></Route>
                <Route path="/home/list" component={HouseList}></Route>
                <Route path="/home/profile" component={Profile}></Route>
                <Route path="/home/map" component={Map}></Route>
                <div className="tabbar-class">
                    <TabBar
                        noRenderContent={true} // 不渲染内容
                        tintColor="#21b97a"  // 选中颜色
                        barTintColor="white" // 
                        hidden={hidden}
                    >
                        {renderTabItem(tabList)}

                    </TabBar>
                </div>
            </div>
        </ AppContext.Provider>
    )
}