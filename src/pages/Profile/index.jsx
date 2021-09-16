import React from 'react'
import { Button } from 'antd-mobile'
import { imgUrl } from './const'
import './index.scss'

export default function Profile() {
    return (
        <div className="profile-container">
            <div className="profile-bg">
                <img className="profile-img" height="100%" src={imgUrl} alt="" />
            </div>
            <div className="userInfo">
                <div className="avatar">
                </div>
                <div className="users">
                    游客
                </div>
                <div>
                    <Button type="primary" size="small">去登陆</Button>
                </div>
            </div>
        </div>
    )
}
