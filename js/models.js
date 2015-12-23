(function(global) {
    "use strict";

    global.CLMSUI = global.CLMSUI || {};
    
    global.CLMSUI.BackboneModelTypes = global._.extend (global.CLMSUI.BackboneModelTypes || {}, 
    
    {
        
        DistancesModel: global.Backbone.Model.extend({
            flattenedDistances: function () {
                return global.CLMSUI.modelUtils.flattenDistanceMatrix (this.get("distances"));
            }
        }),
        
        FilterModel: global.Backbone.Model.extend ({
            initialize: function () {
                this.set ({
                    "A": true, "B": true, "C": true, "Q": false,
                    "AUTO": false,
                    "selfLinks": true, "ambig": true,
                    "cutoff": [0,100]
                });   
            },

            filter: function (match) {
                match = match[0];
                var vChar = match.validated;
                var scorePass = (!match.score || (match.score >= this.get("cutoff")[0] && match.score <= this.get("cutoff")[1]));
                if (!scorePass) { return false; }

                if (vChar == 'A' && this.get("A")) return true;
                if (vChar == 'B' && this.get("B")) return true;
                if (vChar == 'C' && this.get("C")) return true;
                if (vChar == '?' && this.get("Q")) return true;
                if (match.autovalidated && this.get("AUTO")) return true;
                return false;
            }
        }),
        
            
        RangeModel: global.Backbone.Model.extend ({
            initialize: function () {
                this
                    .set ("active", false)
                ;
            }
        }),

            // I want MinigramBB to be model agnostic so I can re-use it in other places
        MinigramModel: global.Backbone.Model.extend ({
            data: function() { return [1,2,3,4]; },
            initialize: function () {
                this.set ({domainStart: 0, domainEnd: 100});
            }
        }),
        
        TooltipModel: global.Backbone.Model.extend ({
            initialize: function () {
                this
                    .set("location", null)
                    .set("header", "Tooltip")
                    .set("contents", ["Can show", "single items", "lists or", "tables"])
                ;
            }
        }),
        
    } );
 
})(this);