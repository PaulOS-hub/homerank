import React, { useEffect, useContext, useState, useRef } from 'react'
import MyNavBar from '../Navbar'
import { Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../../config'
import { get } from '../../utils/http/axios'
import { AppContext } from '../../store/context'
import './index.scss'
import { func } from 'assert-plus'
// import styles from './index.module.scss' // 模块css用法,以obj方式引用
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}
export default function Map(props) {
    // const { dispatch, state } = useContext(AppContext);
    const myref = useRef()
    const [housesList, setHousesList] = useState([])
    const [isShowList, setIsShowList] = useState(false)
    //

    // 获取小区房源数据
    async function getHousesList(id) {
        try {
            // 开启loading
            Toast.loading('加载中...', 0, null, false)

            const { body } = await get('/houses', {
                cityId: id
            })
            // 关闭 loading
            Toast.hide()

            setHousesList(body.list)
            setIsShowList(true)

        } catch (e) {
            // 关闭 loading
            Toast.hide()
        }
    }

    // 封装渲染房屋列表的方法
    function renderHousesList() {
        return housesList.map(item => (
            <div className="house" key={item.houseCode}>
                <div className="imgWrap">
                    <img
                        className="img"
                        src={BASE_URL + item.houseImg}
                        alt=""
                    />
                </div>
                <div className="content">
                    <h3 className="title">{item.title}</h3>
                    <div className="desc">{item.desc}</div>
                    <div>
                        {/* ['近地铁', '随时看房'] */}
                        {item.tags.map((tag, index) => {
                            // const tagClass = 'tag' + (index + 1)
                            return (
                                <span
                                    className={['tag', 'tag' + (index + 1)].join(' ')}
                                    key={tag}
                                >
                                    {tag}
                                </span>
                            )
                        })}
                    </div>
                    <div className="price">
                        <span className="priceNum">{item.price}</span> 元/月
                    </div>
                </div>
            </div>
        ))
    }

    // 创建区、镇覆盖物
    function createCircle(point, name, count, id, zoom) {

        // 创建覆盖物
        const label = new window.BMapGL.Label('', {
            position: point,
            offset: new window.BMapGL.Size(-35, -35)
        })

        // 给 label 对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`
      <div class="bubbless">
        <p class="namess">${name}</p>
        <p>${count}套</p>
      </div>
    `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', () => {
            // 调用 renderOverlays 方法，获取该区域下的房源数据
            renderOverlays(id)
            // 放大地图，以当前点击的覆盖物为中心放大地图
            myref.current.centerAndZoom(point, zoom)

            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
            setTimeout(() => {
                // 清除当前覆盖物信息
                myref.current.clearOverlays()
            }, 0)
        })

        // 添加覆盖物到地图中
        myref.current.addOverlay(label)
    }

    // 创建小区覆盖物
    function createRect(point, name, count, id, zoom) {
        const label = new window.BMapGL.Label('', {
            position: point,
            offset: new window.BMapGL.Size(-50, -28)
        })

        // 给 label 对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`
      <div class="rect">
        <span class="housename">${name}</span>
        <span class="housenum">${count}套</span>
        <i class="arrow"></i>
      </div>
    `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', e => {
            // 获取并渲染房源数据
            getHousesList(id)

            // 获取当前被点击项
            console.log(e)
            // console.log(e.changedTouches)
            // const target = e.changedTouches[0]
            // myref.current.panBy(
            //     window.innerWidth / 2 - target.clientX,
            //     (window.innerHeight - 330) / 2 - target.clientY
            // )
        })

        // 添加覆盖物到地图中
        myref.current.addOverlay(label)
    }

    function createOverlays(data, zoom, type) {

        const BMap = window.BMap
        const {
            coord: { longitude, latitude },
            label: areaName,
            count,
            value
        } = data

        // 创建坐标对象
        const areaPoint = new window.BMapGL.Point(longitude, latitude)


        if (type === 'circle') {
            // 区或镇
            createCircle(areaPoint, areaName, count, value, zoom)
        } else {
            // 小区
            createRect(areaPoint, areaName, count, value)
        }
    }

    async function renderOverlays(id) {
        try {

            Toast.loading('加载中...', 0, null, false)
            const { body } = await get('/area/map', {
                id
            })
            Toast.hide()

            // 调用 getTypeAndZoom 方法获取级别和类型
            const { nextZoom, type } = getTypeAndZoom()
            body.forEach(item => {
                // 创建覆盖物
                createOverlays(item, nextZoom, type)
            })
        } catch (error) {
            Toast.hide()

        }
    }

    function initMap() {
        // 获取当前定位城市
        const BMap = window.BMap
        const BMapGL = window.BMapGL
        const { label, value } = JSON.parse(localStorage.getItem('city'))
        // console.log(label, value)
        // 初始化地图实例
        const map = new window.BMapGL.Map('container');
        // 作用：能够在其他方法中通过 props 来获取到地图对象
        myref.current = map
        // 创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,
            async point => {
                if (point) {
                    //  初始化地图
                    map.centerAndZoom(point, 11)
                    // 添加常用控件
                    map.addControl(new BMapGL.NavigationControl())
                    map.addControl(new BMapGL.ScaleControl())
                    // 调用 renderOverlays 方法
                    renderOverlays(value)
                }
            },
            label
        )
        // 给地图绑定移动事件
        map.addEventListener('movestart', () => {
            if (isShowList) {
                setIsShowList(false)
            }
        })
    }

    function getTypeAndZoom() {
        const zoom = myref.current.getZoom() // 默认11
        let nextZoom, type
        if (zoom >= 10 && zoom < 12) {
            type = 'circle'
            nextZoom = 13
        } else if (zoom >= 12 && zoom < 14) {
            nextZoom = 15
            type = "circle"
        } else if (zoom >= 14 && zoom < 16) {
            type = "rect"  // 矩形
        }
        return {
            type,
            nextZoom
        }
    }


    useEffect(async () => {
        initMap()
    }, [])
    return (
        <div className="map">
            <MyNavBar title="地图找房" />
            {/* 地图容器 */}
            <div id="container">
            </div>
            <div
                className={[
                    'houseList',
                    isShowList ? 'show' : ''
                ].join(' ')}
            >
                <div className="titleWrap">
                    <h1 className="listTitle">房屋列表</h1>
                    <Link className="titleMore" to="/home/list">
                        更多房源
                    </Link>
                </div>

                <div className="houseItems">
                    {/* 房屋结构 */}
                    {renderHousesList()}
                </div>
            </div>
        </div>
    )
}