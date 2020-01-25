var square = 400;
var images, canvas;

$(document).ready(() => {
    canvas = document.getElementById("canvas");
    images = {
        linkedin: document.getElementById("linkedin-canvas"),
        facebook: document.getElementById("facebook-canvas"),
        instagram: document.getElementById("instagram-canvas"),
        tinder: document.getElementById("tinder-canvas")
    };

    $(".image input").change(image_change);
});

function image_change(e) {
    let name = this.name;
    this.files[0].convertToBase64((result, error) => {
        const ctx = images[name].getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, square, square);
        let image = new Image();
        image.onload = () => {
            drawImageProp(ctx, image, 0, 0, square, square);
            update_canvas();
        };
        image.src = result;
    });
}

File.prototype.convertToBase64 = function(callback) {
    var reader = new FileReader();
    reader.onloadend = function(e) {
        callback(e.target.result, e.target.error);
    };
    reader.readAsDataURL(this);
};

function update_canvas() {
    $('#step2, #step3').show();
    const ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    ctx.font = "50px Impact, Anton";
    ctx.fillStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";

    ctx.fillRect(0, 0, square * 2, square * 2);
    var valid = true;
    if (images.linkedin) {
        ctx.drawImage(images.linkedin, 0, 0);
    } else {
        valid = false;
    }
    if (images.facebook) {
        ctx.drawImage(images.facebook, square, 0);
    } else {
        valid = false;
    }
    if (images.instagram) {
        ctx.drawImage(images.instagram, 0, square);
    } else {
        valid = false;
    }
    if (images.tinder) {
        ctx.drawImage(images.tinder, square, square);
    }

    /* Text */

    ctx.fillText("LINKEDIN", (square/2), square-10, square);
    ctx.strokeText("LINKEDIN", (square/2), square-10, square);

    ctx.fillText("FACEBOOK", (square/2) + square, square-10, square);
    ctx.strokeText("FACEBOOK", (square/2) + square, square-10, square);

    ctx.fillText("INSTAGRAM", (square/2), (square*2) - 10, square);
    ctx.strokeText("INSTAGRAM", (square/2), (square*2) - 10, square);

    ctx.fillText("TINDER", (square/2) + square, (square*2) - 10, square);
    ctx.strokeText("TINDER", (square/2) + square, (square*2) - 10, square);

    $('#download').attr('href', canvas.toDataURL('image/png', .8));
}


/**
 * By Ken Fyrstenberg Nilsen
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 * If image and context are only arguments rectangle will equal canvas
 */
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r, // new prop. width
        nh = ih * r, // new prop. height
        cx,
        cy,
        cw,
        ch,
        ar = 1;

    // decide which gap to fill
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}
