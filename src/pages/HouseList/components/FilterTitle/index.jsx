import React from 'react'
import { Flex } from 'antd-mobile'
import './index.scss'

const titleList = [{
    title: "区域", type: "area"
}, {
    title: "方式", type: "mode"
}, {
    title: "租金", type: "price"
}, {
    title: "筛选", type: "more"
}]
export default function FilterTitle({ titleSelectedStatus, changeStatus }) {

    return (
        <Flex align="center" className="root-filter" >
            {
                titleList && titleList.map(item => {
                    const isSelected = titleSelectedStatus[item.type]
                    return < Flex.Item style={{textAlign:'center'}} onClick={() => { changeStatus(item.type) }} key={item.type} >
                        <span className={["dropdown", isSelected ? "selected" : ''].join(' ')}>
                            <span>
                                {item.title}
                            </span>
                            <span>
                                <i className="icon-size iconfont icon-arrow"></i>
                            </span>
                        </span>
                    </Flex.Item>
                }
                )
            }
        </Flex >

    )
}