import { NavBar } from "antd-mobile";
import { useHistory } from 'react-router'
export default function MyNavBar({ title, mode = "light", goTop = false }) {
    const history = useHistory()
    return (
        <NavBar
            style={{ background: "#f5f6f5", marginTop: goTop ? '-45px' : '0px' }}
            mode={mode}
            icon={<i className="iconfont icon-back" style={{ color: "#333" }} />}
            onLeftClick={() => history.go(-1)}
        >{title}</NavBar>
    )
}