import React, { useState, useEffect } from 'react'
import Search from '../../components/Search/Search'
import { useHistory } from 'react-router'
import { NavBar } from 'antd-mobile'
import Filter from './components/Filter'
import './index.scss'
export default function HouseList() {
    const history = useHistory()
    const cityName = JSON.parse(localStorage.getItem("city")).label
    return (
        <div className="main-list" >
            <div className="header-list">
                <NavBar
                    style={{ background: "#f5f6f5", }}
                    icon={<i className="iconfont icon-back" style={{ color: "#333", fontSize: '14px' }} />}
                    onLeftClick={() => history.go(-1)}
                >
                    <Search classNamess={'searchlist'} cityName={cityName} />
                </NavBar>
            </div>
            <Filter ></Filter>
        </div>
    )
}
