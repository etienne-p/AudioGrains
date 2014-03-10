lib.UIUtil = {

    /**
     * Fit an object in its container
     *
     * @param {obj} object to scale.
     * @param {w} width to fit.
     * @param {h} height to fit.
     * @param {type} 0: fit in, 1: fit out.
     * @param {objRatio} w / h ratio to preserve, optionnal.
     */
    fit: function(obj, w, h, type, objRatio) {

        var ratio = w / h;
        objRatio = objRatio || obj.width() / obj.height();

        function fitBasedOnHeight() {
            obj.height(h);
            obj.width(h * objRatio);
        }

        function fitBasedOnWidth() {
            obj.width(w);
            obj.height(w / objRatio);
        }

        if (ratio > objRatio) {
            switch (type) {
                case 0:
                    fitBasedOnHeight();
                    break
                case 1:
                    fitBasedOnWidth();
                    break
            }
        } else {
            switch (type) {
                case 0:
                    fitBasedOnWidth();
                    break
                case 1:
                    fitBasedOnHeight();
                    break
            }
        }

        obj.css('left', ((w - obj.width()) * 0.5) + 'px');
        obj.css('top', ((h - obj.height()) * 0.5) + 'px');
    },

    isElementInViewport: function(el) {
        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    },

    elementIntersectsViewport: function(el) {
        var rect = el.getBoundingClientRect();

        return (!(
            rect.top > (window.innerHeight || document.documentElement.clientHeight) ||
            rect.left < 0 ||
            rect.bottom < 0 ||
            rect.right > (window.innerWidth || document.documentElement.clientWidth)
        ));
    },

    getAspectRatio: function(img) {

        var aspectRatio = -1;
        var jObj = $(img);

        var wAttr = parseInt(jObj.data("width"), 10);
        var hAttr = parseInt(jObj.data("height"), 10);

        if (wAttr > 0 && hAttr > 0) {
            aspectRatio = wAttr / hAttr;
        } else {
            aspectRatio = img.naturalWidth ? (img.naturalWidth / img.naturalHeight) : (img.width / img.height);
        }

        //-- IE8...
        if (aspectRatio == -1) {
            var localImg = new Image();
            localImg.src = img.src;
            aspectRatio = localImg.width / localImg.height;
        }

        return aspectRatio;
    }
}