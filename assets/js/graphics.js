
function writeFlash(data, width, height, flashvars) { document.write('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="' + width + '" height="' + height + '" id="playbook" align="middle"><param name="allowScriptAccess" value="always" /><param name="movie" value="' + data + '" /><param name="quality" value="high" /><param name="scale" value="noscale" /><param name="salign" value="lt" />' + (flashvars ? '<param name="flashvars" value="' + flashvars + '" />' : "") + '<embed src="' + data + '"' + (flashvars ? ' flashvars="' + flashvars + '"' : "") + ' quality="high" scale="noscale" salign="lt" width="' + width + '" height="' + height + '" name="playbook" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>'); }

function writeFlashNew(data, width, height, flashvars, parentID) {
    var so = new SWFObject(data, "playbook", width, height, "8");
    so.addParam("quality", "high");
    so.addParam("salign", "lt");
    if (flashvars)
        so.addParam("flashvars", flashvars);
    so.write(parentID);
}

function closeGraphics() {
    if (window.opener && window.opener.location) {
        try { window.opener.location.reload(); } catch (e) { }
    }
    window.close();
}

function newGraphics()
{
    if (window.opener && window.opener.location) {
        try { window.opener.location.reload(); } catch (e) { }
    }
}


function exportAllGraphics() {
    var callOnObject = true;

    try {
        for (var i = 0; i < document.embeds.length; i++) {
            document.embeds[i].exportImage();
            callOnObject = false;
        }
    } catch(e) {
        callOnObject = true;
        if (console && console.log)
            console.log(e);
    }

    if (callOnObject) {
        var objects = document.getElementsByTagName("object");
        try {
            for (var i = 0; i < objects.length; i++) {
                objects[i].exportImage();
            }
        } catch (e) {
            if (console && console.log)
                console.log(e);
        }
    }
}


/* PP WELCOME PAGE FUNCTIONS */


Xoffset=-60;
Yoffset= 20;
var isNS4=document.layers?true:false;
var isIE=document.all?true:false;
var isNS6=!isIE&&document.getElementById?true:false;
var old=!isNS4&&!isNS6&&!isIE;

var skn;

function popup(divId)
{
	
  if(isNS4)skn=document.d11;
  if(isIE)skn = eval("document.all."+divId+".style");
  if(isNS6)skn=document.getElementById(divId).style;

if(isNS4)
  document.captureEvents(Event.MOUSEMOVE); 
if(isNS6)
  document.addEventListener("mousemove", get_mouse, true);
if(isNS4||isIE)
  document.onmousemove=get_mouse;

  if(old)
  {
    alert("You have an old web browser:\n"+_m);
	return;
  }
  else
  {
	if(isNS4)
	{
	  skn.visibility="visible";
	}
	if(isNS6)
	{
	  document.getElementById(divId).style.position="absolute";
	  document.getElementById(divId).style.left=x;
	  document.getElementById(divId).style.top=y;
	  skn.visibility="visible";
	}
	if(isIE)
	{
	  skn.visibility="visible";
	}
  }
}

var x;
var y;
function get_mouse(e)
{
  x=(isNS4||isNS6)?e.pageX:event.clientX+document.body.scrollLeft; 
  y=(isNS4||isNS6)?e.pageY:event.clientY+document.body.scrollLeft; 
  if(isIE&&navigator.appVersion.indexOf("MSIE 4")==-1)
	  y+=document.body.scrollTop;
  skn.left=x+Xoffset;
  skn.top=y+Yoffset;
}


function removeBox()
{
  if(!old)
  {
	skn.visibility="hidden";
  }
}