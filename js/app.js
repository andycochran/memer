// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();


// Prepare the canvas:
var canvas = new fabric.Canvas('canvas',{
    backgroundColor: 'rgb(160,160,160)'
});

// Add overlay to "filter" image and make text readable:
var overlay = new fabric.Rect({
  // turn off interractions...
  evented: false,
  selectable: false,
  // add some style...
  left: 0,
  top: 0,
  fill: 'rgba(0,0,0,0.25)',
  width: canvas.width,
  height: canvas.height
});
canvas.add(overlay);

// Add brand text:
var brandText = new fabric.Text(
    'Memer!', {
        // turn off interractions...
        evented: false,
        selectable: false,
        // add some style...
        fontFamily: 'Helvetica',
        fontSize: 50,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: 'rgba(255,255,255,1)',
        opacity: 1,
        left: 10,
        top: 10,
        textAlign: 'left'
    }
);
canvas.add(brandText);

// Load an image:
var imageLoader = $('input')[0];
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            var imgInstance = new fabric.Image(img),
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
            canvas.add(imgInstance);
            canvas.centerObject(imgInstance);
            canvas.sendToBack(imgInstance);
            // We have an image, so hide file input + show text button...
            $("#button--add-text").removeClass('hide');
            $("#input-button").addClass('hide');
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
 }


// Prevent dragging image too far:
canvas.on("object:moving", function(){
    if ( canvas.getActiveObject().get('type') === "image" ){
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
var memeTextBtn = document.getElementById('button--add-text');
memeTextBtn.addEventListener('click', memeText, false);

function memeText(e){
    var userText = new fabric.IText(
        'Enter Text...', {
            // set interractions...
            centeredScaling: true,
            cursorColor: 'rgba(255,255,255,1)',
            cursorWidth: 8,
            hoverCursor: 'pointer',
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            width: canvas.width,
            hasBorders: false,
            // add some style...
            fontFamily: 'Helvetica',
            fontSize: 100,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: 'rgba(255,255,255,1)',
            opacity: 1,
            selectionColor: 'rgba(17,119,255,0.5)',
            left: canvas.height / 2,
            top: canvas.height,
            originY: 'bottom',
            originX: 'center',
            textAlign: 'center'
        }
    );
    // add the user text to the canvas...
    canvas.add(userText);
    // activate and select it...
    canvas.setActiveObject(userText);
    userText.selectAll();
    userText.enterEditing();
    userText.hiddenTextarea.focus();
    // show/hide buttons for saving...
    $("#button--add-text").addClass('hide');
    $("#button--save").removeClass('hide');
}

// Save the canvas as an image:
var imageSaver = document.getElementById('button--save');
imageSaver.addEventListener('click', saveImage, false);

function saveImage(e){
    canvas.deactivateAll().renderAll();
    this.href = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8
    });
    this.download = 'test.jpg'
 }
