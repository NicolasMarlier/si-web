import { healthBar } from './MapsPage/Icons'

const TestPage = () => {
    return <>
        <br/>
        <br/>
        <label>70/100</label>
        <img src={healthBar(70, 100)} width="1000" height="100"/>
        <br/>
        <br/>
        <label>1/3</label>
        <img src={healthBar(1, 3)} width="1000" height="100"/>
        <br/>
        <br/>
        <label>432/1400</label>
        <img src={healthBar(432, 1400)} width="1000" height="100"/>
        <br/>
    </>
}
export default TestPage