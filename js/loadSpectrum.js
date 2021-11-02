import d3 from "d3";

export const loadSpectrum = function (match, randId) {
    if (match.spectrum && match.spectrum.pks) {
        const formatted_data = {};

        formatted_data.sequence1 = match.matchedPeptides[0].seq_mods;
        formatted_data.linkPos1 = match.linkPos1 - 1;
        if (match.matchedPeptides[1]) {
            formatted_data.sequence2 = match.matchedPeptides[1].seq_mods;
            formatted_data.linkPos2 = match.linkPos2 - 1;
        }
        formatted_data.crossLinkerModMass = match.crosslinkerModMass();
        formatted_data.modifications = window.compositeModelInst.get("clmsModel").get("modifications");
        formatted_data.precursorCharge = match.precursorCharge;
        formatted_data.fragmentTolerance = match.fragmentTolerance();
        //formatted_data.customConfig = CLMSUI.compositeModelInst.get("clmsModel").get("searches").get(match.searchId).customsettings.split('\n');

        const ions = match.ionTypes();
        formatted_data.ionTypes = ions.map(function (ion) {
            return ion.type.replace("Ion", "");
        }).join(";");
        formatted_data.precursorMZ = match.expMZ();
        formatted_data.requestID = match.id;

        console.log("loadSpectrum match:" + match.id);

        d3.json("../CLMS-model/php/peakList.php?upload=" + match.searchId + "-" + randId + "&spid=" + match.spectrumId, function (error, json) {
            if (error) {
                console.log("error getting peak list", json);
            } else {
                d3.select("#range-error").text("");


                console.log(json);
                const peakArray = [];
                const peakCount = json.mz.length;
                for (let i = 0; i < peakCount; i++) {
                    peakArray.push([json.mz[i], json.intensity[i]]);
                }

                formatted_data.peakList = peakArray; //JSON.parse(text).map(function(p){ return [p.mz, p.intensity]; });
                console.log(formatted_data);
                window.xiSPEC.setData(formatted_data);
            }
        });
    }
};
