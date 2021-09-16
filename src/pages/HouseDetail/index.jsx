import React, { useEffect, useState, useMemo, useRef } from 'react'
// useRouteMatch 用来匹配最接近route树的路由
/**
 * let match = useRouteMatch({
    path: '/BLOG/:slug/',
    strict: true,
    sensitive: true
  })
  匹配
  {match ? <BlogPost match={match} /> : <NotFound />}
 */
import { useHistory, useLocation, useRouteMatch, useParams } from 'react-router-dom'
import { Carousel, Toast } from 'antd-mobile'
import MyNavBar from '../../components/Navbar'
import FooterRoot from '../../components/FooterRoot'
import { BASE_URL } from '../../config'
import { get } from '../../utils/http/axios'
import { labelStyle, configure, info, imgUrl } from './const'
import './index.scss'

export default function HouseDetail() {
    const myref = useRef()
    const params = useParams()
    console.log(params)
    const history = useHistory() // 跳转
    const uselocation = useLocation() // 就是hitory的location
    const [curId, setCurId] = useState("") // 房屋ID
    const [houseInfo, setHouseInfo] = useState({}) // 房屋ID
    const getDetail = id => {
        return new Promise(async r => {
            const { body } = await get(`/houses/${id}`)
            r(body)
        })
    }
    const renderImgs = data => {
        return data.map(val => (
            <img
                key={val}
                src={BASE_URL + val}
                alt={val}
                style={{ width: '100%', verticalAlign: 'top', }}
                onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                }}
            />
        ))
    }
    const imgDoneflag = useMemo(() => {
        return houseInfo.houseImg && houseInfo.houseImg.length > 0
    }, [houseInfo])
    // 创建区、镇覆盖物
    const createCircle = (point, name, id) => {
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
      </div>
        `)
        // 设置样式
        label.setStyle(labelStyle)
        myref.current.addOverlay(label)
    }
    //
    const renderConfigure = data => {
        return data && data.map(item => {
            return <li key={item.id} className="configure-list">
                <div className="configure-icon">
                    <i className={['iconfont', 'icon-list', item.icon].join(' ')}></i>
                </div>
                <div className="configure-title">
                    {item.name}
                </div>
            </li>
        }
        )
    }
    useEffect(async () => {
        Toast.loading('加载中...', 0, null, false)
        const id = params.id
        setCurId(id)
        const data = await getDetail(id)
        setHouseInfo(data)
        console.log(data)
        const { longitude, latitude } = data.coord
        const map = new window.BMapGL.Map("container-map");
        myref.current = map
        // 创建地图实例 
        var point = new window.BMapGL.Point(longitude, latitude);
        // 创建点坐标 
        map.centerAndZoom(point, 15);
        const areaPoint = new window.BMapGL.Point(longitude, latitude) // point
        createCircle(areaPoint, data.community, data.houseCode)
        setTimeout(() => {
            Toast.hide()
        }, 1000);
    }, [])
    const addToFavourite = () => {
        console.log("收藏")
    }
    return (
        <div style={{ background: '#f5f5f5', height: "100%" }}>
            <div style={{ position: 'fixed', width: '100%', top: "0", fontSize: "12px", zIndex: 9 }}>
                <MyNavBar title={houseInfo.community} />
            </div>
            {imgDoneflag ? <Carousel style={{ marginTop: '45px' }} autoplay infinite>
                {renderImgs(houseInfo.houseImg)}
            </Carousel> : ''}
            <div className="info-desc">
                <div className="first-part">
                    <div className="info-desc-list">
                        <div className="info-desc-title">{houseInfo.title}</div>
                        <div>
                            {houseInfo.tags && houseInfo.tags.map((tag, index) => {
                                // const tagClass = 'tag' + (index + 1)
                                return (
                                    <span
                                        className={['desc-tagss', 'desc-tag' + (index + 1)].join(' ')}
                                        key={tag}
                                    >
                                        {tag}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                    <ul className="info-desc-price">
                        <li>
                            <div>
                                <span className="price">¥ {houseInfo.price}</span>
                            </div>
                            <div className="price-center">
                                <span className="price-info">人名币</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span className="price">{houseInfo.roomType}</span>
                            </div>
                            <div className="price-center">
                                <span className="price-info">房型</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span className="price">{houseInfo.price}平米</span>
                            </div>
                            <div className="price-center">
                                <span className="price-info">面积</span>
                            </div>
                        </li>

                    </ul>
                    <ul className="info-desc-type">
                        <li>
                            <span className="price-info">装修:</span> &nbsp; <span className="type-info">精装修</span>
                        </li>
                        <li>
                            <span className="price-info">朝向:</span> &nbsp; <span className="type-info">{houseInfo && houseInfo.oriented && houseInfo.oriented[0] ? houseInfo.oriented[0] : '南'}</span>
                        </li>
                        <li>
                            <span className="price-info">楼层:</span> &nbsp; <span className="type-info">{houseInfo.floor}</span>
                        </li>
                        <li>
                            <span className="price-info">类型:</span> &nbsp; <span className="type-info">高端住宅</span>
                        </li>
                    </ul>
                </div>
                <div className="second-part">
                    <div className="info-desc-list">
                        <span className="price-info">装修:</span> &nbsp; <span className="type-info">{houseInfo.community}</span>
                    </div>
                    <div className="map-location">
                        <div id="container-map">
                        </div>
                    </div>
                    <div className="house-configure">
                        <div className="type-info configure">
                            房屋配置
                        </div>
                        <ul className="configure-list-item">
                            {renderConfigure(configure)}
                        </ul>
                    </div>
                </div>
                <div className="third-part">
                    <div className="type-info house-gaikuang">
                        房屋概况
                    </div>
                    <div className="house-desc">
                        <div style={{ marginTop: "5px" }}>
                            <img width="100%" height="300" src={imgUrl} alt="" />
                        </div>
                        <div className="house-desc-info">
                            {info}
                        </div>
                    </div>
                </div>
            </div>
            <FooterRoot addToFavourite={addToFavourite} />
        </div>
    )
}