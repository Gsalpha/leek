import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import axios from 'axios'
import {
    AppBar,
    Card,
    CardActions,
    CardContent,
    Fab,
    Grid,
    Toolbar,
    Typography,
    IconButton, Divider
} from "@material-ui/core";
import {Add, EditRounded, DeleteRounded} from "@material-ui/icons";
import UpsertDialog from "../components/UpsertDialog";
import Loading from "../components/Loading";


const Index = () => {
    const [open, setOpen] = useState(false)
    const [list, setList] = useState<{ [propName: string]: any }>(null);
    const [data, setData] = useState<Leek.Unit[]>([])
    const timer = useRef<any>(null)
    const [loading, setLoading] = useState(true)
    const fetch = useCallback(() => {
        axios.post<Leek.Unit[]>('/api/leek', {
            code: Object.keys(list).join()
        }).then(res => {
            setData(res.data)
            setLoading(false)
        }).catch(e => {
            // fetch()

        })
    }, [list])
    useEffect(() => {
        try {
            setList(JSON.parse(localStorage.getItem('leek')))
        } catch {

        }
    }, [])
    useEffect(() => {
        if (list) {
            localStorage.setItem('leek', JSON.stringify(list))
            fetch()
            if (timer.current) {
                clearInterval(timer.current)
            }
            timer.current = setInterval(() => {
                fetch()
            }, 10000)
        } else {
            setLoading(false)
        }

    }, [list, fetch])
    const handleOk = (data) => {
        setList(prev => ({...prev, [data.code]: data.num}))
    }

    const renderNum = useCallback((leek: Leek.Unit) => {
        return ((list[leek.code] || 0) * leek.netWorth).toFixed(2)
    }, [list])
    const renderPureProfit = useCallback((leek: Leek.Unit) => {
        const currentNum = list[leek.code]
        if (!currentNum) {
            return 0
        }
        return (Math.abs(Number(currentNum) * leek.netWorth * Number(leek.expectGrowth) / 100)).toFixed(2)
    }, [list])
    const renderProfit = useCallback((leek: Leek.Unit) => {
        const currentNum = list[leek.code]
        if (!currentNum) {
            return 0
        }
        return (Number(currentNum) * leek.expectWorth).toFixed(2)
    }, [list])
    const renderMood = useCallback((precent: string | number) => {
        const expect = Number(precent);
        if (expect >= 5) {
            return <>🥳🥳</>
        }
        if (expect >= 3) {
            return <>🤩🤩</>
        }
        if (expect >= 2) {
            return <>😎😎</>
        }
        if (expect >= 1) {
            return <>😋😋</>
        }
        if (expect >= 0) {
            return <>😀😀</>
        }
        if (expect >= -1) {
            return <>😟😟</>
        }

        if (expect < -5) {
            return <>💀💀</>
        }

        if (expect < -4) {
            return <>🤮🤮</>
        }

        if (expect < -2) {
            return <>🥶🥶</>
        }
        if (expect < -1) {
            return <>😭😭</>
        }
    }, [])
    const renderTotalProfit = useMemo(() => {
        return data.reduce((current, next) => {
            const currentNumber = list[next.code] || 0;
            return current + Number(next.expectGrowth) * (currentNumber) * next.netWorth / 100
        }, 0)

    }, [list, data])
    const renderTotal = useMemo(() => {
        return data.reduce((current, next) => {
            const currentNumber = list[next.code] || 0;
            return current + (currentNumber) * next.netWorth
        }, 0)
    }, [list, data])
    const renderProfitPercent = useMemo(() => {
        return (renderTotalProfit * 100 / (renderTotal || 1)).toFixed(2)
    }, [renderTotalProfit, renderTotal])
    const [selectedUnit, setSelectedUnit] = useState<Leek.Unit>(null)
    return <>
        <Loading opacity={1} show={loading}/>
        <UpsertDialog selected={selectedUnit} list={list} open={open} onClose={() => {
            setOpen(false)
            setSelectedUnit(null)
        }} onOk={handleOk}/>
        <AppBar position={"static"}>
            <Toolbar>
                <header className="header">
                    <span className="title">我是一颗小韭菜 <img src="/logo.svg" alt=""/></span>
                    <Fab color="secondary" aria-label="add" size={"small"} onClick={() => {
                        setOpen(true)
                    }
                    }>
                        <Add/>
                    </Fab>
                </header>
            </Toolbar>
        </AppBar>
        <main className="paper">
            {data.length > 0 && <>
                <Typography color={"textSecondary"} style={{marginBottom: 10}}>今日累计收益预估：<span
                    style={{color: renderTotalProfit <= 0 ? 'green' : 'red'}}>￥{renderTotalProfit.toFixed(2)}</span></Typography>
                <Typography color={"textSecondary"} style={{marginBottom: 10}}>今日收益率预估：<span
                    style={{color: renderTotalProfit <= 0 ? 'green' : 'red'}}>{renderProfitPercent}%</span></Typography>
                <Typography color={"textSecondary"}
                            style={{marginBottom: 10}}>{renderMood(renderProfitPercent)}</Typography>

                <Divider/>
            </>}
            <Grid container spacing={3} style={{marginTop: 10}}>
                {
                    data.sort((a, b) => {
                        return Number(list[a.code] || 0) * a.netWorth < Number(list[b.code]) * b.netWorth ? 1 : -1
                    }).map(item => (
                        <Grid key={item.code} item lg={3} md={4} sm={6} xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        {item.name}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        持仓金额：￥{renderNum(item)} ({(Number(renderNum(item))/renderTotal*100).toFixed(2)}%)
                                    </Typography>
                                    <Typography color="textSecondary">
                                        净值估算：<Typography variant={"body2"} component={"span"}
                                                         style={{
                                                             color: Number(item.expectGrowth) > 0 ? 'red' : 'green'
                                                         }}
                                    >{item.expectGrowth}%</Typography>
                                    </Typography>
                                    <Typography variant="h6" component="h2" color={"textSecondary"}>
                                        收盘持仓金额估算：<Typography variant={"h6"} component={"span"}
                                                             style={{
                                                                 color: Number(item.expectGrowth) > 0 ? 'red' : 'green'
                                                             }}
                                    >￥{renderProfit(item)}</Typography>
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        截止到{item.expectWorthDate} <br/>
                                        {Number(item.expectGrowth) > 0 ?
                                            <span style={{color: 'red'}}>盈利</span> :
                                            <span style={{color: 'green'}}>亏损</span>}：
                                        <Typography component={"span"}
                                                    style={{
                                                        color: Number(item.expectGrowth) > 0 ? 'red' : 'green'
                                                    }}
                                        >￥{renderPureProfit(item)} {renderMood(item.expectGrowth)}</Typography>
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton onClick={() => {
                                        setSelectedUnit(item)
                                        setOpen(true)
                                    }}>
                                        <EditRounded color={"primary"}/>
                                    </IconButton>
                                    <IconButton color={"secondary"} onClick={() => {
                                        const data = {...list};
                                        delete data[item.code];
                                        setList(data)
                                    }}>
                                        <DeleteRounded/>
                                    </IconButton>

                                </CardActions>
                            </Card>
                        </Grid>

                    ))
                }

            </Grid>
        </main>

        {/*language=SCSS*/}
        <style jsx>{`
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 18px;
            width: 100%;
            font-weight: bold;
            color: #fff;
          }

          .paper {
            padding: 20px;
          }

          .title {
            display: inline-flex;
            align-items: center;
          }
        `}</style>
    </>
}

export default Index
