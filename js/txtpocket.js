var g = ""
var gcode = []
var paths = []
var shapes = []
var fontFileName
var tool
var txt_size
var text
var points = []
var count = []
var svg = []
var test = []
var test2 = []
var len = []
var points = []
var txt = ''
var xy = []
var xy_offset = []
var oset = [
  [0, 1]
]
var dots = []
var tool_diameter
var cut_depth
var engrave_depth
var pocket = []
var pockets = []
var pocket_o = []
var sf = 1
var curve = ""
var curve_length
var offsetted_paths = []
var scale = 100
var x = []
var y = []
var xmin
var xmax
var ymin
var ymax
var material
var delta = []
var tabs = [0, 0]
var ptabs = [0, 0]
var font
var worksheetCanvas
var ctx
var svgw
var svgh
var tool
var targeth
var sf2
var TrackY
var TotalY
var Reset = 0
var MaxXVal





function ResetVals() {
    Reset = 1
    console.log("clicked")
    
}

    if  (Reset == 1){
        TrackY = 0.0;
        TotalY = 0.0;
        MaxXVal = -1.0
       
        console.log("TrackY = reset " + TrackY );
        console.log("TotalY = reset " + TotalY );
        
        
    }
    else
    {
        
        TrackY = (localStorage.getItem('TrackY')) || 0;
        TotalY = (localStorage.getItem('TotalY')) || 0;
         MaxXVal = (localStorage.getItem('MaxXVal')) || 0;        
        console.log("TrackY = " + TrackY );
        console.log("TotalY = " + TotalY );
    };


TrackY = parseFloat(TrackY).toFixed(3);
//console.log(TrackY / 2)

//********** RESIZE CANVAS **********//
// small < 768
// medium 768 - 1022
// lg > 1023
function resizeCanvas() {
  if (window.innerWidth > 1022) {
    // large screen, canvas 2/3
    // var width = window.innerWidth*(2/3);
    var width = window.innerWidth / 2;
  } else if (window.innerWidth > 767 && window.innerWidth < 1023) {
    // medium screen, canvas 1/2 screen
    var width = window.innerWidth / 2;
  } else if (window.innerWidth < 768) {
    // small screen
    var width = window.innerWidth;
  }
  worksheetCanvas = $('#worksheet-canvas');
  //console.log('width'+ width);
  var ratio = worksheetCanvas.height() / worksheetCanvas.width();

  var height = width;
  //console.log('height'+ height);
  worksheetCanvas.width(width - 25)
  worksheetCanvas.height(height - 25)
}

window.addEventListener('load', resizeCanvas, false);
window.addEventListener('resize', resizeCanvas, false);



function reload() {

  points = []
  count = []
  shapes = []
  test = []
  test2 = []
  points = []
  path = ""
  paths = []
  xy = []
  xy_offset = []
  dots = []
  svg = []
  offsetted_paths = []
  delta = []
  pocket = []
  pockets = []
  pocket_o = []
  g = ""
  count = []
  x = []
  y = []

}

function txtpocket(txt_string, font, size, tool) {

  reload()

  worksheetCanvas = $('#worksheetCanvas');
  ctx = worksheetCanvas.get(0).getContext("2d");
  ctx.clearRect(0, 0, document.getElementById("worksheetCanvas").width, document.getElementById("worksheetCanvas").height);

  //console.log(font)

  var source = new Image();
  source.src = $('#cutoutShape').val();

  // Render our SVG image to the canvas once it loads.
  source.onload = function() {
    svgw = source.width
    svgh = source.height
    $('#worksheetCanvas').attr('height', svgh);
    $('#worksheetCanvas').attr('width', svgw);
    ctx.drawImage(source, 0, 0);

    setTimeout('drawText()', 400);

  }

  //   console.log('text: ' + txt_string + '\nfont: ' + font + '\nsize: ' + size + '\ntool diameter: ' + tool)

  txt = txt_string
    //   console.log(txt)
  fontFileName = font
  txt_size = size
  //console.log("size = " + size)
  targeth = size

  //set scale factor
  sf = parseFloat((152.4 / (size * 25.4)).toFixed(2))
  tool_diameter = tool

  //console.log("tool = " + tool)
    //engrave_depth = 0.015 
  engrave_depth = $('#engraveDepth').val();
  //make pockets
  loadtxt()

}

function loadtxt() {

  opentype.load(fontFileName, function(err, font) {

    if (err) {
      alert('Font could not be loaded: ' + err)
    } else {
      onFontLoaded(font)
    }
  });

}

function onFontLoaded(font) {

  // try to load text in canvas

  ctx.font = "32px Chicago";
  //    ctx.fillText(txt, 150, 100);	

  var path = font.getPath(txt, 0, 0, 152.4)

  for (i = 0; i < path.commands.length; i++) {
    if (path.commands[i].type == "M") {
      count.push(i)
    }
  }

  for (i = 0; i < count.length; i++) {

    if (i == 0) {
      paths.push([path.commands.slice(0, count[i + 1])])
    } else if (i == count.length - 1) {
      paths.push([path.commands.slice(count[i])])
    } else {
      paths.push([path.commands.slice(count[i], count[i + 1])])
    }

  }

  for (i = 0; i < paths.length; i++) {
    shapes.push(paths[i])
  }

  for (i = 0; i < shapes.length; i++) {
    test.push({
      commands: shapes[i][0],
      fill: "black",
      stroke: null,
      strokeWidth: 1
    })
  }

  test2 = []
  dots = []

  for (i = 0; i < test.length; i++) {

    dots.push([]);

    for (i2 = 0; i2 < test[i].commands.length; i2++) {

      test2 += test[i].commands[i2].type + " "

      if ((test[i].commands[i2].type == "L") || (test[i].commands[i2].type == "M")) {
        test2 += test[i].commands[i2].x + " "
        test2 += test[i].commands[i2].y + " "
        dots[i].push([test[i].commands[i2].x, test[i].commands[i2].y])

      }

      if (test[i].commands[i2].type == "Q") {
        test2 += test[i].commands[i2].x1 + " "
        test2 += test[i].commands[i2].y1 + " "
        test2 += test[i].commands[i2].x + " "
        test2 += test[i].commands[i2].y + " "

        curve += "M ";
        curve += test[i].commands[i2 - 1].x + " "
        curve += test[i].commands[i2 - 1].y + " "

        curve += test[i].commands[i2].type + " "
        curve += test[i].commands[i2].x1 + " "
        curve += test[i].commands[i2].y1 + " "
        curve += test[i].commands[i2].x + " "
        curve += test[i].commands[i2].y + " "

        curve_length = parseFloat(Snap.path.getTotalLength(curve).toFixed(0))

        if (curve_length > 1) {

          for (j = 1; j < curve_length; j = j + 1) {
            dots[i].push([Snap.path.getPointAtLength(curve, j).x, Snap.path.getPointAtLength(curve, j).y])

          }

        }

        dots[i].push([test[i].commands[i2].x, test[i].commands[i2].y])

        curve = ""
        curve_length = 0
      }
    }
    svg.push(test2)

    test2 = ""
  }

  for (i = 0; i < dots.length; i++) {

    points.push([]);

    for (j = 0; j < dots[i].length; j++) {

      points[i].push({
        X: dots[i][j][0],
        Y: dots[i][j][1]
      })
      x.push(dots[i][j][0])
      y.push(dots[i][j][1])

    }

  }

  if (dots.length < 1) {

    xmin = 0
    xmax = 0
    ymin = 0
    ymax = 0
  } else {
    xmin = (Math.min.apply(Math, x))
    xmax = (Math.max.apply(Math, x))
    ymin = (Math.min.apply(Math, y))
    ymax = (Math.max.apply(Math, y))
  }

  //console.log(points)
  //console.log(dots)
  var sf2 = (targeth / (Math.abs(ymin / 25.4 / sf)))
    //console.log(targeth/(Math.abs(ymin/25.4/sf)))
  x = []
  y = []

  for (i = 0; i < dots.length; i++) {

    for (j = 0; j < dots[i].length; j++) {
      dots[i][j][0] = dots[i][j][0] * sf2
      dots[i][j][1] = dots[i][j][1] * sf2
      x.push(dots[i][j][0])
      y.push(dots[i][j][1])
    }

  }

  if (dots.length < 1) {

    xmin = 0
    xmax = 0
    ymin = 0
    ymax = 0
  } else {
    xmin = (Math.min.apply(Math, x))
    xmax = (Math.max.apply(Math, x))
    ymin = (Math.min.apply(Math, y))
    ymax = (Math.max.apply(Math, y))
  }

  for (i = 0; i < points.length; i++) {

    for (j = 0; j < points[i].length; j++) {
      points[i][j].X = points[i][j].X * sf2
      points[i][j].Y = points[i][j].Y * sf2

    }

  }

  //size
  //console.log(Math.abs(ymin/25.4/sf))
  //sf = parseFloat((152.4/(size*25.4)).toFixed(2))
  tool_diameter = tool_diameter * sf
    //console.log(tool_diameter)

  ClipperLib.JS.ScaleUpPaths(points, scale)

  var simple_paths = ClipperLib.Clipper.SimplifyPolygons(points, ClipperLib.PolyFillType.pftNonZero)

  var co = new ClipperLib.ClipperOffset((tool_diameter / 2 * 25.4), 0.25)
  co.AddPaths(simple_paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon)

  i = 1
  j2 = 1

  while (i > 0) {

    offsetted_paths = new ClipperLib.Paths()
      //   co.Execute(offsetted_paths,-((tool_diameter/2*25.4)*i) * scale)
      //   document.getElementById("size").value

    if (i == 1) {
      co.Execute(offsetted_paths, -(tool_diameter / 2 * 25.4) * scale)
        //   console.log(i)
    } else {

      co.Execute(offsetted_paths, -((tool_diameter / 2 * 25.4) * j2) * scale)
        //   co.Execute(offsetted_paths,-(((tool_diameter/2*25.4)*2)+((tool_diameter/2*25.4)*i*0.8) * scale))
        //   console.log(j2)
    }

    j2 += 0.7

    pocket.push(offsetted_paths)
      //   console.log(i);
    i++

    if (pocket[i - 2].length == 0) {
      i = 0;
      pocket.splice(pocket.length, 0)

    }

  }

  pocket_o = [];

  for (i = 0; i < pocket.length; i++) {

    for (j = 0; j < pocket[i].length; j++) {
      pocket[i][j].push(pocket[i][j][0])

    }

  }

  pocket_o = []
  pocket_o = pocket[0]

  pocket.splice(0, 1)

  var pt
  var inpg

  for (i = 0; i < pocket_o.length; i++) {

    pt = new ClipperLib.IntPoint(pocket_o[i][0].X, pocket_o[i][0].Y)

    //create outer pocket profile

    for (j = 0; j < pocket_o.length; j++) {

      //0 = false
      //-1 = on
      //1 = in
      inpg = ClipperLib.Clipper.PointInPolygon(pt, pocket_o[j])

      if (inpg == 1) {
        //console.log("pg: " + i + " is in pg: " + j);
        pocket[0].push(pocket_o[i])
        pocket_o.splice(i, 1)
        i = i - 1
      }

    }
  }

  for (i = 0; i < pocket_o.length; i++) {

    pockets.push([])

    for (j = 0; j < pocket.length; j++) {

      for (j2 = 0; j2 < pocket[j].length; j2++) {

        pt = new ClipperLib.IntPoint(pocket[j][j2][0].X, pocket[j][j2][0].Y)
        inpg = ClipperLib.Clipper.PointInPolygon(pt, pocket_o[i])

        if (inpg == 1) {
          pockets[i].push(pocket[j][j2])
        }
      }
    }
  }

  pocket = []

  for (i = 0; i < pockets.length; i++) {

    pocket.push([])

    j = 0;

    while (j < pockets[i].length) {

      pt = new ClipperLib.IntPoint(pockets[i][j][0].X, pockets[i][j][0].Y)
      inpg = 0;
      for (j2 = 0; j2 < pockets[i].length; j2++) {
        inpg += ClipperLib.Clipper.PointInPolygon(pt, pockets[i][j2])
      }

      if (inpg == -1) {

        pocket[i].push(pockets[i][j])
        pockets[i].splice(j, 1)
        j--
      }
      j++;
    }
  }

  var check = 1

  while (check > 0) {

    for (i = 0; i < pockets.length; i++) {

      if (pockets[i].length > 0) {

        j = 0;

        while (j < pockets[i].length) {

          pt = new ClipperLib.IntPoint(pockets[i][j][0].X, pockets[i][j][0].Y)
          inpg = 0;

          for (j2 = 0; j2 < pockets[i].length; j2++) {
            inpg += ClipperLib.Clipper.PointInPolygon(pt, pockets[i][j2])
          }

          if (inpg == -1) {

            pocket[i].splice(-1, 0, pockets[i][j])
            pockets[i].splice(j, 1)
            j--

          }

          j++

        }
      }

    }

    //check

    check = 0;

    for (i = 0; i < pockets.length; i++) {
      if (pockets[i].length > 0) {
        check = 1
      }

    }

  }

  for (i = 0; i < pocket.length; i++) {
    pocket[i].splice(0, 0, pocket_o[i]);
  }

  for (i = 0; i < pocket.length; i++) {
    pocket[i].reverse()
  }

  var l2r = [];
  //sort array from left to right
  //console.log(pocket)

  for (i = 0; i < pocket.length; i++) {
    //console.log(pocket[i][0][0].X + " " + i);
    l2r.push({
      index: i,
      x: pocket[i][0][0].X
    });
  }

  //console.log(l2r);

  l2r.sort(function(a, b) {
    return parseFloat(a.x) - parseFloat(b.x);
  });

  pockets = [];
  //console.log(l2r)
  for (i = 0; i < l2r.length; i++) {

    pockets.push(pocket[l2r[i].index]);

  }
  //pocket = []
  text = dots

}

function drawText() {

  ctx.beginPath()
  ctx.lineWidth = "1"
  ctx.strokeStyle = "black"

  var vpos = 2

  //console.log(svgw)
  //console.log(text)

  //ctx.moveTo(0,0);
  //ctx.lineTo(10,10);
  var widthMax = 0
  var heightMax
  for (i = 0; i < text.length; i++) {
    ctx.moveTo(((svgw) / 2) - (xmax / sf / 2 * 3.54) - (xmin / sf / 2 * 3.54) + text[i][0][0] * 3.54 / sf, text[i][0][1] * 3.54 / sf + (svgh / vpos) - (ymax / sf * 3.54) + (ymax / sf / 2 - ymin / sf / 2 * 3.54))
    for (j = 0; j < text[i].length; j++) {
      ctx.lineTo(((svgw) / 2) - (xmax / sf / 2 * 3.54) - (xmin / sf / 2 * 3.54) + text[i][j][0] * 3.54 / sf, text[i][j][1] * 3.54 / sf + (svgh / vpos) - (ymax / sf * 3.54) + (ymax / sf / 2 - ymin / sf / 2 * 3.54))
    }
  }

  //cross hair
  /*
  ctx.moveTo(0,svgh/2)
  ctx.lineTo(svgw,svgh/2)
  ctx.moveTo(svgw/2,svgh)
  ctx.lineTo(svgw/2,0)
  */

  ctx.stroke()

}

function makeGcode() {

var XOffset
var YOffset
var XExtents
var YExtents 
var OneYChunk

    
  var header = document.getElementById("cutoutShape").value
   header = header.replace('.svg', '.txt')
   jQuery.get(header, function(data) {
      
          var CenterOffset = data.split(',');            
          XOffset = parseFloat(CenterOffset[0]).toFixed(3);
          YOffset = parseFloat(CenterOffset[1]).toFixed(3);
          XExtents = parseFloat(CenterOffset[2]).toFixed(3);
          YExtents = parseFloat(CenterOffset[3]).toFixed(3);
          if (XExtents > MaxXVal){
               MaxXVal = XExtents
          };
    })
    .done(function() {  
 
var MaxYVal = $('#MaxYVal').val();

    OneYChunk = (TrackY * 1) + (YExtents * 1);  
    TotalY = (TotalY * 1) + (YExtents * 1);
    // console.log("TotalY = " + TotalY) 
    var TileWarning = ("Next tag: " + TrackY)
    if (TotalY > MaxYVal ){
        TileWarning = "Move Over " + MaxXVal + " before cutting file!!"
        console.log("over")
        TrackY = 0.0
        OneYChunk = 0.0
        TotalY = 0.0
        MaxXVal = -1.0
    } 

    if (OneYChunk > 8 ){
        TileWarning = "Move the Handibot so that Y0 is just above the top of the last part!!"
        console.log("moveUp")
        TrackY = 0.0
    }
    
    
    g += 'g20\n'
    g += 'g0z0.2\n'
    g += 'g0x' + (XOffset * 1) + ' y' + ((TrackY * 1) + (YOffset * 1)) + '\n'
    g += 'G92 X0.0 Y0.0\n'
    g += 'M4\n'

  //pocket scale down and convert to inches
  for (i = 0; i < pocket.length; i++) {

    for (j = 0; j < pocket[i].length; j++) {

      for (j2 = 0; j2 < pocket[i][j].length; j2++) {

        if (j2 == 0) {
          g += 'g0x' + ((-(xmax - xmin) / 25.4 / sf) / 2 + ((pocket[i][j][j2].X / 100) / 25.4 / sf)).toFixed(3) + "y" + (((ymax + ymin) / 25.4 / sf / 2) - (((pocket[i][j][j2].Y / 100) / 25.4 / sf))).toFixed(3) + '\n'
          g += 'g1z-' + (engrave_depth) + 'f20\n'
        } else {
          g += 'g1x' + ((-(xmax - xmin) / 25.4 / sf / 2) + ((pocket[i][j][j2].X / 100) / 25.4 / sf)).toFixed(3) + "y" + (((ymax + ymin) / 25.4 / sf / 2) - (((pocket[i][j][j2].Y / 100) / 25.4 / sf))).toFixed(3) + 'f30\n'

        }

      }
      g += 'g0z0.1\n'

    }
    g += 'g0z0.2\n'
  }
 
  
  // keep track of total Y cut
  TrackY = (TrackY * 1) + (YExtents * 1);
  
  if (Reset == 1) {
      TileWarning += " : RESET"
      TrackY = 0
      TotalY = 0
  }

  
  localStorage.setItem('TrackY', TrackY);
  localStorage.setItem('TotalY', TotalY);
  localStorage.setItem('MaxXVal', MaxXVal);

  var cutoutPath = document.getElementById("cutoutShape").value
  cutoutPath = cutoutPath.replace('.svg', '.g')
 
  jQuery.get(cutoutPath, function(data) {
      g += data
    })
    .done(function() {

      cutoutPath = cutoutPath.replace('cutouts/', '')
      cutoutPath = cutoutPath.replace('.g', '')
    g += 'g90\n'
    g += 'g0x0y0\n'
      fabmo.submitJob({
        file: g,
        filename: txt + '.g',
        name: "TEXT: " + txt + ": " + TileWarning,
        description: "NameTagger: " + cutoutPath
      });
    })
})
}



