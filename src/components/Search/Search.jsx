import React from 'react'
import { useHistory } from 'react-router-dom'
import { SearchBar } from 'antd-mobile'
import './index.scss'
export default function Search({ cityName, transferCity }) {
    const history = useHistory()
    const gotoCityList = () => {
        transferCity()
        history.push("/cityList")
    }
    const gotoMap = () => {
        history.push("/home/map")
    }
    return (
        <div className="search">
            <div className="left">
                <div className="city" onClick={gotoCityList}>
                    <span className="name">{cityName}</span>
                    <i className="iconfont icon-arrow"></i>
                </div>
                <div className="form">
                    <SearchBar placeholder="Search" />
                </div>
            </div>
            <div className="location" onClick={gotoMap}>
                <i className="iconfont icon-map"></i>
            </div>
        </div>
    )
}