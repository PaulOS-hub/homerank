import React, { useState, useEffect } from 'react'
import FilterFooter from '../../../../components/FilterFooter'
import './index.scss'
export default function FilterMore({ defaultSelected, data, titleSelectedStatus, cancelChange, confirmChange }) {
    // console.log(data)
    const [selectMoreValue, setSelectMoreValue] = useState([])
    useEffect(() => {
        setSelectMoreValue(defaultSelected)
    }, [defaultSelected]);
    const onTagClick = value => {
        console.log(value)
        const arr = [...selectMoreValue]
        if (!selectMoreValue.includes(value)) { // 不包含
            console.log('不包含')
            arr.push(value)
        } else {
            const index = arr.findIndex(item => item === value) // 点击时找到当前点击项的索引
            arr.splice(index, 1)
        }
        setSelectMoreValue(arr)
    }

    const renderFilters = (data) => {
        return data.map(item => {
            const isSelected = selectMoreValue.indexOf(item.value) > -1
            return <span
                onClick={() => { onTagClick(item.value) }}
                key={item.value}
                className={['tag', isSelected ? 'tagActive' : ''].join(' ')}
            >{item.label}</span>
        })
    }
    const confirm = () => {
        confirmChange('more', selectMoreValue)
    }
    const cancel = () => {
        setSelectMoreValue([]) // 清空value值
        cancelChange('more', selectMoreValue)
    }
    console.log(selectMoreValue)
    return (
        <div className="rootss">
            <div className="mask"></div>
            <div className="ouuter" style={{background:"#fff"}}>
                <div className="tags">
                    <dl className="dl">
                        <dt className="dt">户型</dt>
                        <dd className="dd">{renderFilters(data.roomType)}</dd>
                        <dt className="dt">朝向</dt>
                        <dd className="dd">{renderFilters(data.oriented)}</dd>
                        <dt className="dt">楼层</dt>
                        <dd className="dd">{renderFilters(data.floor)}</dd>
                        <dt className="dt">房屋亮点</dt>
                        <dd className="dd">{renderFilters(data.characteristic)}</dd>
                    </dl>
                </div>
                <FilterFooter confirm={confirm} cancel={cancel} classNamess={'myfooter'} />
            </div>
        </div>
    )
}