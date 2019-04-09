//		a matrix viewer
//
//		Colin Combe, Martin Graham
//		Rappsilber Laboratory, 2015

var CLMSUI = CLMSUI || {};

CLMSUI.GoTermsViewBB = CLMSUI.utils.BaseFrameView.extend({

    events: function() {
        var parentEvents = CLMSUI.utils.BaseFrameView.prototype.events;
        if (_.isFunction(parentEvents)) {
            parentEvents = parentEvents();
        }
        return _.extend({}, parentEvents, {
            // "mousemove .mouseMat": "brushNeighbourhood",
            // "mousemove .clipg": "brushNeighbourhood",
            // "mouseleave .viewport": "cancelHighlights",
            // "mouseleave .clipg": "cancelHighlights",
            // "input .dragPanRB": "setMatrixDragMode",
        });
    },

    defaultOptions: {
        // xlabel: "Residue Index 1",
        // ylabel: "Residue Index 2",
        // chartTitle: "Cross-Link Matrix",
        // chainBackground: "white",
        // matrixObj: null,
        // selectedColour: "#ff0",
        // highlightedColour: "#f80",
        // linkWidth: 5,
        // tooltipRange: 7,
        // matrixDragMode: "Pan",
        margin: {
            top: 30,
            right: 20,
            bottom: 40,
            left: 60
        },
        // exportKey: true,
        // exportTitle: true,
        // canHideToolbarArea: true,
        // canTakeImage: true,
    },

    initialize: function(viewOptions) {
        CLMSUI.DistanceMatrixViewBB.__super__.initialize.apply(this, arguments);

        var self = this;

        // targetDiv could be div itself or id of div - lets deal with that
        // Backbone handles the above problem now - element is now found in this.el
        //avoids prob with 'save - web page complete'
        var mainDivSel = d3.select(this.el).classed("goTermsView", true);

        var flexWrapperPanel = mainDivSel.append("div")
            .attr("class", "verticalFlexContainer");

        var controlDiv = flexWrapperPanel.append("div").attr("class", "toolbar toolbarArea");
        this.termSelect = controlDiv.append("label")
            .attr("class", "btn selectHolder")
            .append("span")
            //.attr("class", "noBreak")
            .text("Term Type ►")
            .append("select")
            .attr("id", mainDivSel.attr("id") + "goTermSelect")
            .on("change", function(d) {
                var value = this.value;
                var selectedDatum = d3.select(this).selectAll("option")
                    .filter(function(d) {
                        return d3.select(this).property("selected");
                    })
                    .datum();
                //self.setAndShowPairing(selectedDatum.value);
                var selElem = d3.select(d3.event.target);
                //setSelectTitleString(selElem);
            });


        var chartDiv = flexWrapperPanel.append("div")
            .attr("class", "panelInner")
            .attr("flex-grow", 1)
            .style("position", "relative");

        var viewDiv = chartDiv.append("div")
            .attr("class", "viewDiv");


        // SVG element
        this.svg = viewDiv.append("svg");

        this.vis = this.svg.append("g")
            .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")");

        this.diagonal = d3.svg.diagonal()
            .projection(function(d) {
                return [d.y, d.x];
            });

        this.duration = 750;

        // d3.select(self.frameElement).style("height", "500px");
        var self = this;
        this.listenTo(CLMSUI.vent, "goAnnotationsUpdated", this.update);
        // any property changing in the filter model means rerendering this view
        // this.listenTo(this.model, "change:selection filteringDone currentColourModelChanged", this.renderCrossLinks);
        // this.listenTo(this.model, "change:highlights", function () { this.renderCrossLinks ({rehighlightOnly: true}); });
        // this.listenTo(this.model, "change:linkColourAssignment", this.render);
        // this.listenTo(this.colourScaleModel, "colourModelChanged", this.render); // colourScaleModel is pointer to distance colour model, so thsi triggers even if not current colour model (redraws background)
        // this.listenTo(this.model.get("clmsModel"), "change:distancesObj", this.distancesChanged); // Entire new set of distances
        // this.listenTo(this.model.get("clmsModel"), "change:matches", this.matchesChanged); // New matches added (via csv generally)
        // this.listenTo(CLMSUI.vent, "distancesAdjusted", this.render); // Existing residues/pdb but distances changed

        // var treeData = [{
        //     "name": "Top Level",
        //     "parent": "null",
        //     "children": [{
        //             "name": "Level 2: A",
        //             "parent": "Top Level",
        //             "children": [{
        //                     "name": "Son of A",
        //                     "parent": "Level 2: A"
        //                 },
        //                 {
        //                     "name": "Daughter of A",
        //                     "parent": "Level 2: A"
        //                 }
        //             ]
        //         },
        //         {
        //             "name": "Level 2: B",
        //             "parent": "Top Level"
        //         }
        //     ]
        // }];
        this.i = 0;
        // this.update(treeData);
    },

    update: function() {

        var termSelectData = ["biological_ process"]

        var options = this.termSelect.selectAll("option")
            .data(termSelectData)
            .enter()
            .append("option");

        // Set the text and value for your options

        options.text(function(d) {
                return d;
            })
            .attr("value", function(d) {
                return d;
            });


        // ************** Generate the tree diagram	 *****************

        // Firefox returns 0 for an svg element's clientWidth/Height, so use zepto/jquery width function instead
        var jqElem = $(this.svg.node());
        var cx = jqElem.width(); //this.svg.node().clientWidth;
        var cy = jqElem.height(); //this.svg.node().clientHeight;
        var margin = this.options.margin;
        var width = Math.max(0, cx - margin.left - margin.right);
        var height = Math.max(0, cy - margin.top - margin.bottom);

        this.tree = d3.layout.tree()
            .size([height, width]);


        var groupMap = new Map();
        var go = CLMSUI.compositeModelInst.get("go");
        var self = this;
        function checkTerm(term) {
            if (term.namespace == "biological_process") {
                if (!groupMap.has(term.id)) {
                    var group = {};
                    group.name= term.name;
                    group.id = term.id;
                    group._children = [];

                    if (term.is_a){
                        var parentTerm = go.get(term.is_a.split(" ")[0]);
                        var parentGroup = checkTerm(parentTerm);
                        // if (parentGroup) {
                            group.parent = parentGroup.name;
                            parentGroup._children.push(group);
                        // }
                    }
                    else if (term.id == "GO:0008150"){
                        self.root = group;
                    }
                    groupMap.set(group.id, group);
                    return group;
                }
                else {
                    return groupMap.get(term.id);
                }
            }
            return null;
        }

        if (go) {
            for (var t of go.values()) {
                checkTerm(t);
            }
        }

        this.root.x0 = height / 2;
        this.root.y0 = 0;
        this.root.children = this.root._children;
        this.root._children = null;
        this.render(this.root);
    },

    render: function(source) {
        if (this.tree) {
            // Compute the new tree layout.
            var nodes = this.tree.nodes(this.root).reverse(),
                links = this.tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) {
                d.y = d.depth * 180;
            });

            //var i = 0;
            var self = this;
            // Update the nodes…
            var node = this.vis.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++self.i);
                });

            var self = this;
            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", function(d) {
                    self.click(d);
                });

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeEnter.append("text")
                .attr("x", function(d) {
                    return d.children || d._children ? -13 : 13;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    return d.name;
                })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(self.duration)
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            nodeUpdate.select("circle")
                .attr("r", 10)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(self.duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = this.vis.selectAll("path.goLink")
                .data(links, function(d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "goLink")
                .attr("d", function(d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return self.diagonal({
                        source: o,
                        target: o
                    });
                });

            // Transition links to their new position.
            link.transition()
                .duration(self.duration)
                .attr("d", self.diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(self.duration)
                .attr("d", function(d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return self.diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
        return this;
    },

    // Toggle children on click.
    click: function(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.render(d);
    },

    relayout: function() {
        this.resize();
        return this;
    },

    // called when things need repositioned, but not re-rendered from data
    resize: function() {
                // Firefox returns 0 for an svg element's clientWidth/Height, so use zepto/jquery width function instead
                var jqElem = $(this.svg.node());
                var cx = jqElem.width(); //this.svg.node().clientWidth;
                var cy = jqElem.height(); //this.svg.node().clientHeight;
                var margin = this.options.margin;
                var width = Math.max(0, cx - margin.left - margin.right);
                var height = Math.max(0, cy - margin.top - margin.bottom);
        //this.update(this.treeData2);
        this.tree.size([height, width]);
        return this;
    },

    identifier: "Go Terms View",
});