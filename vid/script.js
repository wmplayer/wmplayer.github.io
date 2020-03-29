
// Main initialization
document.addEventListener('DOMContentLoaded', function() {

    // Global variables
    var video = document.querySelector('video');
    var audio, audioType;
    var canvas = document.querySelector('canvas');
    var context = canvas.getContext('2d');

    // Custom video filters
    var iFilter = 0;
    var filters = [
        'grayscale',
        'sepia',
        'blur',
        'brightness',
        'contrast',
        'hue-rotate',
        'hue-rotate2',
        'hue-rotate3',
        'saturate',
        'invert',
        'none'
    ];

    // Get the video stream from the camera with getUserMedia
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    if (navigator.getUserMedia) {

        // Evoke getUserMedia function
        navigator.getUserMedia({video: true, audio: true}, onSuccessCallback, onErrorCallback);

        function onSuccessCallback(stream) {
            // Use the stream from the camera as the source of the video element
            video.src = /*window.URL.createObjectURL(stream) ||*/ stream;

            // Autoplay
            video.play();

            // HTML5 Audio
            audio = new Audio();
            audioType = getAudioType(audio);
            if (audioType) {
                audio.src = 'polaroid.' + audioType;
                audio.play();
            }
        }

        // Display an error
        function onErrorCallback(e) {
            var expl = 'An error occurred: [Reason: ' + e.code + ']';
            console.error(expl);
            alert(expl);
            return;
        }
    } else {
        document.querySelector('.container').style.visibility = 'hidden';
        document.querySelector('.warning').style.visibility = 'visible';
        return;
    }

    function drawObjectToCanvas(sourceObject, context) {
        window.setInterval(function() {
            let px = sourceToImageData(sourceObject, 64, 64);
            let rects = new sourceDest();
            rects.setSource(0, 0, 64, 64);
            rects.setDest(0, 0, 1000,1000);
            drawPixels(px.data, rects, context, 32, "arcs");
        }, 60);
    }

    function getAudioType(element) {
        if (element.canPlayType) {
            if (element.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== '') {
                return('aac');
            } else if (element.canPlayType('audio/ogg; codecs="vorbis"') !== '') {
                return("ogg");
            }
        }
        return false;
    }

    video.addEventListener('play', function() {
        drawObjectToCanvas(this, context);
    }, false);

    document.querySelector('button').addEventListener('click', function() {
        video.className = '';
        canvas.className = '';
        var effect = filters[iFilter++ % filters.length]; // Loop through the filters.
        if (effect) {
            video.classList.add(effect);
            canvas.classList.add(effect);

            filterselected.innerText = 'Current filter is: ' + effect;
        }
    }, false);

}, false);


function getCtx()
{
    var cv = document.getElementById("canvas");
    var ct = cv.getContext("2d");
    return ct;
}

function cleanCanvas()
{
    let ct = getCtx();
    ct.fillStyle = "rgba(250,60,60,0.2)";
    ct.fillRect(0, 0, canvas.width, canvas.height);
}

function sourceDest()
{
    this.setSource = function(x,y,w,h){
        this.srcX = x;
        this.srcY = y;
        this.srcW = w;
        this.srcH = h;
    };
    this.setDest = function(x,y,w,h){
        this.destX = x;
        this.destY = y;
        this.destW = w;
        this.destH = h;
    };
}

var g_roundrobin = -1;
function drawPixels(imageDataSource, srcDest, ctx, drawSize, drawType, minBright, maxBright)
{
    let srcWidth = srcDest.srcW; let srcHeight = srcDest.srcH;
    let destWidth = srcDest.destW; let destHeight = srcDest.destH;
    var getChar = function()
    {
        return ".";
        var seed = "PaperBeatsRockBeatsScissorsBeats";        
        g_roundrobin++;
        if (g_roundrobin >= seed.length) g_roundrobin = 0;
        return seed.substring(g_roundrobin, g_roundrobin + 1);
    };
    var zoom = 4.0;
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, destWidth, destHeight);
    if (srcWidth%2 == 1) srcWidth++;
    for (let y = 0; y < srcHeight; y++)
    {
        let xLog = "";
        g_roundrobin = Math.floor(Math.random() * 20);
        for (let x = 0; x < srcWidth; x++)
        {
            let i = 4 * (srcWidth * y + x);
            if (imageDataSource[i+3] == 0) {console.log("skipping x:" + x + ",y:" + y); continue;}
            let colorarray = []
            var fillStyle = "rgba(" + imageDataSource[i] + ", " + imageDataSource[i+1] + ", " + imageDataSource[i+2] + ", " + imageDataSource[i+3] / 255.0 +  ")";
            if (-1 == fillStyle.indexOf("rgba"))
            {
                console.log("what the hell?" + fillStyle);
                freak();
            }

            if (drawType == "squares"){
                ctx.fillStyle = fillStyle;
                ctx.fillRect(x*drawSize, y*drawSize, drawSize, drawSize);
            }
            else if (drawType == "arcs"){
                ctx.lineWidth = drawSize / 3.0;
                ctx.strokeStyle = fillStyle;
                ctx.beginPath();
                ctx.arc((x + 0.5) *drawSize, (y + 0.5) * drawSize, 0.5 * drawSize - ctx.lineWidth, 0, 2*Math.PI);
                ctx.stroke();
            }
            else{
                drawLetter(ctx, fillStyle, x*drawSize, y*drawSize, drawSize, zoom, getChar());
            }
        }
        console.log(xLog);
    }
}

var g_backBufferCanvas = document.createElement("canvas");
function sourceToImageData(sourceObject, width, height)
{
    let lilCanvas = g_backBufferCanvas;
    lilCanvas.height = height;
    let ar = sourceObject.width / sourceObject.height;
    let lilWidth = height * ar;
    lilCanvas.width = lilWidth;
    var ctx = lilCanvas.getContext('2d');
    ctx.drawImage(sourceObject, 0, 0, sourceObject.width, sourceObject.height, 0, 0, width, height);
    return ctx.getImageData(0, 0, lilWidth, lilCanvas.height);
}

function drawLetter(ctx, fillStyle, x, y, letterSize, zoom, letter)
{
    ctx.font = "normal " + Math.round(letterSize * zoom) + "px Segoe UI Bold";
    ctx.fillStyle = fillStyle; // e.g. - "#FF0000";
    elem=document.createElement('p')
    elem.innerText = letter;
    ctx.fillText(elem.innerHTML, x, y);
}

function init()
{
    var img = new Image();
    img.onload = draw;
    img.src = "media/the bounce.png";
}
