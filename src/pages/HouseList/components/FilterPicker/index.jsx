import React, { useMemo } from 'react'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter';
import './index.scss'
export default function FilterPicker({ defaultVal, type, cols, filterdata, cancelChange, confirmChange, transferSelected }) {
    const getValue = value => {
        transferSelected(type, value)
    }
    return (
        <div>
            <PickerView
                value={defaultVal}
                onChange={getValue}
                data={filterdata}
                cols={cols}
            />
            <FilterFooter cancel={() => { cancelChange(type) }} confirm={() => { confirmChange(type) }} />
        </div>
    )
}