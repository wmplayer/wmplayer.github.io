// Copyright 2019 wmplayer

function randoji()
{
    let num = pairedRangesRandom([0x1F980, 0x1F997, 0x1F9D8, 0x1F9DF]).toString(16);
    return "&#x" + num + ";";
}

function rangeRandom(low, high)
{
    let range = (high - low);
    let randIndex = Math.floor((Math.random() * range));
    return low + randIndex;
}

function pairedRangesRandom(pairs)
{
    if ((pairs.length % 2) != 0) console.log("bad list of pairs has " + pairs.length + " entries");

    let totalRange = 0;
    let rangeList = new Array();
    for (var i = 0; i < pairs.length; i+=2)
    {
        let rangeSpan = pairs[i+1] - pairs[i];
        totalRange += rangeSpan;
        rangeList[i] = pairs[i];
        rangeList[i+1] = rangeSpan;
    }
    let randomIndexIntoTotalCount = rangeRandom(0, totalRange);

    let subIndex = 0;
    let skippedTotal = 0;

    while ((randomIndexIntoTotalCount - skippedTotal) >= rangeList[subIndex + 1])
    {
        skippedTotal += rangeList[subIndex + 1];
        // peel off the span of the range we're skipping over. So if it was [10,100] (10-110), we subtract 100
        subIndex += 2;
    }

    return pairs[subIndex] + (randomIndexIntoTotalCount - skippedTotal);
}

function codewrap(codeval)
{
    return "&#x" + codeval + ";";
}

function codes(codestring)
{
    let retval = "";
    if (codestring.indexOf(" ") != -1)
    {
        let subcodes = codestring.split(" ");
        for (let j in subcodes)
        {
            retval += codewrap(subcodes[j]);
        }
        return retval;
    }
    return codewrap(codestring);
}

function allmoji(host_div)
{
    let fullHTML = "";
    for (let j = 0; j < g_emoji_list.length; j++)
    {
        fullHTML += '<span title="' + g_emoji_list[j]["name"] + '">' + codes(g_emoji_list[j]["codes"]) + '</span>';
    }
    host_div.innerHTML = fullHTML;
}

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

function drawMojiToFill(c, moji){
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    let fudge = Math.floor(c.width * 0.2);
    let fontSize = c.width - fudge;
    ctx.font = "normal " + fontSize + "px Segoe UI";

    let elem = document.createElement('p')
    elem.innerHTML = moji;
    ctx.fillText(elem.innerHTML, -fudge * 0.5, fontSize);
    return ctx.getImageData(0, 0, c.width, c.height);
}


function drawLetter(ctx, fillStyle, x, y, letterSize, zoom, letter)
{
    ctx.font = "normal " + Math.round(letterSize * zoom) + "px Segoe UI Bold";
    ctx.fillStyle = fillStyle; // e.g. - "#FF0000";
    elem=document.createElement('p')
    elem.innerText = letter;
    ctx.fillText(elem.innerHTML, x, y);
}
var g_lastHex = "";
var spewvals = new Array();
var g_roundrobin = -1;
function drawPixels(imageDataSource, srcWidth, srcHeight, canvasDestination, drawSize, drawType)
{
    let ctx = canvasDestination.getContext("2d");
    var getChar = function()
    {
        return ".";
        var seed = "PaperBeatsRockBeatsScissorsBeats";        
        g_roundrobin++;
        if (g_roundrobin >= seed.length) g_roundrobin = 0;
        return seed.substring(g_roundrobin, g_roundrobin + 1);
    };
    var zoom = 4.0;
    for (let y = 0; y < srcHeight; y++)
    {
        g_roundrobin = Math.floor(Math.random() * 20);
        for (let x = 0; x < srcWidth; x++)
        {
            let i = 4 * (srcWidth * y + x);
            if (imageDataSource[i+3] == 0) continue;
            var fillStyle = "rgba(" + imageDataSource[i] + ", " + imageDataSource[i+1] + ", " + imageDataSource[i+2] + ", " + imageDataSource[i+3] / 255.0 +  ")";

            if (drawType == "squares"){
                ctx.fillStyle = hexVal;
                ctx.fillRect(x*drawSize, y*drawSize, drawSize, drawSize);
            }
            else{
                let a = imageDataSource[i+3];
                if (a != 0)
                {
                    spewvals[spewvals.length] = a;
                    if (spewvals.length >= 10)
                    {
                        console.log(spewvals.toString());
                        spewvals = new Array();
                    }
                }
                drawLetter(ctx, fillStyle, x*drawSize, y*drawSize, drawSize, zoom, getChar());
            }
        }
    }
}

function drawTest()
{
    let moj = randoji();
    let lilCanvas = document.getElementById("canvasA");
    let ar = this.width / this.height;
    let lilWidth = lilCanvas.height * ar;
    lilCanvas.width = lilWidth;

    let lilPixels = drawMojiToFill(lilCanvas, moj);
    let destiCan = document.getElementById("canvas");
    destiCan.width = this.width;
    destiCan.height = this.height;
    destiCan.getContext("2d").clearRect(0, 0, destiCan.width, destiCan.height);
    drawPixels(lilPixels.data, lilWidth, lilCanvas.height, destiCan, 32, "dots");
}

function draw() {
    var lilCanvas = document.getElementById('canvasA');
    var ar = this.width / this.height;
    let lilWidth = lilCanvas.height * ar;
    lilCanvas.width = lilWidth;
    var ctx = lilCanvas.getContext('2d');
    ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, lilWidth, lilCanvas.height);
    let lilPixels = ctx.getImageData(0, 0, lilWidth, lilCanvas.height);
    let bigCanvas = document.getElementById("canvas");
    bigCanvas.height = this.height;
    bigCanvas.width = this.width;
    drawPixels(lilPixels.data, lilCanvas.width, lilCanvas.height, bigCanvas, 32, "dots"); 
}

function failed(){
    console.log("FAIL!!!");
}

function userImage()
{
    document.getElementById('inp').onchange = function(e) {
        var img = new Image();
        img.onload = draw;
        img.onerror = failed;
        img.src = URL.createObjectURL(this.files[0]);
      };
}

let XYs = 
        [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 3, 7],
            [0, 0, 0, 7, 9],
        ];

const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16));

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(arg => {
    const hex = arg.toString(16);
    return hex.length === 1 ? '0' + hex : hex
    }).join('');

function doRgbToHex(a,b,c)
{
    return rgbToHex(a,b,c);
}

class color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

function brightnessOfColor(colorIn)
{
    return Math.Sqrt(
        colorIn[0] * colorIn[0] * .241 + 
        colorIn[1] * colorIn[1] * .691 + 
        colorIn[2] * colorIn[2] * .068);
 }

function makeRule(fillstyle,xyfunc,c,d){
    var retval = new Array();
    retval["fillStyle"] = fillstyle; // e.g. - "#FF0000"
    //retval["to be continued... good ideas here..."] = "hmm";
    retval["xy"] = xyfunc;
    return retval;
}

function drawEyes(XYbrightnesses){
    var c = document.getElementById("canvas");
    c.height = 512;
    c.width = 512;
    var r = makeRule
    (
        "#FF0000", 
        function(x,y){
            return true;
        }
    )

    drawLayer(c, r, XYbrightnesses);
}

function drawLayer(c, rules, XYbrightnesses){
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "normal 300px Segoe UI";
    ctx.fillStyle = rules["fillStyle"]; // e.g. - "#FF0000";

    elem=document.createElement('p')
    elem.innerText = ".";

    let xy = XYbrightnesses;
    for (let y = 0; y < xy.length; y++)
    {
        for (let x = 0; x < xy[0].length; x++)
        {
            if (!rules["xy"](x,y)) continue;
            let thisval = xy[y][x];
            let thischar = thisval.toString(16);
            ctx.fillStyle = "#" + thischar + "00000";
            let yheight = 80;
            let xwidth = 160;
            let topoffset = 40;
            ctx.fillText(elem.innerHTML, x * 40, topoffset + y * 40);
            ctx.fillText(elem.innerHTML, x * 40, topoffset + yheight + (3-y) * 40);  
            ctx.fillText(elem.innerHTML, xwidth + (5-x) * 40, topoffset + y * 40);  
            ctx.fillText(elem.innerHTML, xwidth + (5-x) * 40, topoffset + yheight + (3-y) * 40);                   
        }
    }
}

function randomizeAll(rowMax, colMax)
{
    for (let row = 0; row < rowMax; row++)
    {
        for (let col = 0; col < colMax; col++)
        {
            let entry = eval("entry" + row + col);
            entry.innerHTML = randoji();
        }
    }
}

function randomizeAndCreateDIVs(parentGrid, rowMax, colMax)
{
    let allInnerHTML = "";
    let columns = "auto";
    for (let row = 0; row < rowMax; row++)
    {
        for (let col = 0; col < colMax; col++)
        {
            allInnerHTML += '\r\n<div id="entry'  + row + col + '">' + randoji() + '</div>';
            if (row == 0) if (col > 0) columns += " auto";
        }
    }
    parentGrid.style.gridTemplateColumns = columns;
    parentGrid.innerHTML = allInnerHTML;   
}

var g_AllMojiRanges =
[
    [["Smileys & Emotion"],
        ["face-smiling", 0x1F600, 0x1F607],
        ["face-affection", 0x1F970, 0x1F607],
        ["face-smiling", 0x1F600, 0x1F607],
        ["face-smiling", 0x1F600, 0x1F607]]
];

function quickList(rawString)
{
    for (var i=0; i<rawString.length; i++)
    {
        let currentCharCode = rawString.charCodeAt(i);
        if ('a'.charCodeAt(0) < currentCharCode)
        {
            spew.innerText += currentCharCode.toString();
        }
    }
}

function go()
{
    document.querySelector('#list_output').innerHTML = listFromString("foo\r\nbar\r\nblah");
}

function listFromString(rawString)
{
    let list = rawString.split("\r\n");
    for (var b in document)
    { console.log(typeof(b));console.log(b); }
    console.log(document.toString());
    return list[Math.floor(Math.random()*list.length)];
}


function oldDrawTest()
{
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");


    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "normal 300px Segoe UI";
    let rj = randoji();

    elem=document.createElement('p')
    elem.innerHTML = randoji();
    ctx.fillText(elem.innerHTML, -16, 280);

    var bits = ctx.getImageData(0,0,32,32);
    for (var y = 0; y < 32; y++)
    {
        for (var x = 0; x < 32; x++)
        {

        }
    }
    var R = bits.data[0];
    var G = bits.data[1];
    var B = bits.data[2];

    var j = 0;

    // let cback = document.getElementById("back_buffer");
    // let cbackctx = cback.getContext("2d");
    // cbackctx.font = "normal 384px Segoe UI";
    // cbackctx.fillText(elem.innerHTML, -90, 384);

    // var img = convertCanvasToImage(cback);
    // var jm = document.getElementById("joshymage");
    // jm.image = img;
}


function testCaman()
{
    Caman("#canvas", function () {

        this.resetOriginalPixelData();
        /*
        this.newLayer(function () {
            // Change the blending mode
            this.setBlendingMode("multiply");
        
            // Change the opacity of this layer
            this.opacity(30);
        
            // Now we can *either* fill this layer with a
            // solid color...
            //this.fillColor('#159915');

            // ... or we can copy the contents of the parent
            // layer to this one.
            this.copyParent();
        
            // Now, we can call any filter function though the
            // filter object.
            this.filter.brightness(10);
            this.filter.contrast(20);
            });
        */
         this.render();

        // // Arguments: (R, G, B, strength)
        //this.colorize(25, 180, 25, 190).render();

    });
}