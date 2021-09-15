import React, { useState, useEffect } from 'react'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter';
import './index.scss'
export default function FilterPicker({ preValue, defaultVal, type, cols, filterdata, cancelChange, confirmChange, transferSelected }) {
    const [curVal, setCurVal] = useState()

    useEffect(() => {
        if (defaultVal) {
            setCurVal(defaultVal)
        }
    }, [defaultVal])
  
    const getValue = value => {
        setCurVal(value)
    }
    const transferData = () => {
        transferSelected(type, curVal)
        confirmChange(type)
    }
    return (
        <div>
            <PickerView
                value={curVal}
                onChange={getValue}
                data={filterdata}
                cols={cols}
            />
            <FilterFooter cancel={() => { cancelChange(type) }} confirm={transferData} />
        </div>
    )
}