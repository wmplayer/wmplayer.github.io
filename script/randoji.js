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


