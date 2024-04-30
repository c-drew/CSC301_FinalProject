function updateDiagram() {
    
    var selectedMajor1 = document.getElementById('majorDropdown1').value;
    var selectedMajor2 = document.getElementById('majorDropdown2').value;
    var selectedMinor1 = document.getElementById('minorDropdown1').value;
    var selectedMinor2 = document.getElementById('minorDropdown2').value;

    var selectedMajors = [];
    if (selectedMajor1) {
        selectedMajors.push(selectedMajor1);
    }
    if (selectedMajor2) {
        selectedMajors.push(selectedMajor2);
    }

    var selectedMinors = [];
    if (selectedMinor1) {
        selectedMinors.push(selectedMinor1);
    }
    if (selectedMinor2) {
        selectedMinors.push(selectedMinor2);
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
                addNode('ACC 420', isElective = true);
                addNode('BIS 305', isElective = true);
                addNode('BIS 340', isElective = true);
                addNode('BIS 362', isElective = true);
                addNode('BIS 364', isElective = true);
                addNode('BIS 365', isElective = true);
                addNode('BIS 367', isElective = true);
                addNode('BIS 368', isElective = true);
                addNode('BIS 437', isElective = true);
                addNode('BIS 442', isElective = true);
                addNode('BIS 447', isElective = true);
                addNode('BIS 480', isElective = true);
                addNode('OSC 467', isElective = true);
    
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
            case 'CSC':
                addNode('CSC 180');
                addNode('CSC 210');
                addNode('CSC 231');
                addNode('CSC 251');
                addNode('CSC 270');
                addNode('CSC 320');
                addNode('CSC 335');
                addNode('CSC 341');
                addNode('CSC 440');
                addNode('CSC 445');
                addNode('CSC 450');
    
                addNode('MAT 155')
                addNode('MAT 230');
                addNode('MAT 243');
    
                // Electives
                addNode('CSC 301', isElective = true);
                addNode('CSC 305', isElective = true);
                addNode('CSC 311', isElective = true);
                addNode('CSC 314', isElective = true);
                addNode('CSC 340', isElective = true);
                addNode('CSC 360', isElective = true);
                addNode('CSC 375', isElective = true);
            // more to be added
        }
    });

    selectedMinors.forEach(function(minor) {
        switch (minor) {
            case 'BIS_m':
                addNode('BIS 205'); 
                addNode('BIS 361'); 
                addNode('BIS 370'); 
                addNode('BIS 305', isElective = true, numElectives = 2);
                addNode('BIS 340', isElective = true, numElectives = 2);
                addNode('BIS 373', isElective = true, numElectives = 2);
                addNode('BIS 375', isElective = true, numElectives = 2);
                addNode('BIS 430', isElective = true, numElectives = 2);
                addNode('BIS 437', isElective = true, numElectives = 2);
                addNode('BIS 442', isElective = true, numElectives = 2);
                addNode('BIS 447', isElective = true, numElectives = 2);
                addNode('BIS 449', isElective = true, numElectives = 2);

                addNode('ACC 201', isElective = true, numElectives2 = 1);
                addNode('BUS 201', isElective = true, numElectives2 = 1);
                addNode('BUS 225', isElective = true, numElectives2 = 1);
                addNode('FIN 245', isElective = true, numElectives2 = 1);
                addNode('OSC 260', isElective = true, numElectives2 = 1);
            break;
            case 'BUAL_m':
                addNode('BIS 205'); 
                addNode('ECO 215'); 
                addNode('BIS 373'); 
                addNode('BIS 305'); 
                addNode('BIS 447'); 
                addNode('BIS 449');

                addNode('FIN 346', isElective = true, numElectives = 1); 
                addNode('OSC 360', isElective = true, numElectives = 1); 
                addNode('OSC 363', isElective = true, numElectives = 1); 
                addNode('BUS 428', isElective = true, numElectives = 1); 
                addNode('BUS 380', isElective = true, numElectives = 1); 
                addNode('BUS 433', isElective = true, numElectives = 1); 
                addNode('ECO 305', isElective = true, numElectives = 1); 
            break;
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
            case 'CSC':
                linkDataArray.push(
                    { from: 'CSC 210', to: 'CSC 231' },
                    { from: 'CSC 210', to: 'CSC 251' },
                    { from: 'CSC 231', to: 'CSC 270' },
                    { from: 'CSC 231', to: 'CSC 301' },
                    { from: 'CSC 210', to: 'CSC 305' },
                    { from: 'CSC 202', to: 'CSC 305' }, // CHECK THIS
                    { from: 'CSC 210', to: 'CSC 311' },
                    { from: 'CSC 210', to: 'CSC 314' },
                    { from: 'CSC 202', to: 'CSC 314' },
                    { from: 'T2NS', to: 'CSC 314' },
                    { from: 'CSC 210', to: 'CSC 315' },
                    { from: 'CSC 202', to: 'CSC 315' },
                    { from: 'CSC 210', to: 'CSC 320' },
                    { from: 'MAT 230', to: 'CSC 320' },
                    { from: 'CSC 270', to: 'CSC 335' },
                    { from: 'CSC 270', to: 'CSC 340' },
                    { from: 'CSC 270', to: 'CSC 341' },
                    { from: 'CSC 270', to: 'CSC 335' },
                    { from: 'CSC 270', to: 'CSC 375' },
                    { from: 'CSC 270', to: 'CSC 440' },
                    { from: 'CSC 270', to: 'CSC 445' },
                );
                break;
    
            // more to be added
        }
    });
    selectedMinors.forEach(function(minor) {
        switch (minor) {
            case 'BIS_m':
                linkDataArray.push(
                { from: 'BIS 205', to: 'BIS 361' }, 
                { from: 'BIS 205', to: 'BIS 370' }, 
                { from: 'BIS 205', to: 'BIS 373' }, 

                { from: 'BIS 205', to: 'BIS 305' },
                { from: 'ECO 215', to: 'BIS 305' },

                { from: 'BIS 361', to: 'BIS 375' },
                { from: 'BIS 361', to: 'BIS 437' },
                { from: 'BIS 370', to: 'BIS 340' },
                { from: 'BIS 361', to: 'BIS 442' },
                { from: 'BIS 373', to: 'BIS 447' },
                { from: 'BIS 370', to: 'BIS 430' },
                { from: 'BIS 305', to: 'BIS 449', orPrereq: true},
                { from: 'BIS 447', to: 'BIS 449', orPrereq: true },

                { from: 'ACC 201', to: 'FIN 245', orPrereq: true },

                );
            break;
            case 'BUAL_m': 
                linkDataArray.push(
                { from: 'BIS 205', to: 'BIS 373' },
                { from: 'BIS 205', to: 'BIS 373' },
                { from: 'BIS 205', to: 'BIS 373' },
                { from: 'ECO 215', to: 'BIS 305' },
                { from: 'ECO 215', to: 'OSC 363' },
                { from: 'BIS 373', to: 'BIS 447' },
                { from: 'BIS 305', to: 'BIS 449', orPrereq: true},
                { from: 'BIS 447', to: 'BIS 449', orPrereq: true },
                )
            break;
        }
    });

    myDiagram.model = new go.GraphLinksModel({
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray,
    })
}

window.addEventListener('DOMContentLoaded', init);
