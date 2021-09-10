import React, { useEffect, useState, useMemo, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Carousel, Flex } from 'antd-mobile';
import { get } from '../../utils/http/axios'
import { BASE_URL } from '../../config'
import './index.scss'
import nav1 from '../../assets/img/nav-1.png'
import nav2 from '../../assets/img/nav-2.png'
import nav3 from '../../assets/img/nav-3.png'
import nav4 from '../../assets/img/nav-4.png'
import Search from '../../components/Search/Search';
import { UPDATELOCATION } from '../Home/action'
import { AppContext } from '../../pages/Home/index'

export default function Index(props) {
    const navList = [{
        icon: nav1,
        title: "整租"
    }, {
        icon: nav2,
        title: "合租",
        path: '/home/list'
    }, {
        icon: nav3,
        title: "地图找房"
    }, {
        icon: nav4,
        title: "去出租"
    }]
    const history = useHistory()
    const [imgList, setImgList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [newsList, setNewsList] = useState([])
    const { dispatch, state } = useContext(AppContext);
    useEffect(async () => {
        const { body } = await get("/home/swiper")
        setImgList(body)

    }, [])
    useEffect(async () => {
        const { body } = await get("/home/groups", {
            area: 'AREA|88cff55c-aaa4-e2e0' // 地区ID
        })
        setGroupList(body)
    }, [])
    useEffect(async () => {
        const { body } = await get("/home/news", {
            area: 'AREA|88cff55c-aaa4-e2e0' // 地区ID
        })
        setNewsList(body)
        navigator.geolocation.getCurrentPosition(position => {
            // H5只能获取位置信息,经度
            dispatch({
                type: UPDATELOCATION,
                data: {
                    latitude: position.coords.latitude,
                    longitude:position.coords.longitude
                }
            })
        })

    }, [])
    // 轮播图bug 1:初始数据为[],不会自动播放,高度会有问题
    // 解决方法, flag 判断当前数据获取成功否,再去渲染dom
    const renderImgs = data => {
        return data.map(val => (
            <img
                key={val.id}
                src={BASE_URL + val.imgSrc}
                alt={val.alt}
                style={{ width: '100%', verticalAlign: 'top', }}
                onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                }}
            />
        ))
    }
    const goDetail = item => {
        console.log(item)
        history.push(item.path)
    }
    const renderFlexItem = data => {
        return data.map(item =>
            <Flex.Item key={item.icon} onClick={() => { goDetail(item) }}>
                <div style={{ padding: "10px 10px" }}>
                    <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px" }}>
                        <img width={48} height={48} src={item.icon} alt="" />
                    </div>
                    <div style={{ textAlign: "center", fontSize: "12px" }}>
                        {item.title}
                    </div>
                </div>
            </Flex.Item>
        )

    }
    const imgDoneflag = useMemo(() => {
        return imgList.length > 0 ? true : false
    }, [imgList])
    return (
        <div style={{ paddingBottom: "15px" }}>
            <div className="Index">
                <div style={{ height: '210px', position: 'relative' }}>
                    {imgDoneflag ? <Carousel autoplay infinite>
                        {renderImgs(imgList)}
                    </Carousel> : ''}
                    <Search />
                </div>
                <Flex>
                    {renderFlexItem(navList)}
                </Flex>
            </div>
            <div className="rankHomeGroup">
                <div style={{ display: "flex", justifyContent: 'space-between', padding: "15px 10px" }}>
                    <div>
                        租房小组
                    </div>
                    <div>
                        更多
                    </div>
                </div>
                <div className="groupItem">
                    {
                        groupList.map(item =>
                            <div key={item.id} className="groupItem-list">
                                <div className="desc-list">
                                    <div className="title">
                                        {item.title}
                                    </div>
                                    <div className="desc">
                                        {item.desc}
                                    </div>
                                </div>
                                <div>
                                    <img width={52} height={52} src={BASE_URL + item.imgSrc} alt="" />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="newsUpdate">
                <div className="title">
                    最新资讯
                </div>
                {
                    newsList.map(item =>
                        <div key={item.id} className="newsList">
                            <div>
                                <img width={150} height={100} src={BASE_URL + item.imgSrc} alt="" />
                            </div>
                            <div className="description">
                                <div className="desc">
                                    {item.title}
                                </div>
                                <div className="notes">
                                    <div>
                                        {item.from}
                                    </div>
                                    <div>
                                        {item.date}
                                    </div>
                                </div>
                            </div>
                        </div>)
                }
            </div>
        </div>
    )
}
