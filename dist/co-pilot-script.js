let video_toggle = document.querySelector('#video-toggle');
let oi = document.getElementById("observable-item");

var simulateClick = function (elem) {
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	var canceled = !elem.dispatchEvent(evt);
};

const ClassCheckTargetNode = document.querySelector("html");

const config = { attributes: true, attributeFilter: ['style'], childList: false, subtree: false };
let cooldown = false, last = "";
let setCooldown = () => {
	cooldown = true;
  setTimeout(() => {
    cooldown = false;
  }, 1200);
}

const ClassCheckCallback = (mutationList, observer) => {
  for (const mutation of mutationList) {
  	if(cooldown) return;
    if(last === mutation.target.style.cssText) return;
    if(mutation.target.style.cssText === "--observablevariable: rgba(255, 255, 255, 1);" || 
    	 mutation.target.style.cssText === "--observablevariable: rgba(0, 0, 0, 1);" ){
      last = mutation.target.style.cssText
      setCooldown();
      simulateClick(video_toggle)
    }
  }
};
const ClassCheckObserver = new MutationObserver(ClassCheckCallback);

ClassCheckObserver.observe(ClassCheckTargetNode, config);
