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
export default function HouseList() {
    const history = useHistory()
    const [canFlow, setCanFlow] = useState(true)
    const cityName = getCityInfo().label
    const [count, setCount] = useState(0)
    const [filters, setFilters] = useState({})
    const [houseList, setHouseList] = useState([])
    // 接受filter组件筛选的条件的数据
    const onFilter = async (filters) => {
        console.log(filters,'filters')
        setFilters(filters)
        Toast.loading('加载中...', 0, null, false)
        const { body } = await get("/houses", {
            ...filters,
            cityId: getCityInfo().value,
            start: 1,
            end: 20
        })
        console.log(body)
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
    // 判断列表中每一行,是否加载完成
    const isRowLoaded = ({ index }) => {
        return !!houseList[index] //因为 !null !undefined 为true, 所以用 !! => 强制转换，就是减少了判断null undefin的的过程，有值就true ，没有就false
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
        return house ? <HouseItem house={house} key={key} style={style} /> : <div key={key} style={style}><p className="loading">123</p></div>
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
            <InfiniteLoader
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
        </div>
    )
}
