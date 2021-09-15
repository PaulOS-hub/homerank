import React, { useState, useCallback, useEffect } from 'react'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { get } from '../../../../utils/http/axios'
import { getCityInfo } from '../../../../utils/utils'
import './index.scss'

const defaultSelectedValObject = {
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],//不限
    more: [],
}
export default function Filter({ onFilter, setFlow }) {
    const [titleSelectedStatus, setTitleSelectedStatus] = useState({
        area: false,
        mode: false,
        price: false,
        more: false
    })
    const [showPicker, setShowPicker] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [preValue, setPreValue] = useState()
    const [flagShowLoft, setFlagShowLoft] = useState('')
    const [selectedVal, setSelectedVal] = useState({
        area: ['area', 'null'],
        mode: ['null'],
        price: ['null'],
        more: []
    })
    const [filtersData, setFiltersData] = useState([]) // pickerViewData

    const [openType, setOpenType] = useState('') // 记录上一次more的参数
    // 点击菜单，实现高亮
    useEffect(() => {
        if (flagShowLoft) {
            toggleTitle(flagShowLoft)
        }
    }, [selectedVal.more]);



    useEffect(() => {
        // 筛选条件发生改变,页面刷新跑一次.
        const filters = {}
        const { area, mode, price, more } = selectedVal
        const areaKey = area[0]
        let areaValue = 'null'
        if (area.length === 3) {
            areaValue = area[2] !== 'null' ? area[2] : area[1]
        }
        filters[areaKey] = areaValue
        filters.mode = mode[0]
        filters.price = price[0]
        filters.more = more.join(',')
        if (openType) toggleTitle(openType)
        onFilter(filters)
    }, [selectedVal]);
    const changeStatus = async type => {
        setFlow(false)
        if (type !== 'more') setShowPicker(true)
        else setShowMore(true)
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
        } else {
            setTitleSelectedStatus({
                ...titleSelectedStatus, [type]: true
            })
        }
    }

    const getFiltersData = () => {
        return new Promise(async resolve => {
            const id = getCityInfo().value
            const { body } = await get("/houses/condition", {
                id
            })
            setFiltersData(body)
            resolve()
        })
    }
    // 取消操作
    const cancelChange = (type, value) => {
        if (type === 'more') setShowMore(false)
        else setShowPicker(false)
        toggleTitle(type)
        if (type === 'more' && value) {
            setSelectedVal({
                ...selectedVal, [type]: value
            })
            setFlagShowLoft(type)
        }
        setFlow(true)
    }
    // 确认操作（数据传参可用）
    const confirmChange = (type, value) => {
        if (type === 'more') setShowMore(false)
        else setShowPicker(false)
        if (type === 'more' && value) {
            setSelectedVal({
                ...selectedVal, [type]: value
            })
            setFlagShowLoft(type)
        }
        setFlow(true)
    }
    //更新操作
    const transferSelected = (type, value) => {
        setPreValue(selectedVal[type]) // 保存之前值
        console.log(type, value)
        setSelectedVal(selectedVal => {
            return { // 更新选中值
                ...selectedVal, [type]: value
            }
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
        return showPicker ? <FilterPicker defaultVal={defaultVal} type={openType} cols={cols} filterdata={filterdata} confirmChange={confirmChange}
            preValue={preValue} transferSelected={transferSelected} cancelChange={cancelChange} /> : null
    }

    const renderMask = () => {
        return showPicker ? <div className="mask"></div> : null
    }
    const renderFilterMore = () => {
        const { roomType, oriented, floor, characteristic
        } = filtersData
        const data = {
            roomType, oriented, floor, characteristic
        }
        const defaultSelected = selectedVal['more']
        return showMore ? <FilterMore defaultSelected={defaultSelected} confirmChange={confirmChange} cancelChange={cancelChange} titleSelectedStatus={titleSelectedStatus} data={data} /> : null

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