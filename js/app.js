// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();


// prepare the canvas
var canvas = new fabric.Canvas('canvas',{
    backgroundColor: 'rgb(128,128,128)'
});

// add brand text
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
        opacity: 1,
        left: 10,
        top: 10,
        textAlign: 'left'
    }
);
brandText.setColor('rgba(255,255,255,1)');
canvas.add(brandText);

// load an image
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
            $("#saver").removeClass('no-img');
            $("#input-button").addClass('hide');
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
 }


// prevent dragging too far
canvas.on("object:moving", function(){
    var obj = this.relatedTarget,
        leftEdge = obj.getLeft(),
        rightEdge = obj.getLeft() + obj.getWidth(),
        topEdge = obj.getTop(),
        bottomEdge = obj.getTop() + obj.getHeight();

    leftEdge > 0 && obj.setLeft('0');
    rightEdge < canvas.width && obj.setLeft(canvas.width - obj.getWidth());
    topEdge > 0 && obj.setTop('0');
    bottomEdge < canvas.height && obj.setTop(canvas.height - obj.getHeight());
});


// save the canvas as an image
var imageSaver = document.getElementById('saver');
    imageSaver.addEventListener('click', saveImage, false);

function saveImage(e){
    canvas.deactivateAll().renderAll();
    this.href = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8
    });
    this.download = 'test.jpg'
 }
