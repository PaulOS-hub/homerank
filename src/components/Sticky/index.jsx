// 吸顶组件
import React, { useRef, useEffect } from 'react'
import './index.scss'
export default function Sticky(props) {
    const refHolder = useRef() // 占位
    const refContent = useRef() // 内容
    const handleScroll = (e) => {
        const { top } = refHolder.current.getBoundingClientRect() // ref节点的可视区域位置
        if (top < 0) {
            // 吸顶
            refContent.current.classList.add("fixeded")
            refHolder.current.style.height = "36px"
        } else {
            refContent.current.classList.remove("fixeded")
            refHolder.current.style.height = "0px"
        }
    }
    useEffect(() => {
        window.addEventListener("scroll", handleScroll, true)
        return () => {
            window.removeEventListener("scroll", handleScroll, true)
        }
    }, [])
    return (
        <div>
            <div ref={refHolder}>

            </div>
            <div ref={refContent}>
                {props.children}
            </div>
        </div>
    )
}