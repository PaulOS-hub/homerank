import React, { useState, useMemo, useEffect, useReducer, createContext } from 'react'
import { Route, useHistory, Redirect } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { renderRoutes } from '../../route/renderRoute'
import { tabList } from './constant'
import './index.scss'


export default function Home(props) {
    const history = useHistory()
    const { pathname } = history.location
    const [selectedTab, setSelectedTab] = useState('')
    const [hidden, setHidden] = useState(false)
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
        <div className="home">
            {/* <Route exact path="/home" component={Index}></Route>
            <Route path="/home/news" component={News}></Route>
            <Route path="/home/list" component={HouseList}></Route>
            <Route path="/home/profile" component={Profile}></Route>
            <Route path="/home/map" component={Map}></Route> */}
            {renderRoutes(props.routes || [])}
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
    )
}