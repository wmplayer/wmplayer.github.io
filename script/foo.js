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

function testCaman()
{
    Caman("#canvas", function () {
        // // Explicitly give the R, G, and B values of the
        // // color to shift towards.
        
        // // Arguments: (R, G, B, strength)
        this.resetOriginalPixelData();

        this.newLayer(function () {
            // Change the blending mode
            this.setBlendingMode("multiply");
        
            // Change the opacity of this layer
            this.opacity(30);
        
            // Now we can *either* fill this layer with a
            // solid color...
            this.fillColor('#159915');

            // ... or we can copy the contents of the parent
            // layer to this one.
            this.copyParent();
        
            // Now, we can call any filter function though the
            // filter object.
            this.filter.brightness(10);
            this.filter.contrast(20);
            });

        // this.render();

        this.colorize(25, 180, 25, 10).render();
    });
}

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

function drawTest()
{
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    //ctx.fillStyle = "#909090";
    //ctx.fillRect(0, 0, c.width, c.height);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "normal 300px Segoe UI";
    let rj = randoji();

    elem=document.createElement('p')
    elem.innerHTML = randoji();
    ctx.fillText(elem.innerHTML, -16, 280);

    // let cback = document.getElementById("back_buffer");
    // let cbackctx = cback.getContext("2d");
    // cbackctx.font = "normal 384px Segoe UI";
    // cbackctx.fillText(elem.innerHTML, -90, 384);

    // var img = convertCanvasToImage(cback);
    // var jm = document.getElementById("joshymage");
    // jm.image = img;
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


