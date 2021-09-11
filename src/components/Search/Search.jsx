import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { SearchBar } from 'antd-mobile'
import { UPDATELOCATION } from '../../store/action'
import { AppContext } from '../../store/context'
import './index.scss'
export default function Search({ cityName, transferCity }) {
    const { dispatch, state } = useContext(AppContext);
    const history = useHistory()
    const gotoCityList = () => {
        transferCity()
        history.push("/cityList")
    }
    const gotoMap = () => {
        dispatch({
            type: UPDATELOCATION,
            data: {
                longitude: 120.11444,
                latitude: 50.32142
            }
        })
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