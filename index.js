const writable={data:{},init:function(r){r.element=document.getElementById('writable');r.body=document.body;r.history=[];r.modifiers.init(r);r.selectors.init(r);r.dialog.init(r);r.triggers=['mouseup','mousedown','keyup','keydown','dblclick'];r.element.addEventListener('mouseup',function(e){r.set.action(r,[e,0])});r.element.addEventListener('mousedown',function(e){r.set.action(r,[e,1])});r.element.addEventListener('keyup',function(e){r.set.action(r,[e,2])});r.element.addEventListener('keydown',function(e){r.set.action(r,[e,3])});r.element.addEventListener('dblclick',function(e){r.set.action(r,[e,4])});r.element.addEventListener("paste",function(e){r.set.action(r,[e,5])});window.addEventListener("dragover",function(e){e=e||event;e.preventDefault()});window.addEventListener("drop",function(e){e=e||event;e.preventDefault()});var head=document.getElementsByTagName("HEAD")[0];var link=document.createElement("link");link.type='text/css';link.rel='stylesheet';link.href='https://rumcore.github.io/writable.ai/index.css';head.appendChild(link)},set:{state:{active:function(r){r.element.setAttribute('contentEditable','true');r.element.firstChild?r.set.cursor.start(r,[r.element.firstChild]):null}},action:function(r,p){r.e=p[0];r.t=p[1];var f=r.e.target;var s=window.getSelection();if(s.rangeCount>0){r.caret={};r.caret.position=s.focusOffset;f=s.getRangeAt(0).startContainer}
r.selection=!1;switch(p[1]){case 0:if(s.rangeCount>0){var range=s.getRangeAt(0)
if(range.startOffset!==range.endOffset){r.selection=r.get.selection(r,[s,range])}
f=range.startContainer}
break;case 1:break;case 2:break;case 3:break;case 4:break;case 5:break}
f=f.nodeType!==1?f.parentElement:f;r.focused=r.get.focused(r,[f]);r.handler=r.get.handler(r,[r.focused]);var block=r.get.block(r,[r.e.target]);if(r.handler&&!r.dialog.active){if(p[1]!==1){r.handler.triggers.selection&&r.selection?r.handler.triggers.selection(r,[r.selection]):r.modifiers.hide(r)}
if(block.id!=="selector"&&p[1]!==2){r.selectors.hide(r)}
r.handler.triggers[r.e.keyCode]?r.handler.triggers[r.e.keyCode](r):null;r.handler.triggers[r.triggers[r.t]]?r.handler.triggers[r.triggers[r.t]](r):null}
r.set.refactor(r);r.suspend=!1;r.history[r.history.length]=[r.focused,r.handler,r.selection]},text:{end:function(r,p){var target=p[0];if(target.firstChild.nodeType===3){window.getSelection().collapse(target.firstChild,target.firstChild.textContent.length)}else{window.getSelection().collapse(target,0)}},start:function(r,p){},split:{start:function(r,p){var e=p[0];e.innerHTML=e.innerHTML.replace(/&nbsp;/g," ");var n=document.createElement(e.tagName);var start=e.innerHTML.substring(0,p[1]);var end=e.innerHTML.substring(p[1],e.innerHTML.length);e.className?n.className=e.className:null;n.appendChild(document.createTextNode(start));e.innerHTML=end;e.parentElement.insertBefore(n,e);return n},end:function(r,p){var e=p[0];var n=document.createElement(e.tagName);var start=e.innerHTML.substring(0,p[1]);var end=e.innerHTML.substring(p[1],e.innerHTML.length);e.className?n.className=e.className:null;n.innerHTML=end;e.innerHTML=start;if(e.nextElementSibling){e.parentElement.insertBefore(n,e.nextElementSibling)}else{e.parentElement.appendChild(n)}
return n}},modify:function(r,p){var element=p[0];var selection=r.selection;var items=selection.children;var min=0;if(items){if(selection.start>0){r.set.text.split.start(r,[items[0],selection.start]);min=items.length>1?0:selection.start}
if(selection.end-min<items[items.length-1].innerText.length){r.set.text.split.end(r,[items[items.length-1],selection.end-min])}
for(var i=0;i<items.length;i++){element=element.cloneNode();element.innerHTML=items[i].innerHTML;items[i].parentElement.replaceChild(element,items[i])}
r.set.cursor.end(r,[element])}
return items},paste:function(r,p){r.e.preventDefault()}},image:{uploader:null,upload:function(r,c){r.set.image.uploader(c)}},block:{focus:{last:function(r,p){var block=p[0];var container=block.lastElementChild;var item=container.lastElementChild;var element=item.lastElementChild;r.set.text.end(r,[element])}},split:function(r,p){var focused=p[0];var current=focused[3][0].cloneNode();var current_container=focused[2][0].cloneNode();var next=current.cloneNode();var next_container=current_container.cloneNode();next.appendChild(next_container);var child=focused[1][2];var children=[];while(child){children[children.length]=child;child=child.nextElementSibling}
for(child in children){next_container.appendChild(children[child])}
focused[3][2]?focused[4][0].insertBefore(next,focused[3][2]):focused[4][0].appendChild(next);current_container.appendChild(focused[1][0]);current.appendChild(current_container);focused[4][0].insertBefore(current,next)
return[focused[3][0],current,next]}},refactor:function(r,p){var blocks=r.element.getElementsByClassName('block');for(var i=0;i<blocks.length;i++){var b=blocks[i];if(b.children.length===0){b.parentElement.removeChild(b)}}},cursor:{start:function(r,p){var element=p[0];while(element.nodeType!==3||element===undefined){element=element.firstChild}
window.getSelection().collapse(element,0)},end:function(r,p){window.getSelection().collapse(p[0].firstChild,p[0].firstChild.textContent.length)},position:function(r,p){window.getSelection().collapse(p[0].firstChild,p[1])},}},get:{markup:function(r,p){var div=document.createElement("div");div.innerHTML=p[0];return div.firstElementChild},block:function(r,p){var block=p[0];while(block.className!=='block'&&block!==r.body&&block){block=block.parentElement?block.parentElement:block}
return block.className==='block'?block:!1},focused:function(r,p){var focused=p[0],collection;var block=r.get.block(r,[focused]);if(block){collection=[];while(focused!==block){collection[collection.length]=[focused,focused.previousElementSibling,focused.nextElementSibling]
focused=focused.parentElement}
collection[collection.length]=[block,block.previousElementSibling,block.nextElementSibling];collection[collection.length]=[block.parentElement,block.parentElement.previousElementSibling,block.parentElement.nextElementSibling]}
return collection?collection:!1},selection:function(r,p){var selection=p[0];var range=p[1];var collection={};var se=range.startContainer.nodeType===1?range.startContainer:range.startContainer.parentElement;var ee=range.endContainer.nodeType===1?range.endContainer:range.endContainer.parentElement;collection.children=[se];if(se.parentElement===ee.parentElement){while(se!==ee){se=se.nextElementSibling;collection.children[collection.children.length]=se}}else{collection.children[collection.children.length]=ee}
collection.text=selection.toString();collection.length=collection.text.length;collection.start=range.startOffset;collection.end=range.endOffset;collection.box=range.getClientRects()[0];return collection},handler:function(r,p){var focused=p[0],handler;for(var i=focused.length-2;i>=0;i--){handler=handler?handler:r.handlers[focused[i][0].className]}
return handler?handler:!1}},handlers:{heading:{block:'<div class="block"><div class="heading"><h3><span>This is a sample heading<br></span></h3></div></div>',triggers:{13:function(r){},8:function(r){},selection:function(r){console.log("show heading modifier");r.modifiers.show(r,["modifier-heading"])}},modifiers:{}},paragraph:{block:'<div class="block"><div class="paragraph"><p><span><br></span></p></div></div>',triggers:{13:function(r){},8:function(r){if(r.t===3){if(r.caret.position===1&&r.focused[1][0].innerText.length===1){r.e.preventDefault();r.focused[1][0].firstElementChild.innerHTML="<br>"}else if(r.caret.position===0&&r.focused[1][0].innerText.length===1){if(r.focused[1][1]){r.e.preventDefault();r.set.text.end(r,[r.focused[1][1].lastElementChild]);r.focused[1][0].parentElement.removeChild(r.focused[1][0])}else if(r.focused[r.focused.length-2][1]){r.set.block.focus.last(r,[r.focused[r.focused.length-2][1]])
r.focused[1][0].parentElement.removeChild(r.focused[1][0]);if(r.focused[r.focused.length-3][0].children.length===0){r.focused[r.focused.length-1][0].removeChild(r.focused[r.focused.length-2][0])}}}}else if(r.caret.position===0){}},mouseup:function(r){if(r.focused[1][0].innerText.length<2){console.log("djpw")
r.selectors.show(r)}},keyup:function(r){if(r.focused[1][0].innerText.length<2){r.selectors.show(r)}},selection:function(r){r.modifiers.show(r,["modifier-text"])}},modifiers:{}},image:{block:'<div class="block"><div class="image"><div><img/></div></div></div>',triggers:{selection:function(r){console.log("show heading modifier")}},modifiers:{}},list:{block:'<div class="block"><ul class="list"><li><span>Sample List Item<br></span></li></ul></div>',triggers:{13:function(r){},8:function(r){if(r.t===3){if(r.caret.position===1&&r.focused[1][0].innerText.length===1){r.e.preventDefault();r.focused[1][0].firstElementChild.innerHTML="<br>"}else if(r.caret.position===0&&r.focused[1][0].innerText.length===1){if(r.focused[1][1]){r.e.preventDefault();r.set.text.end(r,[r.focused[1][1].lastElementChild]);r.focused[1][0].parentElement.removeChild(r.focused[1][0])}else if(r.focused[r.focused.length-2][1]){r.set.block.focus.last(r,[r.focused[r.focused.length-2][1]])
r.focused[1][0].parentElement.removeChild(r.focused[1][0]);if(r.focused[r.focused.length-3][0].children.length===0){r.focused[r.focused.length-1][0].removeChild(r.focused[r.focused.length-2][0])}}}}},mouseup:function(r){},keyup:function(r){},selection:function(r){r.modifiers.show(r,["modifier-text"])}},modifiers:{}},table:{},expandable:{},},modifiers:{init:function(r){var block=document.createElement("div");block.innerHTML=r.modifiers.block;block=block.firstElementChild;r.modifiers.block=block;r.body.appendChild(block);var groups=r.modifiers.groups;var ep,ei,eg,items;for(group in groups){eg=document.createElement("div");eg.id=group;items=groups[group].items;for(item in items){(function(){var i=items[item];ep=document.createElement("div");ei=document.createElement("img");ei.draggable=!1;ei.src=i[0];ep.addEventListener("click",function(){i[3](r);r.modifiers.hide(r)});ep.appendChild(ei);eg.appendChild(ep)})()}
block.insertBefore(eg,block.lastElementChild)}},show:function(r,p){var se=r.selection.children[0];var ee=r.selection.children[r.selection.children.length-1];if(se.parentElement===ee.parentElement){r.modifiers.active=!0;document.getElementById(p[0]).style.display="block";var box=r.selection.box;r.modifiers.block.style.display="block";var left=(box.width/2)-(r.modifiers.block.offsetWidth/2)+box.left;var top=box.y-r.modifiers.block.offsetHeight+document.documentElement.scrollTop
r.modifiers.block.style.left=left+"px";r.modifiers.block.style.top=top+"px"}},hide:function(r){r.modifiers.active=!1;var groups=r.modifiers.block.children;for(var i=0;i<groups.length;i++){groups[i].tagName.toLowerCase()==="div"?groups[i].style.display="none":null}
r.modifiers.block.style.display="none"},block:'<div id="modifier" class="block"><img/></div>',groups:{"modifier-text":{items:{bold:["https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-bold.svg",-1,-1,function(r){var element=document.createElement("b");r.set.text.modify(r,[element])}],link:["https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-link.svg",-1,-1,function(r){var params={title:'Add URL'};params.styles={padding:"24px",width:"360px"}
params.inputs=[["textarea",{id:'mod-url',rows:4}]]
params.options={}
params.options.done=function(r){var element=document.createElement("a");element.href=document.getElementById('mod-url').value;r.selection=r.dialog.selection;r.set.text.modify(r,[element])}
r.dialog.show(r,[params])}],mark:["https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-mark.svg",-1,-1,function(r){console.log("do some mark shit..")
var element=document.createElement("mark");r.set.text.modify(r,[element])}],},},"modifier-heading":{items:{drop:["https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-drop.svg",-1,-1,function(r){console.log("do some drop cap shit..")}],italic:["https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-italic.svg",-1,-1,function(r){console.log("do some italic shit..")}],mark:["https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-mark.svg",-1,-1,function(r){console.log("do some mark shit..")}],},}}},selectors:{init:function(r){var block=document.createElement("div");block.innerHTML=r.selectors.block;block=block.firstElementChild;r.selectors.block=block;block.contentEditable=!1;block.getElementsByTagName("img")[0].src="https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-add.svg"
block.firstElementChild.addEventListener("click",function(e){if(this.nextElementSibling.style.display==="inline-block"){this.nextElementSibling.style.display="none";this.getElementsByTagName("img")[0].src="https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-add.svg"}else{this.nextElementSibling.style.display="inline-block";this.getElementsByTagName("img")[0].src="https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-close.svg"}});r.body.appendChild(block);var items=r.selectors.items;var ep,ei;for(item in items){(function(){var i=items[item];ep=document.createElement("div");ei=document.createElement("img");ep.id=item;ei.src=items[item][0];ei.title=item.replace("selector-","");ei.style.outline="none"
ei.draggable=!1;ei.addEventListener("click",function(){i[3](r)})
ep.appendChild(ei)
block.lastElementChild.appendChild(ep)})()}},show:function(r,p){r.selectors.focused=r.focused;var left=r.focused[0][0].offsetLeft-78;var top=r.focused[0][0].offsetTop-18;r.selectors.active=!0;r.selectors.block.firstElementChild.style.display="inline-block"
r.selectors.block.style.left=left+"px";r.selectors.block.style.top=top+"px"},hide:function(r){r.selectors.active=!1;console.log()
r.selectors.block.firstElementChild.getElementsByTagName("img")[0].src="https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-add.svg"
r.selectors.block.firstElementChild.style.display="none";r.selectors.block.lastElementChild.style.display="none"},block:'<div id="selector" class="block"><div class="toggle"><div><img/></div></div><div class"options"></div></div>',items:{"selector-text":["https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-text.svg",-1,-1,function(r){var params={};params.styles={padding:"0px",width:"360px"};params.buttons=[["https://rumcore.github.io/writable.ai/assets/icons/svg/white/selector-heading.svg","Heading",function(){var items=r.set.block.split(r,[r.selectors.focused]);var block=r.get.markup(r,[r.handlers.heading.block]);items[1].parentElement.replaceChild(block,items[1]);r.set.cursor.end(r,[block.firstElementChild.firstElementChild.firstElementChild]);r.selectors.hide(r);r.dialog.hide(r)}],["https://rumcore.github.io/writable.ai/assets/icons/svg/white/selector-quote.svg","Quote",function(){console.log("quote")}],["https://rumcore.github.io/writable.ai/assets/icons/svg/white/selector-tip.svg","Note",function(){console.log("note")}]]
r.dialog.show(r,[params])}],"selector-image":["https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-image.svg",'<div class="block" contenteditable="false"><div class="upload"><div><img src="https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-image.svg" /><br><span>Drag & Drop image or </span><a> click here</a><span> to add image URL.</span></div></div></div>',-1,function(r){var items=r.set.block.split(r,[r.selectors.focused]);var block=r.get.markup(r,[this[1]]);items[1].parentElement.replaceChild(block,items[1]);var img=r.get.markup(r,[r.handlers.image.block]);console.log(img)
var a=block.getElementsByTagName("a")[0];a.addEventListener("click",function(){var params={title:'Add Image URL'};params.styles={padding:"24px",width:"360px"}
params.inputs=[["textarea",{id:'img-url',rows:4}]]
params.options={}
params.options.done=function(r){var src=document.getElementById("img-url").value;var img=r.get.markup(r,[r.handlers.image.block]);var img_tag=img.getElementsByTagName("img")[0];img_tag.src=src;block.parentElement.replaceChild(img,block)}
r.dialog.show(r,[params])});r.element.addEventListener("dragover",function(p){},!1);r.element.addEventListener("drop",function(p){console.log("drop Image");r.set.image.upload(r,function(p){var src=p[0];var srcset=p[1];var img_tag=img.getElementsByTagName("img")[0];img_tag.src=src;img_tag.srcset=srcset;block.parentElement.replaceChild(img,block)})},!1);r.selectors.hide(r)}],"selector-list":["https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-list.svg",-1,-1,function(r){var items=r.set.block.split(r,[r.selectors.focused]);var block=r.get.markup(r,[r.handlers.list.block]);items[1].parentElement.replaceChild(block,items[1]);r.set.cursor.end(r,[block.firstElementChild.firstElementChild.firstElementChild]);r.selectors.hide(r)}],"selector-table":["https://rumcore.github.io/writable.ai/assets/icons/svg/black/selector-table.svg",-1,-1,function(r){console.log("do some mark shit..")
var element=document.createElement("mark");r.set.text.modify(r,[element])}],}},dialog:{init:function(r){var block=document.createElement("div");block.innerHTML=r.dialog.block;block=block.firstElementChild;block.contentEditable=!1;r.dialog.block=block;r.body.appendChild(block)},show:function(r,p){var params=p[0];r.dialog.selection=r.selection;r.dialog.active=!0;r.dialog.block.style.display="block";for(param in params){if(r.dialog.items[param]){r.dialog.items[param](r,[params[param]])}}},hide:function(r){r.selection=r.dialog.selection;r.dialog.active=!1;r.dialog.block.style.display="none";r.dialog.block.firstElementChild.innerHTML=""},block:'<div id="dialog" class="block"><div></div><div></div></div>',items:{styles:function(r,p){var dialog=r.dialog.block.firstElementChild;var styles=p[0];for(style in styles){dialog.style[style]=styles[style]}},title:function(r,p){var title=document.createElement("h5");var span=document.createElement("span");span.innerHTML=p[0];title.appendChild(span);r.dialog.block.firstElementChild.appendChild(title)},buttons:function(r,p){var item=document.createElement("button");var icon=document.createElement("img");var label=document.createElement("div");var items=p[0];for(_item in items){(function(){var i=items[_item]
item=item.cloneNode();icon=icon.cloneNode();label=label.cloneNode();icon.src=i[0];label.innerHTML=i[1];item.addEventListener("click",function(){i[2](r)});item.appendChild(icon);item.appendChild(label);r.dialog.block.firstElementChild.appendChild(item)})()}},inputs:function(r,p){var inputs=p[0];for(input in inputs){var wrapper=document.createElement("div");var element=document.createElement(inputs[input][0]);var attributes=inputs[input][1];wrapper.className="input";for(attribute in attributes){element.setAttribute(attribute,attributes[attribute])}
wrapper.appendChild(element)
r.dialog.block.firstElementChild.appendChild(wrapper)}},options:function(r,p){var options=document.createElement("div");options.className="options";var cancel=document.createElement("button");var done=document.createElement("button");cancel.innerHTML="Cancel";done.innerHTML="Done";cancel.addEventListener("click",function(){r.dialog.hide(r)});done.addEventListener("click",function(){p[0].done(r);r.dialog.hide(r)});options.appendChild(cancel);options.appendChild(done);r.dialog.block.firstElementChild.appendChild(options)}}}};window.addEventListener('load',function(){writable.init(writable)},!1)
