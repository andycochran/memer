// Prepare the canvas:
var canvas = new fabric.Canvas('canvas',{
    backgroundColor: '#808080'
});


// Add image overlay:
fabric.Image.fromURL( 'images/memer-overlay.png', function(img) {
    img.set({
        evented: false,
        selectable: false,
        left: 0,
        top: 0
    });
    canvas.add(img);
});


// Load an image:
var imageLoader = $('#memer--input')[0];
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){

            EXIF.getData(this, function() {
                var orientation = EXIF.getTag(this, "Orientation");
                switch (orientation) {
                  case 1:
                    $rotation=0;break;
                  case 2:
                    $rotation=0;break;
                  case 3:
                    $rotation=180;break;
                  case 4:
                    $rotation=180;break;
                  case 5:
                    $rotation=90;break;
                  case 6:
                    $rotation=90;break;
                  case 7:
                    $rotation=-90;break;
                  case 8:
                    $rotation=-90;break;
                  default:
                    $rotation=0;break;
                }
            });

            var imgInstance = new fabric.Image(img, {
                  angle: $rotation
                }),
                iw = img.width,
                ih = img.height;
            if (iw > ih) {
                // the image orientation is landscape
                imgInstance.set({
                    scaleX: canvas.height / imgInstance.height,
                    scaleY: canvas.height / imgInstance.height
                });
                imgInstance.minScaleLimit = canvas.height / imgInstance.height;
                imgInstance.lockMovementY = true;
            } else {
                // the image orientation is portrait (or square)
                imgInstance.set({
                    scaleX: canvas.width / imgInstance.width,
                    scaleY: canvas.width / imgInstance.width
                });
                imgInstance.minScaleLimit = canvas.width / imgInstance.width;
                imgInstance.lockMovementX = true;
            }
            imgInstance.lockUniScaling = true;
            imgInstance.lockRotation = true;
            imgInstance.hasBorders = false;
            imgInstance.hasControls = false;
            // add the image to the canvas...
            canvas.add(imgInstance);
            canvas.centerObject(imgInstance);
            canvas.sendToBack(imgInstance);
            // We have an image, so hide file input + show text button...
            $('#memer--add-text').removeClass('memer--button-off');
            $('#memer--choose').addClass('memer--button-off');
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
 }


// Prevent dragging image too far:
canvas.on('object:moving', function(){
    if ( canvas.getActiveObject().get('type') === 'image' ){
        var obj = this.relatedTarget,
            leftEdge = obj.getLeft(),
            rightEdge = obj.getLeft() + obj.getWidth(),
            topEdge = obj.getTop(),
            bottomEdge = obj.getTop() + obj.getHeight();

        leftEdge > 0 && obj.setLeft('0');
        rightEdge < canvas.width && obj.setLeft(canvas.width - obj.getWidth());
        topEdge > 0 && obj.setTop('0');
        bottomEdge < canvas.height && obj.setTop(canvas.height - obj.getHeight());
    }
});


// Add custom user text:
var memeTextBtn = document.getElementById('memer--add-text');
memeTextBtn.addEventListener('click', memeText, false);

var userText = new fabric.IText(
    '', {
        // set interractions...
        centeredScaling: true,
        cursorColor: '#272727',
        cursorWidth: 8,
        hoverCursor: 'pointer',
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        width: canvas.width,
        hasBorders: false,
        // add some style...
        fontFamily: 'Permanent Marker',
        fontSize: 180,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 0.7,
        fill: '#272727',
        opacity: 0.85,
        selectionColor: 'rgba(153,243,255,0.5)',
        left: canvas.height / 2,
        top: canvas.height - 100,
        originY: 'bottom',
        originX: 'center',
        textAlign: 'center'
    }
);

function memeText(e){
    // add the user text to the canvas...
    canvas.add(userText);
    // activate it...
    canvas.setActiveObject(userText);
    userText.enterEditing();
    // show add-text button...
    $('#memer--add-text').addClass('memer--button-off');
}


// Format the user-submitted text:
canvas.on('text:changed', function(e) {
    var obj = e.target,
        textOriginal = obj.getText(),
        textWidth = obj.getWidth(),
        textScaleX = obj.getScaleX(),
        textArea = canvas.width - 40,
        goodMargin = textArea * 0.8;

    // prevent all 3 types (PC, UNIX, iOS) of line breaks...
    textRevised = textOriginal.replace(/(\r\n|\n|\r)/gm,'');
    obj.set({ text: textRevised });
    // position cursor if text changes on return key press...
    if (textRevised != textOriginal) {
        obj.moveCursorLeft(e);
    }

    // condense long text...
    if ( textWidth > textArea ) {
      obj.scaleToWidth(textArea);
      obj.setScaleY(1);
    } else if ( textWidth <= textArea && textScaleX < 1 ) {
      obj.scaleToWidth(textArea);
      obj.setScaleY(1);
    } else {
      obj.setScaleY(1);
    }

    // if there is text...
    var textExists = userText.getText();
    if (textExists) {
        // show the save button...
        $('#memer--save').removeClass('memer--button-off')
    } else {
        // hide the save button...
        $('#memer--save').addClass('memer--button-off')
    }

    canvas.renderAll();
});


// If user doesn't enter text, add placehoder:
userText.on('editing:exited', function () {
    var textExists = userText.getText();

    if (!textExists) {
        $('#memer--add-text').removeClass('memer--button-off');
        $('#memer--save').addClass('memer--button-off');
        canvas.remove(userText);
    }
});


// don't scroll to the hidden textarea
userText.on('editing:entered', function () {
    $('#textarea-anchor').scrollintoview();
});


// Save the canvas as an image:
var imageSaver = document.getElementById('memer--save');
imageSaver.addEventListener('click', saveImage, false);

function saveImage(e){
    canvas.deactivateAll().renderAll();
    this.href = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8
    });
    this.download = 'memer.jpg'
 }
