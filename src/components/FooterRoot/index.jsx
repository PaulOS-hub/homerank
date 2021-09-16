import React, { } from 'react'
import './index.scss'
export default function FooterRoot({ addToFavourite }) {
    return (
        <ul className="footer-root">
            <li onClick={() => { addToFavourite() }}>
                <i className="iconfont icon-morey"></i>收藏
            </li>
            <li>
                在线咨询
            </li>
            <li>
                电话预约
            </li>
        </ul>
    )
}