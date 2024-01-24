import { PropsWithChildren, ReactElement, ReactEventHandler, useEffect, useRef } from "react"
import './HorizontalScrollable.scss'

const HorizontalScrollable = (props: PropsWithChildren) => {
    const { children } = props;
    const baseElement = useRef(null as HTMLDivElement | null)

    const onScroll = (e: any) => {
        if(baseElement.current) {
            const domBase = baseElement.current
            if(domBase.scrollLeft < domBase.clientWidth / 2) {
                domBase.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                })
            }
            else {
                domBase.scrollTo({
                    left: domBase.clientWidth,
                    behavior: 'smooth'
                })
            }
        }
        console.log(e)
        console.log()
    }
    useEffect(() => {
        baseElement.current?.addEventListener('touchend', onScroll)
    }, [baseElement])
    return <div className='horizontal-scrollable' ref={baseElement}>
        { children }
    </div>
}
export default HorizontalScrollable