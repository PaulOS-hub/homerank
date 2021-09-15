import React, { } from "react";
import { BASE_URL } from '../../config'
import './index.scss'
export default function HouseItem({ house }) {
    if (!house) return <div>213</div>
    return (
        <div className="house" key={house.houseCode}>
            <div className="imgWrap">
                <img
                    className="img"
                    src={BASE_URL + house.houseImg}
                    alt=""
                />
            </div>
            <div className="contentss">
                <h3 className="title">{house.title}</h3>
                <div className="desc">{house.desc}</div>
                <div>
                    {/* ['近地铁', '随时看房'] */}
                    {house.tags.map((tag, index) => {
                        // const tagClass = 'tag' + (index + 1)
                        return (
                            <span
                                className={['tagss', 'tag' + (index + 1)].join(' ')}
                                key={tag}
                            >
                                {tag}
                            </span>
                        )
                    })}
                </div>
                <div className="price">
                    <span className="priceNum">{house.price}</span> 元/月
                </div>
            </div>
        </div>
    )
}