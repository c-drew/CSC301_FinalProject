function updateDiagram() {
    var selectedMajor1 = document.getElementById('majorDropdown1').value;
    var selectedMajor2 = document.getElementById('majorDropdown2').value;

    var selectedMajors = [];
    if (selectedMajor1) {
        selectedMajors.push(selectedMajor1);
    }
    if (selectedMajor2) {
        selectedMajors.push(selectedMajor2);
    }

    var nodeDataArray = [];
    var linkDataArray = [];

    var nodeCountMap = new Map();

    selectedMajors.forEach(function(major) {
        switch (major) {
            case 'BIS':
                addNode('T1M');
                addNode('T1SS');

                addNode('ACC 201');

                addNode('BIS 205');
                addNode('BIS 361');
                addNode('BIS 370');
                addNode('BIS 373');
                addNode('BIS 375');
                addNode('BIS 430');
                addNode('BIS 461');
                addNode('BIS 490');

                addNode('BUS 201');
                addNode('BUS 225');

                addNode('CSC 110*');
                addNode('CSC 251*');

                addNode('ECO 201');
                addNode('ECO 215');

                addNode('FIN 245');

                addNode('OSC 260');

                // Electives: 
                addNode('ACC 420', 1);
                addNode('BIS 305', 1);
                addNode('BIS 340', 1);
                addNode('BIS 362', 1);
                addNode('BIS 364', 1);
                addNode('BIS 365', 1);
                addNode('BIS 367', 1);
                addNode('BIS 368', 1);
                addNode('BIS 437', 1);
                addNode('BIS 442', 1);
                addNode('BIS 447', 1);
                addNode('BIS 480', 1);
                addNode('OSC 467', 1);

                break;
            case 'ACC':
                addNode('T1M');
                addNode('T1SS');

                addNode('ACC 201');
                addNode('ACC 202');
                addNode('ACC 301');
                addNode('ACC 302');
                addNode('ACC 303');
                addNode('ACC 310');
                addNode('ACC 311');
                addNode('ACC 410');
                addNode('ACC 411');
                addNode('ACC 412');
                addNode('ACC 416');
                addNode('ACC 420');

                addNode('BUS 201');
                addNode('BUS 225');
                addNode('BUS 250');
                addNode('BUS 300');

                addNode('ECO 200');
                addNode('ECO 201');
                addNode('ECO 215');

                addNode('FIN 245');
                addNode('OSC 260');

                break;
            // more to be added
        }
    });

    function updateLayout() {
        myDiagram.startTransaction('updateLayout');
    
        // Create a map to store the highest grandparent node's position
        var highestPositions = new go.Map();
    
        // Iterate over all nodes to find the highest grandparent node's position
        myDiagram.nodes.each(function(node) {
            if (!node.findNodesInto().count && !node.findNodesOutOf().count) {
                var key = node.data.key;
                var parent = node.findTreeParentNode();
                while (parent && parent.findTreeParentNode()) {
                    parent = parent.findTreeParentNode();
                }
                if (parent) {
                    var parentKey = parent.data.key;
                    if (!highestPositions.has(parentKey)) {
                        highestPositions.set(parentKey, node.location.copy());
                    } else {
                        var pos = highestPositions.get(parentKey);
                        if (node.location.y < pos.y) {
                            highestPositions.set(parentKey, node.location.copy());
                        }
                    }
                }
            }
        });
    
        // Position nodes based on the highest grandparent node's position
        myDiagram.nodes.each(function(node) {
            if (!node.findNodesInto().count && !node.findNodesOutOf().count) {
                var key = node.data.key;
                var parent = node.findTreeParentNode();
                while (parent && parent.findTreeParentNode()) {
                    parent = parent.findTreeParentNode();
                }
                if (parent) {
                    var parentKey = parent.data.key;
                    if (highestPositions.has(parentKey)) {
                        var pos = highestPositions.get(parentKey);
                        node.location = new go.Point(pos.x, node.location.y);
                    }
                }
            }
        });
    
        myDiagram.commitTransaction('updateLayout');
    }

    function addNode(key, isElective) {
        if (!nodeCountMap.has(key)) {
            nodeCountMap.set(key, 1);
            nodeDataArray.push({ key: key, bold: false, isElective: isElective });
            updateLayout();
        } else {
            nodeCountMap.set(key, nodeCountMap.get(key) + 1);
            // Set bold property to nodes appearing more than once (double counts)
            var nodeIndex = nodeDataArray.findIndex(node => node.key === key);
            if (nodeIndex !== -1 && (!key.startsWith('T1') && !key.startsWith('T2'))) {
                nodeDataArray[nodeIndex].bold = true;
            }
        }
    }

    // Generate links based on selected majors
    selectedMajors.forEach(function(major) {
        switch (major) {
            case 'BIS':
                linkDataArray.push(
                    { from: 'T1M', to: 'BIS 205' },
                    { from: 'T1M', to: 'ECO 215' },
                    { from: 'T1M', to: 'FIN 245' },
                    { from: 'T1SS', to: 'ECO 201' },

                    { from: 'ACC 201', to: 'FIN 245' },

                    { from: 'BIS 205', to: 'BIS 361' },
                    { from: 'BIS 205', to: 'BIS 373' },
                    { from: 'BIS 205', to: 'BIS 365' },
                    { from: 'BIS 205', to: 'BIS 370' },
                    { from: 'BIS 361', to: 'BIS 375' },
                    { from: 'BIS 361', to: 'BIS 437' },
                    { from: 'BIS 373', to: 'BIS 447' },
                    { from: 'BIS 370', to: 'BIS 430' },
                    { from: 'BIS 370', to: 'BIS 461' },
                    { from: 'BIS 370', to: 'BIS 340' },
                    { from: 'BIS 205', to: 'BIS 364' },
                    { from: 'BIS 361', to: 'BIS 367' },
                    { from: 'BIS 361', to: 'BIS 442' },
                    { from: 'BIS 370', to: 'BIS 367' },
                    { from: 'BIS 370', to: 'BIS 368' },

                    { from: 'CSC 110*', to: 'CSC 251*' },

                    { from: 'ECO 215', to: 'OSC 260' },
                    { from: 'BIS 205', to: 'BIS 305' },
                    { from: 'ECO 215', to: 'BIS 305' },

                );
                break;
            case 'ACC':
                linkDataArray.push(
                    { from: 'ACC 201', to: 'ACC 202' }, 
                    { from: 'ACC 201', to: 'ACC 301' }, 
                    { from: 'ACC 301', to: 'ACC 302' }, 
                    { from: 'ACC 302', to: 'ACC 303' }, 
                    { from: 'ACC 302', to: 'ACC 310' },
                    { from: 'ACC 310', to: 'ACC 311' },
                    { from: 'ACC 302', to: 'ACC 311' },
                    { from: 'ACC 303', to: 'ACC 410' },
                    { from: 'ACC 310', to: 'ACC 410' },
                    { from: 'ACC 303', to: 'ACC 411' },
                    { from: 'ACC 311', to: 'ACC 411' },
                    { from: 'ACC 302', to: 'ACC 412' },
                    { from: 'ACC 301', to: 'ACC 416' },
                    { from: 'ACC 301', to: 'ACC 420' },
                    { from: 'ACC 302', to: 'ACC 420' },
                    { from: 'ACC 310', to: 'ACC 420' },

                    { from: 'T1M', to: 'ECO 215' },
                    { from: 'T1SS', to: 'ECO 201' },

                    { from: 'T1M', to: 'FIN 245' },
                    { from: 'ACC 201', to: 'FIN 245' },

                    { from: 'ECO 215', to: 'OSC 260' },

                    { from: 'BUS 250', to: 'BUS 300' },
                );
                break;
            // more to be added
        }
    });

    myDiagram.model = new go.GraphLinksModel({
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray,
    });
}

window.addEventListener('DOMContentLoaded', init);
