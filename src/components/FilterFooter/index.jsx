import React, { } from "react";
import { Flex, Button } from 'antd-mobile'
import './index.scss'
export default function FilterFooter({ classNamess, confirm, cancel, cancelText = '取消', confirmText = "确认" }) {
    const cancelButton = () => {
        cancel()
    }
    const confirmButton = () => {
        confirm()
    }
    return (
        <div style={{ width: "100%", position: 'absolute', zIndex: 999 }}> {/*解决z-index不起作用,将父元素设置为绝对定位 */}
            <Flex className={["root-footer", classNamess || ""].join(' ')}>
                <Button onClick={cancelButton} style={{ fontSize: '14px', width: '40%' }}>{cancelText}</Button>
                <Button onClick={confirmButton} type="primary" style={{ background: '#3fc28c', fontSize: '14px', width: '60%' }}>{confirmText}</Button>
            </Flex>
        </div>
    )
}