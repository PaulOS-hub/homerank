import React, { useState, useEffect } from 'react'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter';
import './index.scss'


export default function FilterPicker({ defaultVal, type, cols, filterdata, cancelChange, confirmChange, transferSelected }) {
    const [value, setValue] = useState(null) // 选中值
    useEffect(() => {
        setValue(defaultVal)
    })
    // 选中值
    const getValue = value => {
        setValue(value)
        transferSelected(type, value)
    }
    return (
        <div>
            <PickerView
                value={value}
                onChange={getValue}
                data={filterdata}
                cols={cols}
            />
            <FilterFooter cancel={() => { cancelChange() }} confirm={() => { confirmChange(type,value) }} />
        </div>
    )
}