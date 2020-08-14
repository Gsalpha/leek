import React, {FC, memo} from 'react'
import {CircularProgress, LinearProgress} from '@material-ui/core'

export interface IProps {
    show: boolean
    page?: boolean
    className?: string
    size?: number
    showLinear?: boolean
    opacity?: number
}

const Loading: FC<IProps> = ({
                                 page,
                                 size,
                                 show,
                                 className,
                                 showLinear,
                                 opacity,
                             }) => {
    return show ? (
        <>
            <div
                className={"root"}
                style={{backgroundColor: `rgba(255,255,255,${opacity || 0.6})`}}
            >
                {showLinear && <LinearProgress/>}
                <div className="loading">
                    <CircularProgress size={size}/>
                </div>
            </div>
            {/*language=CSS*/}
            <style jsx>{`
                .root {
                    z-index: 1300;
                    left: 0;
                    top: 0;
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.7);
                    position: fixed;
                    height: 100vh;
                }


                .loading {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

            `}</style>
        </>
    ) : null
}

Loading.defaultProps = {
    showLinear: true,
    size: 40,
}
export default memo(Loading)
