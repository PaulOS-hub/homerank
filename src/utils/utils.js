export const formatCityData = data => {
    let cityList = {}
    // 遍历,获取每个城市首字母
    data.forEach(item => {
        const firstChar = item.short.substr(0, 1)
        // 先判断有没有这个分类城市,有就直接push
        if (cityList[firstChar]) {
            cityList[firstChar].push(item)
        } else {
            // 没有需要新建这个类
            cityList[firstChar] = [item]
        }
    })
    const cityIndex = Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex
    }
}