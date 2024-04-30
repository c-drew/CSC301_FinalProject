
function init() {
// Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
// For details, see https://gojs.net/latest/intro/buildingObjects.html
const $ = go.GraphObject.make; // for conciseness in defining templates

// Must name or refer to the DIV HTML element
myDiagram = new go.Diagram('myDiagramDiv', {
    // automatically scale the diagram to fit the viewport's size
    initialAutoScale: go.AutoScale.Uniform,
    // disable user copying of parts
    allowCopy: false,
    // position all of the nodes and route all of the links
    layout: $(go.TreeLayout, {
        angle: 0,
        arrangement: go.TreeLayout.Horizontal,
        nodeSpacing: 10,
        layerSpacing: 40,
        // setsPortSpots: 0,
    }),
});

// replace the default Node template in the nodeTemplateMap
myDiagram.nodeTemplate = $(go.Node,
    'Auto', // the whole node panel
    $(go.Shape, 'RoundedRectangle',
    {
        name: 'SHAPE',
        width: 80,
        height: 30,
        fill: 'lightgray',
        portId: '', 
        fromLinkable: true,
        toLinkable: true,
        cursor: 'pointer', // makes the shape clickable
        click: function(e, obj) {  // click event handler to change colors
            changeColor(e, obj.part);
        }, 
    },
    new go.Binding("fill", "isElective", function(elective) {
        return elective ? "white" : "lightgray";
    }),
    // dynamically set the fill color based on the 'fill' property of the shape
    new go.Binding('fill', 'fill')),
    $(go.Panel, 'Vertical', 
    $(go.TextBlock, // the text label
        {
            font: '13px sans-serif', // default font
            isMultiline: false, // don't allow newlines
            margin: 5, 
            textAlign: 'center', 
            alignmentFocus: go.Spot.Center
        },
        // bind text to the 'key' property of the node data
        new go.Binding('text', 'key'),
        // dynamically set font weight to bold if the 'bold' property is true
        new go.Binding('font', 'bold', function(bold) {
            return bold ? 'bold 13px sans-serif' : '13px sans-serif';
        }))),
);

function changeColor(e, node) {
    var shape = node.findObject('SHAPE');
    var color = nextColor(shape.fill, myColors); // Use myColors array by default

    // Check if the node is elective and use the electiveColors array if so
    if (node.data.isElective) {
        color = nextColor(shape.fill, electiveColors);
    }

    // Update the node data with the new fill color
    node.diagram.model.commit(function(m) {
        m.set(node.data, 'fill', color);
        // If the node is elective and the new color is lightgreen, increment numElectivesFilled
        if (node.data.isElective && color === 'lightgreen') {
            m.set(node.data, 'numElectivesFilled', (node.data.numElectivesFilled || 0) + 1);
        }
    }, 'change color');

    // nodeColors[node.data.key] = color;

    updateLegend();
}

var myColors = ['lightgray', 'lightblue', 'lightgreen'];
var electiveColors = ['white', 'lightblue', 'lightgreen'];

// var nodeColorsString = JSON.stringify(nodeColors);

function nextColor(c, colors) {
    var idx = colors.indexOf(c);
    if (idx < 0)
        return colors[0];
    if (idx >= colors.length - 1)
        idx = -1;
    return colors[idx + 1];
}

// replace the default Link template in the linkTemplateMap
myDiagram.linkTemplate = $(go.Link,
    { curve: go.Curve.Bezier, toShortLength: 5 },
    $(go.Shape,
        { strokeWidth: 1 },
        new go.Binding("strokeDashArray", "orPrereq", function(orPrereq) {
            return orPrereq ? [4, 2] : null;
        })
    ),
    $(go.Shape,
        { toArrow: 'Standard', stroke: null }
    )
);
// Legend code (found on GoJS help page) will figure out later
// Define the legend content
var legendContent = $(go.Part,
    {
        layerName: "Grid",
        _viewPosition: new go.Point(0, 0)
    },
    $(go.Panel, "Table",
        { padding: new go.Margin(10, 5), defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 0, width: 100 }),
        $(go.RowColumnDefinition, { column: 1, width: 200 }),
        $(go.TextBlock, "In Progress", { row: 0, column: 0, stroke: "blue" }),
        $(go.TextBlock, "", { row: 0, column: 1, name: "inProgressText" }),
        $(go.TextBlock, "Completed", { row: 1, column: 0, stroke: "green" }),
        $(go.TextBlock, "", { row: 1, column: 1, name: "completedText" }),
        $(go.TextBlock, "Left", { row: 2, column: 0, stroke: "gray" }),
        $(go.TextBlock, "", { row: 2, column: 1, name: "leftText" })
    )
);

function updateLegend() {
    var inProgressCount = 0;
    var completedCount = 0;
    var leftCount = 0;

    myDiagram.nodes.each(function(node) {
        console.log("Node data:", node.data);
        if (node.data.fill === "lightblue") {
            inProgressCount++;
        } else if (node.data.fill === "lightgreen") {
            completedCount++;
        } else if (node.data.isElective === undefined) {
            leftCount++;
        }
    });

    var inProgressTextBlock = legendContent.findObject("inProgressText");
    var completedTextBlock = legendContent.findObject("completedText");
    var leftTextBlock = legendContent.findObject("leftText");

    if (inProgressTextBlock) inProgressTextBlock.text = inProgressCount.toString() + " Courses";
    if (completedTextBlock) completedTextBlock.text = completedCount.toString() + " Courses";
    if (leftTextBlock) leftTextBlock.text = leftCount.toString() + " Courses";

    legendContent.updateTargetBindings(); // Update the text blocks in the legend

}

// Add the legend to the diagram
myDiagram.add(legendContent);

// Update the legend's position when the viewport changes
myDiagram.addDiagramListener("ViewportBoundsChanged", function (e) {
    e.diagram.commit(function (dia) {
        dia.parts.each(function (part) {
            if (part._viewPosition) {
                part.position = new go.Point(dia.viewportBounds.right - part.actualBounds.width,
                    dia.viewportBounds.bottom - part.actualBounds.height);
                part.scale = 1 / dia.scale;
            }
        });
        // Update the legend
        updateLegend();
    }, null);
});

updateDiagram();
updateLegend();
}
