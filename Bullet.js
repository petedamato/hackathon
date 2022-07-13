import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function Bullet({ width, height, data }){
    const ref = useRef();

    useEffect(() => {
            const svg = d3.select(ref.current)
                .attr("width", width)
                .attr("height", height)
                .style("border", "1px solid black")
        }, []);

    useEffect(() => {
        draw();
        }, [data]);

    const draw = () => {

      // <Bullet /> takes width, height and data as an array of objects
      const margin = {
        top:10,
        right:10,
        bottom:10,
        left:10
      }
      if (data) {

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d)=>{
                    return d3.max([+d.value, +d.goal])
            })])
            .range([0, width - margin.left - margin.bottom])

        const yScale = d3.scaleBand()
            .domain(data.map(entry => entry.key))
            .range([0, height - margin.bottom - margin.top])
            .padding(0.50)

           const svg = d3.select(ref.current);

           const group = svg
                    .append("g")
                    .attr("class", "group")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

            const rects = group
                .selectAll(".outer")
                .data([data])
                .enter()
                .append("g")
                .attr("class", "outer")

            rects.selectAll(".labels")
                .data(d=>d)
                    .enter()
                .append("text")
                .attr("class", "labels")
                .text((d)=>{
                    if (d.key == "diversity") {
                        return "Diverse Carriers Spend"
                    } else {
                        return "SmartWay Carriers Spend"
                    }    
                })
                .attr("x", (d,i) => xScale(0) + 2)
                    .attr("y", (d) => {
                        return yScale(d.key) - 4})
            rects
                .selectAll("rect .outer")
                    .data(d=>d)
                    .enter()
                    .append("rect")
                        .attr("class", "outer")
                        .attr("x", d => xScale(0))
                        .attr("y", d => yScale(d.key))
                        .attr("width", (d,i) => {
                            return width - margin.left - margin.right
                        })
                        .attr("height", yScale.bandwidth())
                        .attr("fill", "#D9D9D9")

            const innerBar = rects.selectAll("rect .tracking")
                    .data(d=>d)
                    .enter()
                    .append("rect")
                        .attr("class", "tracking")
                        .attr("x", d => xScale(0))
                        .attr("y", d => yScale(d.key))
                        .attr("height", yScale.bandwidth())
                        .attr("width", 0)
                        .attr("fill", (d,i)=>{
                            return ["#27566b", "#8cbb61","#007b82"][i]
                        })

            // Animate the filling of the bars
            innerBar
                        .transition().duration(1000)    
                        .attr("width", d => xScale(d.value))
                        
                        

           rects
                .selectAll(".inner-text")
                .data(d=>d)
                    .enter()
                .append("text")
                    .attr("x", (d,i) => xScale(0) + 2)
                    .attr("y", d => yScale(d.key) + yScale.bandwidth()/2)
                    .text(d => d3.format("$,.0f")(d.value))
                    .attr("text-anchor", "left")
                    .style("dominant-baseline", "middle")
                    .attr("fill", "#ffffff")
                    .attr("font-size", "0.9em")
                    .attr("font-weight", "500")
                    .attr("class", "inner-text")

           const planLines = rects
            .selectAll(".plan")
            .data(d=>d)
                    .enter()
                .append("line")
                .attr("x1", (d,i) => xScale(d.goal))
                .attr("x2", (d,i) => xScale(d.goal))
                .attr("y1", d => (yScale(d.key) - 10))
                .attr("y2", d => (yScale(d.key)) + yScale.bandwidth() + 10)
                .style("stroke", "#323232")
                .style("stroke-width", 14)
                .attr("class", "plan")

            const planLineText = rects
            .selectAll(".plan-text")
            .data(d=>d)
                    .enter()
                .append("text")
                .attr("x", (d,i) => xScale(d.goal) - (yScale.bandwidth()/2) - 10)
                .attr("y", d => (yScale(d.key) - 7))
                .style("text-transform", "uppercase")
                .attr("text-anchor", "middle")
                .attr("transform", (d)=>{
                    return "rotate(270," + xScale(d.goal) + "," + (yScale(d.key) - 10) + ")"})
                .attr("fill", "white")
                .attr("font-size", "0.5em")
                .attr("opacity", .6)
                .attr("font-weight", "bold")
                .text((d)=>{
                    if (d.goal >= 1000000){
                        return d3.format("$.0f")(Math.round(d.goal/1000)) + "M target"
                    } else {
                        return d3.format("$,.0f")(d.goal) + " target"
                    }
                    
                })

            rects
                .exit()
                .remove()
      }
      
    }

    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )


}

export default Bullet;