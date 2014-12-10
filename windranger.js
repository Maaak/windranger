define(function (require, exports, module) {

	var AnimatedQueue = function(){
		this.callback = null;
		this.animationId = null;

		this.reset();
		this.animate = this.animate.bind(this);
	};

	AnimatedQueue.prototype.add = function(callback, context){
		this.items[++this.lastIndex] = callback.bind(context);
		this.start();
	};

	AnimatedQueue.prototype.animate = function(){
		this.isAnimating = true;
		this.callback = this.items[this.queueIndex];
		if (this.callback) { 
			this.callback();
			delete this.items[this.queueIndex];

			this.queueIndex++;
			if (this.items[this.queueIndex]) { this.animationId = window.requestAnimationFrame(this.animate); } else { this.pause(); }
		} else { 
			this.pause();
		}
	};

	AnimatedQueue.prototype.start = function(){
		if (Object.keys(this.items).length > 0 && !this.isAnimating) { 
			this.animate(); 
		}
	};

	AnimatedQueue.prototype.pause = function(){
		if (!Object.keys(this.items).length) { this.reset(); }
	};

	AnimatedQueue.prototype.reset = function(){
		this.items = {};
		this.lastIndex = -1;
		this.queueIndex = 0;
		this.isAnimating = false;
	};


	window.animatedQueue = new AnimatedQueue();
});