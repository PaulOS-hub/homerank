import React, { useState } from 'react'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter';
import './index.scss'
export default function FilterPicker({ defaultVal, type, cols, filterdata, cancelChange, confirmChange, transferSelected }) {
    const [curVal, setCurVal] = useState()
    const getValue = value => {
        setCurVal(value)
        transferSelected(type, value)
    }
    const transferData = () => {
        transferSelected(type, curVal)
        confirmChange(type)
    }
    return (
        <div>
            <PickerView
                value={defaultVal}
                onChange={getValue}
                data={filterdata}
                cols={cols}
            />
            <FilterFooter cancel={() => { cancelChange(type) }} confirm={transferData} />
        </div>
    )
}