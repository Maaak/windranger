define(function (require, exports, module) {

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license
	function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
									   || window[vendors[x]+'CancelRequestAnimationFrame'];
		}
	 
		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
	 
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}();

	var AnimatedQueue = function(){
		this.callback = null;
		this.animationId = null;

		this.reset();
		this.animate = this.animate.bind(this);
	};

	AnimatedQueue.prototype.push = function(callback, context){
		this.frames[++this.pushIndex] = callback.bind(context);
		this.start();
	};

	AnimatedQueue.prototype.animate = function(){
		this.isAnimating = true;
		this.callback = this.frames[this.popIndex];
		if (this.callback) { 
			this.callback();
			delete this.frames[this.popIndex];

			this.popIndex++;
			if (this.frames[this.popIndex]) { this.animationId = window.requestAnimationFrame(this.animate); } else { this.pause(); }
		} else { 
			this.pause();
		}
	};

	AnimatedQueue.prototype.start = function(){
		if (Object.keys(this.frames).length > 0 && !this.isAnimating) { 
			this.animate(); 
		}
	};

	AnimatedQueue.prototype.pause = function(){
		if (!Object.keys(this.frames).length) { this.reset(); }
	};

	AnimatedQueue.prototype.reset = function(){
		this.frames = {};
		this.pushIndex = -1;
		this.popIndex = 0;
		this.isAnimating = false;
	};


	window.animatedQueue = new AnimatedQueue();
});