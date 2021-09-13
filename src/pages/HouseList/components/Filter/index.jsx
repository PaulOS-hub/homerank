import React, { useState } from 'react'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import { get } from '../../../../utils/http/axios'
import './index.scss'

const defaultSelectedValObject = {
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],//不限
    more: [],
}
export default function Filter() {
    const [titleSelectedStatus, setTitleSelectedStatus] = useState({
        area: false,
        mode: false,
        price: false,
        more: false
    })
    const [selectedVal, setSelectedVal] = useState({
        area: defaultSelectedValObject.area,
        mode: defaultSelectedValObject.mode,
        price: defaultSelectedValObject.price,
        more: defaultSelectedValObject.more,
    })
    const [defaultVal, setDefaultVal] = useState(null)
    const [filtersData, setFiltersData] = useState([]) // pickerViewData
    const [openType, setOpenType] = useState('')
    // 点击菜单，实现高亮
    const changeStatus = async type => {
        // 选中的type值，在这里获取接口
        await getFiltersData()
        setTitleSelectedStatus({
            ...titleSelectedStatus, [type]: true
        })
        setOpenType(type)
    }

    const getFiltersData = () => {
        return new Promise(async resolve => {
            const id = JSON.parse(localStorage.getItem("city")).value
            const { body } = await get("/houses/condition", {
                id
            })
            setFiltersData(body)
            resolve()
        })
    }

    // 取消操作
    const cancelChange = () => {
        setOpenType('')
    }
    const confirmChange = (type, value) => {
        if (value.sort().toString() === defaultSelectedValObject[type].sort().toString()) {
            setTitleSelectedStatus({
                ...titleSelectedStatus, [type]: false
            })
        }
        setOpenType('') // 关闭pickerView
    }
    const transferSelected = (type, value) => {
        setSelectedVal({ // 更新选中值
            ...selectedVal, [type]: value
        })

        // setTitleSelectedStatus({
        //     ...titleSelectedStatus, [type]: true
        // })
    }
    const renderFilterPickComponent = () => {
        // 根据openType值获得数据
        const { area, subway, rentType, price } = filtersData
        let filterdata = [] // 数据源
        let cols = 1 // 列数
        switch (openType) {
            case 'area':
                filterdata = [area, subway]
                cols = 3
                break;
            case 'mode':
                filterdata = rentType
                cols = 1
                break
            case 'price':
                filterdata = price
                cols = 1
                break
            default:
                break;
        }
        let defaultVal = selectedVal[openType] // 默认值
        return ['area', 'mode', 'price'].includes(openType) ? <FilterPicker defaultVal={defaultVal} type={openType} cols={cols} filterdata={filterdata} confirmChange={confirmChange}
            transferSelected={transferSelected} cancelChange={cancelChange} /> : null
    }
    const renderMask = () => {
        return ['area', 'mode', 'price'].includes(openType) ? <div className="mask"></div> : null
    }
    return (
        <div className="root">
            {renderMask()}
            <div className="content">
                <FilterTitle changeStatus={changeStatus} titleSelectedStatus={titleSelectedStatus} />
                {renderFilterPickComponent()}
            </div>
        </div>
    )
}