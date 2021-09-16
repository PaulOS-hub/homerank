import React, { useState, useEffect } from 'react'
import Search from '../../components/Search/Search'
import Sticky from '../../components/Sticky'
import { useHistory } from 'react-router'
import { NavBar, Toast } from 'antd-mobile'
import HouseItem from '../../components/HouseItem'
import Filter from './components/Filter'
// list 窗口宽, 跟随页面滚动, 无限加载
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'; //导入list组件
import './index.scss'
import { get } from '../../utils/http/axios'
import { getCityInfo } from '../../utils/utils'
import { useSpring, animated } from 'react-spring'
import { an1 } from '../../utils/utils'
export default function HouseList() {
    const history = useHistory()
    const [canFlow, setCanFlow] = useState(true)
    const cityName = getCityInfo().label
    const [count, setCount] = useState(0)
    const [filters, setFilters] = useState({})
    const [houseList, setHouseList] = useState([])

    useEffect(() => {
        // 页面滚动到顶部,为啥没用呢?
        window.scroll(0, 0)
        console.log("滚动")
    }, [houseList])
    // 接受filter组件筛选的条件的数据
    const onFilter = async (filters) => {
        setFilters(filters)
        Toast.loading('加载中...', 0, null, false)
        const { body } = await get("/houses", {
            ...filters,
            cityId: getCityInfo().value,
            start: 1,
            end: 20
        })
        // console.log(body)
        setHouseList(body.list)
        setCount(body.count) // 总数
        Toast.hide()
        if (body.count) {
            Toast.info(`共找到${body.count}套房源`, 2, null, false)
        } else {
            Toast.info(`暂无房源`, 2, null, false)
        }
    }
    const setFlow = e => {
        setCanFlow(e)
    }
    const animation1 = useSpring(an1)
    // 判断列表中每一行,是否加载完成
    const isRowLoaded = ({ index }) => {
        return !!houseList[index] //因为 !null !undefined 为true, 所以用 !! => 强制转换，就是减少了判断null undefin的的过程，有值就true ，没有就false
    }
    const changeHouse = item => {
        const { houseCode } = item // 房源id

        /**
         * 路由传参
         * 与Vue 相反。 react中query相当于post格式，params相当于get形式
         * 有一个特殊，state，与query相似，但刷新地址栏时，参数不丢失，query会丢失
         * this.props.history.push({pathname:'/demo',query/state:{name:'dahuang'}})
         *  */
        history.push({
            pathname: `/home/detail/${houseCode}`
        })
    }
    // 加载更多项
    const loadMoreRows = ({ startIndex, stopIndex }) => {
        // 返回值 promise ,数据加载完成时来调用
        return new Promise(resolve => {
            get("/houses", {
                ...filters,
                cityId: JSON.parse(localStorage.getItem("city")).value,
                start: startIndex,
                end: stopIndex
            }).then(res => {
                setHouseList(houseList => {
                    const data = JSON.parse(JSON.stringify(houseList))
                    const newData = [...data, ...res.body.list]
                    return newData
                })
                console.log(houseList)
                //数据加载完成时来调用
                resolve()
            })
        })
    }
    const rowRenderer = ({
        key,
        index,
        // isScrolling, //滚动就true,停止就为false
        // isVisable, //当前项在list中可见
        style, //指定每一行的位置
    }) => {
        const house = houseList[index]
        return house ? <HouseItem changeHouse={changeHouse} house={house} key={key} style={style} /> : <div key={key} style={style}><p className="loading">123</p></div>
    }
    return (
        <div className="main-list" style={{ overflow: canFlow ? 'auto' : 'hidden' }}>
            <div className="header-list">
                <NavBar
                    style={{ background: "#f5f6f5", }}
                    icon={<i className="iconfont icon-back" style={{ color: "#333", fontSize: '14px' }} />}
                    onLeftClick={() => history.go(-1)}
                >
                    <Search classNamess={'searchlist'} cityName={cityName} />
                </NavBar>
            </div>
            <Sticky height={36}>
                <Filter setFlow={setFlow} onFilter={onFilter}></Filter>
            </Sticky>
            {
                count === 0 ? <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ marginTop: '30%' }}>
                        <svg t="1631673340384" className="icon" viewBox="0 0 1576 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1731" width="200" height="200"><path d="M1260.533 834.866h-134.81l9.387-15.697c6.31-11.08 9.388-23.7 9.388-37.088V168.82c0-19.698-7.849-37.858-21.237-52.016-13.389-13.388-32.318-21.237-52.016-21.237H567.093c-19.698 0-37.857 7.849-52.015 21.237-14.158 14.158-21.237 32.318-21.237 52.016v32.317h-73.253c-19.698 0-37.858 7.849-52.016 21.238-14.158 14.158-22.006 32.317-22.006 52.015v612.338c0 12.62 3.078 25.238 9.387 37.088l9.388 15.697H251.92c-5.54 0-10.31 4.77-10.31 10.31 0 2.31 0.77 5.541 3.232 7.08 1.539 1.539 4.77 3.078 7.079 3.078h533.545l54.324 54.324c5.54 5.54 14.158 9.387 22.006 9.387 7.849 0 16.62-3.078 22.007-9.387 10.31-10.311 11.85-26.008 4.77-38.627l-9.387-16.62h129.27c5.54 0 10.31-4.771 10.31-10.311s-4.77-10.311-10.31-10.311h-30.01l9.388-15.697c6.31-11.08 9.388-23.7 9.388-37.088v-32.318h263.156c5.54 0 10.31-4.77 10.31-10.31 0.154-4.156-4.616-8.157-10.156-8.157z m-283.624 52.016c0 29.086-23.7 52.785-52.785 52.785h-70.945l-73.252-74.022c-7.849-7.849-19.699-11.08-30.01-7.849l-6.309 1.54-30.778-30.78 5.54-7.078c42.628-57.556 33.856-138.657-19.699-186.056-53.554-47.245-135.579-44.167-186.055 7.079-50.477 50.476-52.786 132.347-6.31 186.825 46.475 53.555 127.73 63.096 184.363 20.468l7.08-5.54 30.778 30.778-1.54 6.31c-3.077 11.08 0 22.93 7.85 30.778l29.085 29.086H419.665c-29.086 0-52.786-23.7-52.786-52.785V273.775c0-28.317 22.93-52.016 51.247-52.016h507.537c28.316 0 51.246 23.7 51.246 52.016v613.107z m-286.086-65.404c-22.93 22.93-52.016 33.856-82.025 33.856s-59.094-11.08-82.024-33.856c-21.853-21.7-34.01-51.247-33.857-82.025 0-30.779 11.85-60.634 33.857-82.025 22.006-22.006 51.246-33.856 82.024-33.856s59.864 11.85 82.025 33.856c22.007 22.007 33.856 51.246 33.856 82.025s-11.85 60.018-33.856 82.025z m433.36-40.166c0.001 29.085-23.698 52.785-52.784 52.785h-74.022V274.544c0-19.698-7.849-37.857-21.238-52.016-13.388-13.388-32.317-21.237-52.015-21.237H514.308v-31.548c0-29.085 23.7-52.785 52.785-52.785h504.46c29.085 0 52.785 23.7 52.785 52.785v611.569zM167.436 940.436H41.397c-5.54 0-10.31 4.771-10.31 10.311 0 3.078 0.769 5.54 3.077 7.08 1.539 1.538 4.77 3.077 7.08 3.077H167.28c5.54 0 10.31-4.77 10.31-10.31s-3.846-10.158-10.156-10.158z m0 0" p-id="1732" fill="#8a8a8a"></path><path d="M482.76 327.33h230.993c5.54 0 10.31-4.772 10.31-10.312s-4.77-10.31-10.31-10.31H482.76c-5.54 0-10.31 4.77-10.31 10.31 0 2.309 0.77 5.54 3.078 7.08 1.692 2.462 4.77 3.231 7.232 3.231z m336.563 85.102H482.76c-5.54 0-10.31 4.77-10.31 10.31 0 3.078 0.77 5.54 3.078 7.08 1.538 1.538 4.77 3.077 7.079 3.077h336.562c5.54 0 10.311-4.77 10.311-10.31 0-5.387-4.77-10.157-10.157-10.157z m-189.288 105.57H482.607c-5.54 0-10.311 4.77-10.311 10.31 0 3.078 0.77 5.54 3.078 7.08 1.539 1.539 4.77 3.077 7.079 3.077h147.429c5.54 0 10.31-4.77 10.31-10.31s-4.616-10.157-10.157-10.157zM157.278 707.905h21.237c5.54 0 10.311 4.77 10.311 10.31s-4.77 10.312-10.31 10.312h-21.238v21.237c0 5.54-4.77 10.31-10.31 10.31-3.079 0-5.54-0.769-7.08-3.077-2.308-1.54-3.078-4.771-3.078-7.08V728.68h-21.39c-5.54 0-10.311-4.77-10.311-10.31s4.77-10.311 10.31-10.311h21.237v-21.237c0-5.54 4.771-10.311 10.311-10.311s10.311 4.77 10.311 10.31v21.084z m1387.032-85.102v-21.238c0-3.231-0.77-5.54-3.078-7.079-2.308-1.539-4.77-3.078-7.079-3.078-5.54 0-10.31 4.771-10.31 10.311v21.237h-21.238c-3.077 0-5.54 0.77-7.079 3.232-1.539 2.309-3.231 4.77-3.231 7.08 0 5.54 4.77 10.31 10.31 10.31h21.238v21.237c0 5.54 4.77 10.31 10.31 10.31s10.311-4.77 10.311-10.31V643.27h21.237c5.54 0 10.311-4.77 10.311-10.31s-4.77-10.311-10.31-10.311h-21.392zM267.62 47.553h31.548c8.618 0 15.697 7.079 15.697 15.697s-7.08 15.697-15.697 15.697h-31.548v31.548c0 8.618-7.08 15.697-15.697 15.697-4.001 0-7.849-1.54-11.08-4.77-3.078-2.31-4.771-6.31-4.771-11.081V79.1h-31.548c-4.001 0-7.849-1.54-11.08-4.771-3.078-2.308-4.77-6.31-4.77-11.08 0-8.618 7.078-15.697 15.696-15.697h31.548V16.005c0-8.618 7.08-15.697 15.697-15.697s15.697 7.079 15.697 15.697v31.548zM62.634 274.544c-22.93 0-43.397 11.85-54.324 31.548-11.08 19.698-11.08 44.167 0 63.096 11.08 19.698 32.318 31.548 54.324 31.548 34.626 0 63.096-28.316 63.096-63.096s-28.47-63.096-63.096-63.096z m27.547 79.562c-5.54 9.388-15.697 15.697-27.547 15.697-17.39 0-31.548-14.158-31.548-31.548s14.158-31.547 31.548-31.547c11.08 0 21.237 6.31 27.547 15.697 5.54 9.695 5.54 21.39 0 31.701z m1275.306-205.754c-22.93 0-43.397 11.85-54.324 31.548-11.08 19.698-11.08 44.167 0 63.096 11.08 19.698 32.318 31.548 54.324 31.548 34.626 0 63.096-28.316 63.096-63.096-0.154-34.626-27.7-63.096-63.096-63.096z m27.547 78.793c-5.54 9.388-15.697 15.697-27.547 15.697-17.39 0-31.548-14.158-31.548-31.548s14.158-31.548 31.548-31.548c11.08 0 22.007 6.31 27.547 15.697 5.54 9.696 5.54 22.315 0 31.702z m0 0" p-id="1733" fill="#8a8a8a"></path></svg>
                    </div>
                </div> : <InfiniteLoader
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    minimumBatchSize={15} // 一次加载数据
                    rowCount={count}
                >
                    {
                        ({ onRowsRendered, registerChild }) => (
                            <WindowScroller >
                                {
                                    ({ height, isScrolling, scrollTop }) =>
                                    (
                                        <AutoSizer >
                                            {({ width }) => (
                                                <List
                                                    ref={registerChild}
                                                    onRowsRendered={onRowsRendered}
                                                    autoHeight // 真正高度
                                                    width={width} // 视口宽度
                                                    height={height} //视口高度
                                                    rowCount={count}
                                                    rowHeight={120}
                                                    isScrolling={isScrolling}
                                                    scrollTop={scrollTop}
                                                    rowRenderer={rowRenderer}
                                                />
                                            )}
                                        </AutoSizer>
                                    )
                                }
                            </WindowScroller>
                        )
                    }
                </InfiniteLoader>
            }
        </div >
    )
}
