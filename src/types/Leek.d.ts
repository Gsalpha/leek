declare namespace Leek {
    export interface Unit {
        "code": string,
        "name": string,
        "netWorthDate": string, //净值更新日期,日期格式为yy-MM-dd HH:mm
        "netWorth": number,  //当前基金净值
        "dayGrowth": string, //单位净值日涨幅,单位为百分比
        "expectWorthDate": string, //净值估算更新日期,,日期格式为yy-MM-dd HH:mm
        "expectWorth": number, //当前基金单位净值估算
        "expectGrowth": string, //当前基金单位净值估算日涨幅,单位为百分比
    }
}
