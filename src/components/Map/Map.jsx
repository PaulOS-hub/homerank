import React, { useEffect, useContext } from 'react'
import { AppContext } from '../../store/context'
import './index.scss'
export default function Map(props) {
    const { dispatch, state } = useContext(AppContext);
    console.log(state)
    useEffect(() => {
        const map = new window.BMapGL.Map("container");
        const point = new window.BMapGL.Point(state.longitude ? state.longitude : 116.404, state.latitude ? state.latitude : 39.915
        );
        map.centerAndZoom(point, 10);
    })
    return (
        <div className="map">
            {/* 地图容器 */}
            <div id="container">
            </div>
        </div>
    )
}