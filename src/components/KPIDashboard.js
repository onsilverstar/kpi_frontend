import {React, useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table';
import * as dfd from "danfojs"
import Plot from 'react-plotly.js'

const url_kpi_metrics = "http://127.0.0.1:8000/kpidashboard"
const url_kpi_measure = "http://127.0.0.1:8000/kpimeasures"



const KPIDashboard = (props) =>
{
    const [kpi_summ, setkpi_summ] = useState([])
    const [kpimeasure, setkpimeasure] = useState([])
    const [kpiplot, setkpiplot] = useState()
    useEffect(
        ()=>{
           getKPISumm()
           getKPIMeasure().then(
            (result)=>{
                setkpiplot(createDatafromJSON(result))
            }
           )
           //.then((response)=>{
            // let kpi_measure_dataframe = new dfd.DataFrame(response)
            // //kpi_measure_dataframe.rename({ "operating_period": "index"}, { inplace: true })
            // let kpi_measure_plot = kpi_measure_dataframe.loc({columns:["operating_period","actual_ytd", "target_ytd"]})
            // let plot1=kpi_measure_plot.plot("plot_div").line(
            //     {
            //         config: {x:"operating_period",
            //         y: kpi_measure_plot[["actual_ytd", "target_ytd"]],
            //         mode:'lines',
            //         marker: { color: "red" },
            //         }
            //       })
            // plot1.add_scatter({config: {x:"operating_period",
            // y: "actual_ytd",
            // mode: "lines"}})
        //})
        }, []
    )
    let count = 1
    const getKPISumm = async ()=>
    {
        let response = await fetch(url_kpi_metrics)
        let result = await response.json()
        setkpi_summ(result)
    }

    const getKPIMeasure = async ()=>
    {
        let response = await fetch(url_kpi_measure)
        let result = await response.json()
        setkpimeasure(result)
        return await result
    }

    const createDatafromJSON = (json)=>{
        let json_dict = {}

        for(let i=0; i<json.length; i++)
        {
            json_dict[json[i]["KPI"]] ={"operating_period":[],"actual_ytd":[], "target_ytd":[]}
        }

        for(let i=0; i<json.length; i++)
        {
            json_dict[json[i]["KPI"]]["operating_period"].push(json[i]["operating_period"])
            json_dict[json[i]["KPI"]]["actual_ytd"].push(parseFloat(json[i]["actual_ytd"]))
            json_dict[json[i]["KPI"]]["target_ytd"].push(parseFloat(json[i]["target_ytd"]))
        }
        console.log(json_dict)

        return json_dict
    }

    return(
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>KPI Ref</th>
                        <th>Description</th>
                        <th>YTD Target</th>
                        <th>YTD Actual</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                    <tbody>
                    
                        {
                            kpi_summ.map
                            (
                                (item)=>
                                    <tr>
                                        <td>{count++}</td>
                                        <td>{item.KPI}</td>
                                        <td>{item.description}</td>
                                        <td>{item.cycle_target_quantitative}</td>
                                        <td>{item.actual_quantitative}</td>
                                        <td>{item.comments_narrative}</td>

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
                    y: kpiplot[1]["actual_ytd"],
                    x: kpiplot[1]["operating_period"],
                   type: 'line',
                   mode: 'lines+markers',
                   marker: {color: 'red'},
                },
                
              ]}
            />}
            </div>

        </div>
    )
}

export default KPIDashboard