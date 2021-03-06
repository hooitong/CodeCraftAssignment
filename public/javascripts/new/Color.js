var Color = Class.create({
	
	initialize: function(r, g, b, a){
		this.r = r || 0;
		this.g = g || 0;
		this.b = b || 0;
		this.a = a || ((a === 0) ? 0 : 1);
	},
	
	toString: function () {
		return 'rgba(' +
			Math.round(this.r) + ',' +
			Math.round(this.g) + ',' +
			Math.round(this.b) + ',' +
			this.a + ')';
	},

	copy: function () {
		return new Color(
			this.r,
			this.g,
			this.b,
			this.a
		);
	},

	// Color comparison:

	eq: function (aColor) {
	    // ==
	    return aColor &&
	        this.r === aColor.r &&
	        this.g === aColor.g &&
	        this.b === aColor.b;
	},

	// Color conversion (hsv):

	hsv: function () {
	    // ignore alpha
	    var max, min, h, s, v, d,
	        rr = this.r / 255,
	        gg = this.g / 255,
	        bb = this.b / 255;
	    max = Math.max(rr, gg, bb);
	    min = Math.min(rr, gg, bb);
	    h = max;
	    s = max;
	    v = max;
	    d = max - min;
	    s = max === 0 ? 0 : d / max;
	    if (max === min) {
	        h = 0;
	    } else {
	        switch (max) {
	        case rr:
	            h = (gg - bb) / d + (gg < bb ? 6 : 0);
	            break;
	        case gg:
	            h = (bb - rr) / d + 2;
	            break;
	        case bb:
	            h = (rr - gg) / d + 4;
	            break;
	        }
	        h /= 6;
	    }
	    return [h, s, v];
	},

	set_hsv: function (h, s, v) {
	    // ignore alpha, h, s and v are to be within [0, 1]
	    var i, f, p, q, t;
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	    case 0:
	        this.r = v;
	        this.g = t;
	        this.b = p;
	        break;
	    case 1:
	        this.r = q;
	        this.g = v;
	        this.b = p;
	        break;
	    case 2:
	        this.r = p;
	        this.g = v;
	        this.b = t;
	        break;
	    case 3:
	        this.r = p;
	        this.g = q;
	        this.b = v;
	        break;
	    case 4:
	        this.r = t;
	        this.g = p;
	        this.b = v;
	        break;
	    case 5:
	        this.r = v;
	        this.g = p;
	        this.b = q;
	        break;
	    }

	    this.r *= 255;
	    this.g *= 255;
	    this.b *= 255;

	},

	// Color mixing:

	mixed: function (proportion, otherColor) {
	    // answer a copy of this color mixed with another color, ignore alpha
	    var frac1 = Math.min(Math.max(proportion, 0), 1),
	        frac2 = 1 - frac1;
	    return new Color(
	        this.r * frac1 + otherColor.r * frac2,
	        this.g * frac1 + otherColor.g * frac2,
	        this.b * frac1 + otherColor.b * frac2
	    );
	},

	darker: function (percent) {
	    // return an rgb-interpolated darker copy of me, ignore alpha
	    var fract = 0.8333;
	    if (percent) {
	        fract = (100 - percent) / 100;
	    }
	    return this.mixed(fract, new Color(0, 0, 0));
	},

	lighter: function (percent) {
	    // return an rgb-interpolated lighter copy of me, ignore alpha
	    var fract = 0.8333;
	    if (percent) {
	        fract = (100 - percent) / 100;
	    }
	    return this.mixed(fract, new Color(255, 255, 255));
	},

	dansDarker: function () {
	    // return an hsv-interpolated darker copy of me, ignore alpha
	    var hsv = this.hsv(),
	        result = new Color(),
	        vv = Math.max(hsv[2] - 0.16, 0);
	    result.set_hsv(hsv[0], hsv[1], vv);
	    return result;
	}
});

Color.className = 'Color';

module.exports = Color;