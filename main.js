$(document).ready(() => {
       //declarations
       let svg = d3.select('#svg')
       let width = 900;
       let height = 650;
       let margin = {top:30,left:35,bottom:30,right:30}

   //style svg
       svg.attr('height',height)
           .attr('width',width)
           .classed('svgStyle',true)
       //----------------------------------------------------------------------------------------------------
   let render = (url) => {
     
       d3.json(url).then(data =>{
         //push modified data into an empty array using forEach() function
           let dataset = data.data
           let newData = [];
           dataset.forEach(item => newData.push({'data-gdp':item[1],'parsed-date':(item[0])}))
           console.log(newData)
           //obtain the mix & max years
           let min = d3.min(newData,x=>x['parsed-date'])
           let max = d3.max(newData,x=>x['parsed-date'])
   
           //Write out the xScale,domain(),range() & axis
           let xScale = d3.scaleTime()
                          .domain([new Date(min),new Date(max)])
                          .range([margin.left,width-margin.right])
                  let xAxis = d3.axisBottom(xScale).tickFormat(d=>new Date(d).getFullYear()).tickSize(0).ticks(10)
   
           let xGroup = svg.append('g')
                           .attr('id','x-axis')
                           .attr('transform',  `translate(${0},${height-margin.bottom})`)
                           .call(xAxis)
               xGroup.selectAll('.tick>text')
                           .classed('x-ticks')
               //Declare dates array
               let dates = document.querySelectorAll('.tick>text')
               
               //yscale yaxis ygroup
               let yScale = d3.scaleLinear()
               .domain([0,d3.max(newData.map(val => val['data-gdp']))])
               .range([height-margin.bottom,margin.top])
   
               let yAxis = d3.axisLeft(yScale).tickSize(0)
   
               let yGroup = svg.append('g')
                               .attr('id','y-axis')
                               .attr('transform',`translate(${margin.left},0)`)
                               .call(yAxis)
   //----------------------------------------------------------------------------------------------------
               //Tooltip
               const toolTip = d3.select('body')
               .append('div')
               .attr('id','tooltip')

               //Event Listener functions
               function mouseOver(d){
               //Bar color Opacity
                d3.select(d.target)
                .style('opacity',1)
               //toolTip
               document.getElementById('tooltip').setAttribute('data-date', d.target.__data__['parsed-date'])
               toolTip
               .style('opacity',.8)
               .attr('style',`left:${d.pageX+10}px;top:${d.pageY+15}px`)
               .html(`<p>Date:<span class='span span-date'>${d.target.__data__['parsed-date']}</span></p>\n<p>Billions:<span class='span span-dollaz'>$${d.target.__data__['data-gdp']}</span></p>`)
               d3.select(this).style('opacity',.1)
               console.log(toolTip)
               }
               function mouseMove(d){
                 toolTip
                .attr('style',`left:${d.pageX+10}px;top:${d.pageY-10}px;transition:.05s ease`)
                 d3.select(this).style('opacity',.8)    
               }
               function mouseOut(d){
                 //Bar-color Opacity
                 d3.select(d.target)
                .style('opacity',.5)
                //Create toolTop
                 toolTip
                 .style('opacity',0)
                 d3.select('opacity',1)
               }
   //----------------------------------------------------------------------------------------------------
               //Declare rectangles
        let bars = svg.append('g')
                    .selectAll('rect')
                    .data(newData)
                    .enter()
                    .append('rect')
                    .classed('bar',true)
                    .attr('x',(_,i)=> (i * ((width-margin.left-margin.right)/newData.length))+margin.left)
                    .attr('y',(d) => yScale(d['data-gdp']))
                    .attr('height',d=> height - yScale(d['data-gdp']) - margin.bottom)
                    .attr('width',(width)/(newData.length))
                    .attr('data-date', (d,i) => (d['parsed-date']))
                    .attr('data-gdp', (d,i) => (d['data-gdp']))
               //Plug in Event Listeners
                    .on('mouseover',mouseOver)
                    .on('mousemove',mouseMove)
                    .on('mouseout',mouseOut)
   //----------------------------------------------------------------------------------------------------
   })//then() callback
   }//render callback
   render('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
   
    })
    