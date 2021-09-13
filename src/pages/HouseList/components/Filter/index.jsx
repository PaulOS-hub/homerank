import React, { useState, useCallback, useEffect } from 'react'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
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
        area: ['area', 'null'],
        mode: ['null'],
        price: ['null'],
        more: []
    })
    const [filtersData, setFiltersData] = useState([]) // pickerViewData

    const [openType, setOpenType] = useState('')
    // 点击菜单，实现高亮
    useEffect(() => {
        console.log(selectedVal[openType])
    }, [selectedVal, openType]);
    const changeStatus = async type => {
        // 选中的type值，在这里获取接口
        await getFiltersData()
        setOpenType(type) // 先打开窗口
        setTitleSelectedStatus({
            ...titleSelectedStatus, [type]: true
        })

    }
    // 二次渲染title高亮方法
    const toggleTitle = type => {
        const copy_A = JSON.parse(JSON.stringify(selectedVal))
        const copy_B = JSON.parse(JSON.stringify(defaultSelectedValObject))
        if (copy_A[type].sort().toString() === copy_B[type].sort().toString()) {
            setTitleSelectedStatus({
                ...titleSelectedStatus, [type]: false
            })
        }
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
    const cancelChange = type => {
        setOpenType('') // 关闭pickerView
        toggleTitle(type)
    }
    // 确认操作（数据传参可用）
    const confirmChange = (type) => {
        setOpenType('') // 关闭pickerView
        toggleTitle(type)
    }
    //更新操作
    const transferSelected = (type, value) => {
        setSelectedVal({ // 更新选中值
            ...selectedVal, [type]: value
        })
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

        // 默认值
        let defaultVal = selectedVal[openType]
        return ['area', 'mode', 'price'].includes(openType) ? <FilterPicker defaultVal={defaultVal} type={openType} cols={cols} filterdata={filterdata} confirmChange={confirmChange}
            transferSelected={transferSelected} cancelChange={cancelChange} /> : null
    }
    const renderMask = () => {
        return ['area', 'mode', 'price'].includes(openType) ? <div className="mask"></div> : null
    }
    const renderFilterMore = () => {
        const { roomType, oriented, floor, characteristic
        } = filtersData
        const data = {
            roomType, oriented, floor, characteristic
        }
        console.log(data)
        if (openType === 'more') {
            return <FilterMore titleSelectedStatus={titleSelectedStatus} data={data} />
        } else {
            return null
        }
    }
    return (
        <div className="root">
            {renderMask()}
            <div className="content">
                <FilterTitle changeStatus={changeStatus} titleSelectedStatus={titleSelectedStatus} />
                {renderFilterPickComponent()}
                {renderFilterMore()}
            </div>
        </div>
    )
}