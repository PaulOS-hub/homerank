import React, { useEffect, useState, useMemo } from 'react'
import { useHistory } from 'react-router'
import { Carousel } from 'antd-mobile'
import MyNavBar from '../../components/Navbar'
import { BASE_URL } from '../../config'
import { get } from '../../utils/http/axios'
import './index.scss'
export default function HouseDetail() {
    const history = useHistory()
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
    useEffect(async () => {
        const { pathname } = history.location
        const id = pathname.substring(13)
        setCurId(id)
        const data = await getDetail(id)
        setHouseInfo(data)
        console.log(data)
    }, [])
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
            </div>
        </div>
    )
}