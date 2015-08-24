<!--
//  CLMS-UI
//  Copyright 2015 Colin Combe, Rappsilber Laboratory, Edinburgh University
//
//  This file is part of CLMS-UI.
//
//  CLMS-UI is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  CLMS-UI is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with CLMS-UI.  If not, see <http://www.gnu.org/licenses/>.
-->
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="common platform for downstream analysis of CLMS data" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">

		<link rel="stylesheet" href="./css/reset.css" />
		<link rel="stylesheet" type="text/css" href="./css/byrei-dyndiv_0.5.css">
		<link rel="stylesheet" href="./css/style.css" />
		<link rel="stylesheet" href="./css/xiNET.css">

		<script type="text/javascript" src="./vendor/signals.js"></script>
        <script type="text/javascript" src="./vendor/byrei-dyndiv_1.0rc1-src.js"></script>
        <script type="text/javascript" src="./vendor/d3.js"></script>
        <script type="text/javascript" src="./vendor/colorbrewer.js"></script>
       	<script type="text/javascript" src="./vendor/FileSaver.js"></script>
        <script type="text/javascript" src="./vendor/Blob.js"></script>
        <script type="text/javascript" src="./vendor/rgbcolor.js"></script>
		
		<script type="text/javascript" src="/js/build/ngl.embedded.min.js"></script>
		
        <!--spectrum dev-->
        <script type="text/javascript" src="../spectrum/src/SpectrumViewer.js"></script>
        <script type="text/javascript" src="../spectrum/src/PeptideFragmentationKey.js"></script>
        <script type="text/javascript" src="../spectrum/src/graph/Graph.js"></script>
        <script type="text/javascript" src="../spectrum/src/graph/Peak.js"></script>
        <script type="text/javascript" src="../spectrum/src/graph/PeakAnnotation.js"></script>

		<script type="text/javascript" src="../distance-slider/DistanceSlider.js"></script>
        

        <!--xiNET dev-->
        <script type="text/javascript" src="../crosslink-viewer/src/controller/Init.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/MouseEvents.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/TouchEvents.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/Layout.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/Refresh.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/ToolTips.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/model/Match.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/model/Link.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/model/Protein.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/model/Annotation.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/model/ProteinLink.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/model/ResidueLink.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/ExternalControls.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/Rotator.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/xiNET_Storage.js"></script>
        <script type="text/javascript" src="../crosslink-viewer/src/controller/ReadCSV.js"></script>
    </head>
    <body>
		<div class="dynDiv_setLimit"><!-- div limiting movement of floaty panels -->

			<div class="dynDiv" id="keyPanel">
				<div class="dynDiv_moveParentDiv"><i class="fa fa-times-circle" onclick="keyPanel(false);"></i></div>
				<div class="panelInner">
					<div id="key"><img id="defaultLinkKey" src="./images/fig3_1.svg"><br><img id="logo" src="./images/logos/rappsilber-lab-small.png"></div>
				</div>					
				<div class="dynDiv_resizeDiv_tl"></div>
				<div class="dynDiv_resizeDiv_tr"></div>
				<div class="dynDiv_resizeDiv_bl"></div>
				<div class="dynDiv_resizeDiv_br"></div>
			</div>

			<div class="dynDiv helpPanel" id="helpPanel">
				<div class="dynDiv_moveParentDiv"><i class="fa fa-times-circle" onclick="helpPanel(false);"></i></div>
				<div class="panelInner">
					<table>
						<tbody>
							<tr>
								<td>Toggle the proteins between a bar and a circle</td>
								<td>Click on protein</td>
							</tr>
							<tr>
								<td>Zoom</td>
								<td>Mouse wheel</td>
							</tr>
							<tr>
								<td>Pan</td>
								<td>Click and drag on background</td>
							</tr>
							<tr>
								<td>Move protein</td>
								<td>Click and drag on protein</td>
							</tr>
							<tr>
								<td>Expand bar <br>(increases bar length until sequence is visible)</td>
								<td>Shift_left-click on protein</td>
							</tr>
							<tr>
								<td>Rotate bar</td>
								<td>Click and drag on handles that appear at end of bar</td>
							</tr>
							<tr>
								<td>Hide/show protein (and all links to it)</td>
								<td>Right-click on protein</td>
							</tr>
							<tr>
								<td>Hide links between two specific proteins</td>
								<td>Right click on any link between those proteins</td>
							</tr>
							<tr>
								<td>Show all hidden links</td>
								<td>Right click on background</td>
							</tr>
							<tr>
								<td>'Flip' self-links</td>
								<td>Right-click on self-link</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="dynDiv_resizeDiv_tl"></div>
				<div class="dynDiv_resizeDiv_tr"></div>
				<div class="dynDiv_resizeDiv_bl"></div>
				<div class="dynDiv_resizeDiv_br"></div>
			</div>

			<div class="dynDiv" id="spectrumPanel">
				<div class="dynDiv_moveParentDiv"><i class="fa fa-times-circle" onclick="spectrumPanel(false);"></i></div>
				<div class="panelInner" id='spectrumDiv'></div>
				<div class="dynDiv_resizeDiv_tl"></div>
				<div class="dynDiv_resizeDiv_tr"></div>
				<div class="dynDiv_resizeDiv_bl"></div>
				<div class="dynDiv_resizeDiv_br"></div>
			</div>
			
			<div class="dynDiv" id="nglPanel">
				<div class="dynDiv_moveParentDiv"><i class="fa fa-times-circle" onclick="nglPanel(false);"></i></div>
				<div class="panelInner" id='nglDiv'></div>
				<div class="dynDiv_resizeDiv_tl"></div>
				<div class="dynDiv_resizeDiv_tr"></div>
				<div class="dynDiv_resizeDiv_bl"></div>
				<div class="dynDiv_resizeDiv_br"></div>
			</div>
			
		</div><!-- div limiting movement of floaty panels -->

		<!-- Main -->
		<div id="main">

			<div class="container">
				<h1 class="page-header">
					<i class="fa fa-home" onclick="window.location = './history.php';"></i>
<!--
					<select id="viewSelect" onChange="">
						<input>None</input>
						<input selected>Custom</input>
					</select>
-->
					<p class="btn">Layout:</p>
					<button class="btn btn-1 btn-1a" onclick="saveLayout();">Save</button>
					<button class="btn btn-1 btn-1a" onclick="xlv.reset();">Reset</button>
					<p class="btn">Export:</p>
					<button class="btn btn-1 btn-1a" onclick="xlv.exportLinksCSV();">Links</button>
					<button class="btn btn-1 btn-1a" onclick="xlv.exportMatchesCSV();">Matches</button>
					<button class="btn btn-1 btn-1a" onclick="residueCount();">Residues</button>
					<button class="btn btn-1 btn-1a" onclick="xlv.exportSVG();">SVG</button>
					<label class="btn">3D<input id="keyChkBx" onclick="nglPanel(this.checked);" type="checkbox"></label>
					<label class="btn">Key<input id="keyChkBx" onclick="keyPanel(this.checked);" type="checkbox"></label>
					<label class="btn" style="padding-left:0px;">Selection<input id="selectionChkBx" onclick="selectionPanel(this.checked)" type="checkbox"></label>
					<label class="btn" style="padding-left:0px;">Help<input id="helpChkBx" onclick="helpPanel(this.checked)" type="checkbox"></label>
				</h1>
   	 		</div>

			<div>
				<div id="topDiv"></div>
				<div id=splitterDiv class="horizontalSplitter"><i class="fa fa-times-circle" onclick="selectionPanel(false);"></i></div>
				<div id="bottomDiv"><div id="selectionPanel" class="panelInner"><p>No selection.</p></div></div>
			</div>

			<div class="controls">
					<label>A
						<input checked="checked"
								   id="A"
								   onclick="xlv.checkLinks();"
								   type="checkbox"
							/>
					</label>
					<label>B
						<input checked="checked"
								   id="B"
								   onclick="xlv.checkLinks();"
								   type="checkbox"
							/>
					</label>
					<label>C
						<input checked="checked"
								   id="C"
								   onclick="xlv.checkLinks();"
								   type="checkbox"
							/>
					</label>
					<label>?
						<input id="Q"
								   onclick="xlv.checkLinks();"
								   type="checkbox"
							/>
					</label>
					<label>auto
						<input id="AUTO"
								   onclick="xlv.checkLinks();"
								   type="checkbox"
							/>
					</label>
					<div id="scoreSlider">
						<p class="scoreLabel" id="scoreLabel1"></p>
						<input id="slide" type="range" min="0" max="100" step="1" value="0" oninput="sliderChanged()"/>
						<p class="scoreLabel" id="scoreLabel2"></p>
						<p id="cutoffLabel">(cut-off)</p>
					</div> <!-- outlined scoreSlider -->

					<div style='float:right'>
						<label>Self-Links
							<input checked="checked"
								   id="selfLinks"
								   onclick="xlv.showSelfLinks(document.getElementById('selfLinks').checked)"
								   type="checkbox"
							/>
						</label>
						<label>&nbsp;&nbsp;Ambiguous
							<input checked="checked"
								   id="ambig"
								   onclick="xlv.showAmbig(document.getElementById('ambig').checked)"
								   type="checkbox"
							/>
						</label>
						<label style="margin-left:20px;">Annot.:
							<select id="annotationsSelect" onChange="changeAnnotations();">
								<option>None</option>
								<option selected>Custom</option>
								<option>UniprotKB</option>
								<option>SuperFamily</option>
								<option>Lysines</option>
							</select>
						</label>						
<!--
						<label style="margin-left:20px;">Link colours:
-->
							<select id="linkColourSelect" onChange="changeLinkColours();">
								<option selected>SAS dist.</option>
								<option>Euc. dist.</option>
								<option>Search</option>
							</select>
<!--
						</label>
-->
					</div>
				</div>
			</div>

		</div><!-- MAIN -->

		<?php
			include './php/networkScript.php';
		?>
</html>
