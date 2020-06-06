//Extraemos Data de Samples.json//
var data = d3.json("samples.json");
//se genera la funcion principal//
function getPlot(id) {
//descargamos la info de metdata//
  d3.json("samples.json").then((data)=> {
      console.log(data)
      
      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)   
      var samples = data.samples.filter(s => s.id.toString() === id)[0];
      console.log(samples);     
        var samplevalues = samples.sample_values.slice(0, 10).reverse();      
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        //obtener el id de la variable deseada para el plot//      
        var OTU_id = OTU_top.map(d => "OTU" + d)
        var labels = samples.otu_labels.slice(0, 10);    
        var imprint = {     
        x: samplevalues,
        y: OTU_id,
        text: labels,
        marker: {
            color: 'rgb(142,124,195)'},
        type: "bar",
        orientation : "h",
        };
        
        //se geenera la variable de la data y las de layout//
        var data = [imprint];
        var layout = {
            title: " TOP 10 OTU",
            yaxis:{
                tickmode:"linear",},
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
        
        //grafica de barras y layout//
        
        Plotly.newPlot("bar", data, layout);
        
        //grafica burbuja//
    var ImprintB = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        text: samples.otu_labels};
        
    var layout_b = {
        xaxis: { title: "OTU ID" },
        height: 600,
        width: 1000
    };
        var dataB = [ImprintB];    
        Plotly.newPlot("bubble", dataB, layout_b);     
        //grafica de calibre//       
        var data_G = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: parseFloat(wfreq),
                counter: true,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",        
                mode: "gauge+number+delta",
                gauge: {
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 2], color: "rgba(14, 127, 0, .5)" },
                        { range: [2, 4], color: "rgba(170, 202, 42, .5)" },
                        { range: [4, 6], color: "rgba(202, 209, 95, .5)" },
                        { range: [6, 8], color: "rgba(240, 230, 215, .5)" },
                        { range: [8, 9], color: "rgba(255, 255, 255, 0)" },
                    ]
                }
            }
        ];
        var layout_G = {
            width: 700,
            height: 600,
            font: {
                color: "black", family: "Arial"},
            margin: {t: 20,b: 40,l:100,r:100}};
    Plotly.newPlot("gauge", data_G,layout_G);});
}
function getInfo(id){
      d3.json("samples.json"). then ((data)=>{
          var metadata= data.metadata;
            console.log(metadata)
          var result = metadata.filter(meta => meta.id.toString() === id)[0];  
          var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");});
    });
}
function optionChanged(id) {
    getPlot(id);
    getInfo(id); 
}
function init(){
    var dropd = d3.select("#selDataset");
    d3.json("samples.json").then ((data)=>{
        console.log(data);
        data.names.forEach(function(name){dropd.append("option").text(name).property("value");});
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();