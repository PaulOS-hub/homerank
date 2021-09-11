import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { NavBar } from 'antd-mobile';
import { get } from '../../utils/http/axios'
import { formatCityData } from '../../utils/utils'
import Bus from '../../Events'
import { List, AutoSizer } from 'react-virtualized'; //导入list组件
import 'react-virtualized/styles.css'   //导入样式
import './index.scss'


const titleHeight = 36
const cityHeight = 50
export default function CityList() {
    const history = useHistory()
    const [list, setList] = useState(Array(100).fill('mmmm'))
    const [cityList, setCityList] = useState({})
    const [cityIndex, setCityIndex] = useState([])

    const rowRenderer = ({
        key,
        index,
        isScrolling, //滚动就true,停止就为false
        isVisable, //当前项在list中可见
        style, //指定每一行的位置
    }) => {

        let cur = cityIndex[index]
        return <div key={key} style={style} className="citys">
            <div className="title">{formatUtil(cur)}</div>
            {cityList[cur].map(item =>
                <div className="name" key={item.value}>{item.label}</div>
            )}
        </div>


    }
    const getRowHeight = ({ index }) => {
        return titleHeight + cityList[cityIndex[index]].length * cityHeight
    }

    const formatUtil = letter => {
        switch (letter) {
            case '#':
                return '当前定位'
            case 'hot':
                return '热门城市'
            default:
                return letter.toUpperCase()
        }
    }
    useEffect(async () => {
        const { body: hotcity } = await get('/area/hot') //热门城市
        const { body } = await get('/area/city', {
            level: 1
        })
        const { cityList, cityIndex } = formatCityData(body)
        cityList.hot = hotcity
        cityIndex.unshift('hot')
        const city = JSON.parse(localStorage.getItem('city'))// 当前
        cityList['#'] = [city]
        cityIndex.unshift('#')
        console.log(cityList)
        setCityList(cityList)
        setCityIndex(cityIndex)
    }, [])
    const renderCityIndex = () => {
        return cityIndex.map(item =>
            <li className="city-index-item">
                <span className="index-active">#</span>
            </li>
        )
    }
    return (
        <div className="city-room ">
            <NavBar
                style={{ background: "#f5f6f5", marginTop: '-45px' }}
                mode="light"
                icon={<i className="iconfont icon-back" style={{ color: "#333" }} />}
                onLeftClick={() => history.go(-1)}
            >城市选择</NavBar>
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        width={width}
                        height={height}
                        rowCount={cityIndex.length}
                        rowHeight={getRowHeight}
                        rowRenderer={rowRenderer}
                    />
                )}
            </AutoSizer>
            <ul>

            </ul>
        </div >
    )
}