import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Toast } from 'antd-mobile';
import MyNavBar from '../../components/Navbar';
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
    const [activeIndex, setActiveIndex] = useState(0)
    const myRef = useRef()
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
                <div onClick={() => { changCity(item) }} className="name" key={item.value}>{item.label}</div>
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
        setTimeout(() => {
            myRef.current.measureAllRows() // 提前计算每一行的高度,解决下面的bug跳转可能出现的问题   
        });
    }, [])

    const gotoLine = (e) => {
        setActiveIndex(e)

        myRef.current.scrollToRow(e) // 跳转的内容,需要可见,刚开始直接跳到最后可能出问题
    }
    const renderCityIndex = () => {
        return cityIndex.map((item, index) =>
            <li key={item} className="city-index-item" onClick={() => gotoLine(index)}>
                <span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
            </li>
        )
    }
    // 展示区信息
    const onRowsRendered = ({ startIndex, endIndex }) => {
        if (startIndex !== activeIndex) setActiveIndex(startIndex) // 避免不必要更新
    }
    // 切换城市信息
    const changCity = e => {
        const arr = ['北京', '上海', '广州', '深圳']
        console.log(e)
        if (!arr.includes(e.label)) {
            Toast.fail('该城市没有房源噢!', 2)
        } else {
            localStorage.setItem("city", JSON.stringify({
                label: e.label,
                value: e.value
            }))
            history.go(-1)
        }
    }
    return (
        <div className="city-room ">
            <MyNavBar title="城市选择" goTop />
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={myRef}
                        width={width}
                        height={height}
                        rowCount={cityIndex.length}
                        rowHeight={getRowHeight}
                        scrollToAlignment="start" //  点击索引出现在最顶部
                        onRowsRendered={onRowsRendered} // 
                        rowRenderer={rowRenderer}
                    />
                )}
            </AutoSizer>
            <ul className="city-index">
                {renderCityIndex()}
            </ul>
        </div >
    )
}