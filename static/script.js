
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
        return elective ? "white" : "gray";
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
    }, 'change color');
}

var myColors = ['lightgray', 'lightblue', 'lightgreen'];
var electiveColors = ['white', 'lightblue', 'lightgreen'];

function nextColor(c, colors) {
    var idx = colors.indexOf(c);
    if (idx < 0)
        return colors[0];
    if (idx >= colors.length - 1)
        idx = -1;
    return colors[idx + 1];
}

// replace the default Link template in the linkTemplateMap
myDiagram.linkTemplate = $(go.Link, // the whole link panel
    { curve: go.Curve.Bezier, toShortLength: 5 },
    $(go.Shape, // the link shape
    { strokeWidth: 1 }
    ),
    $(go.Shape, // the arrowhead
    { toArrow: 'Standard', stroke: null }
    )
);

myDiagram.add(
    $(go.Part,
      {
        layerName: "Grid",  // must be in a Layer that is Layer.isTemporary,
                            // to avoid being recorded by the UndoManager
        _viewPosition: new go.Point(0,0)  // some position in the viewport,
                                          // not in document coordinates
      },
      $(go.TextBlock, "A Legend", { font: "bold 24pt sans-serif", stroke: "green" })));

    // Whenever the Diagram.position or Diagram.scale change,
    // update the position of all simple Parts that have a _viewPosition property.
    myDiagram.addDiagramListener("ViewportBoundsChanged", function(e) {
        e.diagram.commit(function(dia) {
        // only iterates through simple Parts in the diagram, not Nodes or Links
        dia.parts.each(function(part) {
            // and only on those that have the "_viewPosition" property set to a Point
            if (part._viewPosition) {
            part.position = new go.Point(dia.viewportBounds.right-part.actualBounds.width,
                                        dia.viewportBounds.bottom-part.actualBounds.height);
            part.scale = 1/dia.scale;
            }
        })
        }, null);  // temporarily set skipsUndoManager to true, to avoid recording these changes
    });

updateDiagram();
}