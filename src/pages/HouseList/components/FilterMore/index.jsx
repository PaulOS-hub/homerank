import React, { useState,useEffect } from 'react'
import { Drawer, List } from 'antd-mobile'
import './index.scss'
export default function FilterMore({ data, titleSelectedStatus }) {
    const [open, setOpen] = useState(() => titleSelectedStatus.more)
    console.log(data)
    useEffect(() => {
        setOpen(titleSelectedStatus.more)
    });
    console.log(titleSelectedStatus)
    const sidebar = (<List>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i, index) => {
            if (index === 0) {
                return (<List.Item key={index}
                    thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                    multipleLine
                >Category</List.Item>);
            }
            return (<List.Item key={index}
                thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
            >Category{index}</List.Item>);
        })}
    </List>);
    return (
        <Drawer
            className="my-drawer"
            style={{ minHeight: document.documentElement.clientHeight }}
            enableDragHandle
            touch={false}
            dragHandle={true}
            position="right"
            contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
            sidebar={sidebar}
            open={open}
        >
        </Drawer>
    )
}