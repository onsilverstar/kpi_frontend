import {React, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as dfd from "danfojs"
import Plot from 'react-plotly.js'
import NavigationBar from './Navbar';

const url_kpi_metrics = "http://127.0.0.1:8000/kpidashboard"
const url_kpi_measure = "http://127.0.0.1:8000/kpimeasures"



const KPIView = (props) =>
{
    const [kpi_summ, setkpi_summ] = useState([])
    const [kpimeasure, setkpimeasure] = useState([])
    const [kpiplot, setkpiplot] = useState()
    const [kpi_id, setkpi_id] = useState()
    const [comment, setcomment] = useState()
    const [kpimetric, setkpimetric] = useState()
    const [currData, setcurrData] = useState()
    const approvalmapping = {
        "Reporting Lead": "Manager",
        "Manager": "Senior Manager",
        "Senior Manager": "Director",
        "Director": "Completed"
    }
    let params = useParams()
    useEffect(
        ()=>{
            setkpi_id(params.id)
           getKPISumm()
           getKPIMetric().then(
            (data)=>{
                getScore(data)
            }
           )
           getKPIMeasure().then(
            (result)=>{
                setkpiplot(createDatafromJSON(result))
            }
           )
        }, []
    )

    console.log(props.user)
    let count = 1
    
    const getKPISumm = async ()=>
    {
        let response = await fetch(url_kpi_metrics)
        let result = await response.json()
        
        {
            for(let i=0; i<result.length; i++)
                    {
                    
                    if(result[i]["KPI"] == kpi_id)
                    {
                            setcurrData(result[i])
                    }
                    }

        }
        let update = await fetch("http://127.0.0.1:8000/editkpi",
        {
            method: "POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({"guid":params.id, "ytd_quantitative":getKPIData(params.id)["actual_quantitative"], "ytd_target":getKPIData(params.id)["cycle_target_quantitative"]})
        }
        )
       
        //getScore()
        setkpi_summ(result)
        console.log(getKPIData(kpi_id)["cycle_target_quantitative"])
    }

    const getScore = async(data)=>{

        let target = parseFloat(data[0]["ytd_target"])
        let actual = parseFloat(data[0]["ytd_quantitative"])
        let weight = parseFloat(data[0]["kpi_weight"])
        let score = (actual/target)*weight
        console.log(data)
        console.log(target)
        console.log(actual)

        if(score>weight)
        {
            score = weight
        }

        let update = await fetch("http://127.0.0.1:8000/editkpi",
        {
            method: "POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({"guid":params.id, "score":score})
        })
        return score
    }

    const getKPIMeasure = async ()=>
    {
        let response = await fetch(url_kpi_measure)
        let result = await response.json()
        setkpimeasure(result)
        return result
    }

    const getKPIMetric = async ()=>
    {
        let response = await fetch("http://127.0.0.1:8000/searchkpi",
        {
            method: "POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({"pk":params.id})
        })
        let result = await response.json()
        setkpimetric(result[0])
        return result

    }

    const createDatafromJSON = (json)=>{
        console.log(json)

        let json_start = []
        for(let i=0; i<json.length; i++)
        {
            if(parseFloat(json[i]["cycle_target_quantitative"])>0)
            {
                json_start.push(json[i])
            }
        }
        let json_dict = {}

        console.log(json_start)

        for(let i=0; i<=json_start.length; i++)
        {
            json_dict[json[i]["KPI"]] ={"operating_period":[],"actual_ytd":[], "target_ytd":[]}
        }

        for(let i=0; i<=json_start.length; i++)
        {
            json_dict[json[i]["KPI"]]["operating_period"].push(json[i]["operating_period"])
            json_dict[json[i]["KPI"]]["actual_ytd"].push(parseFloat(json[i]["actual_ytd"]))
            json_dict[json[i]["KPI"]]["target_ytd"].push(parseFloat(json[i]["target_ytd"]))
        }
        console.log(json_dict)

        return json_dict
    }

    const getKPIData = (id)=>{
        for(let i=0; i<kpi_summ.length; i++)
        {
        
           if(kpi_summ[i]["KPI"] == id)
           {
                return kpi_summ[i]
           }
        }

        return false
    }

    const getApprovalStatus = async()=>{
        let status = await fetch("http://127.0.0.1:8000/validateedit",
        {
            method: "POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({"user":props.user["user_id"], "kpi":params.id, "stage": params.title})
        }
        )

        let result = await status.json()

        return result
    }

    const handleChangeNarrative = (e)=> {
        e.preventDefault()
        setcomment(e.target.value)

    }

    const getColor = ()=>{
        let color = "red"
        let target = parseFloat(currKPI["cycle_target_quantitative"])
        let actual = parseFloat(currKPI["actual_quantitative"])
        let tolerance = 0.1*target
        if(target <= actual)
        {
            color = "green"
        }

        if (target > actual)
        {
            if(actual >= (target-tolerance))
            {
                color = "yellow"
            }
        }
        console.log(color)
        console.log(tolerance)

        return color

    }

    const handleSubmit = async (e)=> {
        e.preventDefault()
        let status = await getApprovalStatus()
        if (status["status"] == "Allowed")
        {
            let result = await fetch("http://127.0.0.1:8000/editkpi",
            {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({"guid":params.id,
                "stage": approvalmapping[params.title],
                "comments_narrative": currKPI["comments_narrative"]+"\n"+comment
            })

            })

            console.log(result.status)

        }

    }

    const currKPI = getKPIData(kpi_id)

    console.log(currKPI)
    //console.log(getKPIMetric(kpi_id))

    return(
        <div style={{padding:"20px"}}>
            <div style={{ marginBottom: '50px' }}>
                <NavigationBar/>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>KPI Ref</th>
                        <th>Description</th>
                        <th>YTD Target</th>
                        <th>YTD Actual</th>
                        <th>Reccommendations</th>

                    </tr>
                </thead>
                    <tbody>
                    
                        { currKPI &&
                            (
                                   <tr>
                                        <td>1</td>
                                        <td>{kpi_id}</td>
                                        <td>{currKPI["description"]}</td>
                                        <td>{currKPI["cycle_target_quantitative"]}</td>
                                        <td>{currKPI["actual_quantitative"]}</td>
                                        <td>{currKPI["comments_narrative"]}</td>
                                    </tr>
                            )
                        }
                    </tbody>
            </Table>
            <div>
            { kpiplot &&
    
            <Plot 
             data={[
                {
                    y: kpiplot[parseInt(kpi_id)]["actual_ytd"],
                    x: kpiplot[parseInt(kpi_id)]["operating_period"],
                   type: 'scatter',
                   mode: 'lines+markers',
                   marker: {color: getColor()},
                   name: "acual ytd",
                },

                { 
                    type: "bar",
                    x: kpiplot[parseInt(kpi_id)]["operating_period"],
                    y: kpiplot[parseInt(kpi_id)]["actual_ytd"],
                    marker: {color: 'golden'},
                    name: "acual ytd bars per week",
                },
              ]}
            />
        }
            </div>
            <div>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Comment Narrative</Form.Label>
                        <Form.Control as="textarea" readOnly value={currKPI["comments_narrative"]}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as="textarea" onChange={handleChangeNarrative} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Approve
                    </Button>
                </Form>
            </div>

        </div>
    )
}

export default KPIView