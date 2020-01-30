
	
const modifiers = {
	
		init : function(r,p){
			var block = document.createElement("div");
			block.innerHTML = this.block;
			block = block.firstElementChild;
			
			r.writable = p[0];
			r.dialog = p[1];
			r.collections = p[2];
			
			// load options
			var groups = r.groups;
			var ep,ei,eg,items;
			for(group in groups){
				eg = document.createElement("div");
				eg.id = group;
				eg.className = 'group';
				eg.style.display = 'none';
			 	items = groups[group].items;
				for(item in items){
					(function() {	
						var i  = items[item]; 
						ep = document.createElement("div");
						ep.className = 'group-item';
						if(i[1]===-1){
							ei = document.createElement("img");
							ei.draggable = false;
							ei.src = i[0];
							ei.className = 'group-item-img';
						}else if(i[1]===1){
							ei = document.createElement("div");
							av = document.createElement("div");
							ei.innerHTML = i[0];
							ei.className = 'group-item-label';
							av.className = 'av';
							ep.appendChild(av);
						}
						
						
						ep.addEventListener("click",function(){i[3](r);r.hide(r)});
						
						ep.appendChild(ei);
						eg.appendChild(ep);
					})();
				}
				block.insertBefore(eg,block.lastElementChild);
			}
			this.block = block;
			document.body.appendChild(block);
	
		},
		show : function(r,p){
			
			
			var selection = r.selection(r);
			var start = selection.start;
			var end   = selection.end;
			var box	  = selection.box;
			if(box){
				var show = 0;
				switch(p[0][1]){
					case 0:
						show=start!==end?1:0;
					break;
					case 1:
						show=1;
					break;
					case 2:
					break;
				}
				
				if(show){
					
					this.target = p[1][0];
					this.active = p[0][0];
					r.block.style.display = "block";
					document.getElementById(this.active).style.display = "block";
					var left = (box.width/2)-(r.block.offsetWidth/2)+box.left;
					var top  = ((box.y-box.height)-r.block.offsetHeight)+document.documentElement.scrollTop; 
					
					r.block.style.left = left+"px";
					r.block.style.top  = top+"px";
						
				}else{this.hide(r)}
			}
		},
		hide : function(r){
				if(this.active){
				r.block.style.display = "none";
				document.getElementById(this.active).style.display = "none";
				this.active = false;
			}
		},
		
		toggle : function(r,p){
			var collection = p[0];
			var element   = collection[0][0];
			if(r.writable.trigger === 0 || r.writable.trigger === 2){
				var modifier = r.writable.get.property(r,[collection,["modifier"]]);
				console.log(modifier)
				if(modifier){
					this.show(r,[modifier,collection[2]])
				}else{
					this.hide(r)
				}
			}
		},
	
		block : '<div id="modifier" class="modifier"></div>',
		
		text : {
			end : function(r,p){
				var target = p[0],end;
				while(target){
					end = target;
					target = target.lastElementChild;
				}
				var range = document.createRange();
				var sel   = window.getSelection();
				range.selectNodeContents(end);
				range.collapse(false);

				sel.removeAllRanges();
				sel.addRange(range);
				
				
			},
			start : function(r,p){
				var target = p[0],start;
				while(target){
					start = target;
					target = target.firstElementChild;
				}
				window.getSelection().collapse(start,0);
			},			
			position : function(r,p){
				window.getSelection().collapse(p[0].firstChild,p[1]);
			},
			split : {
				start : function(r,p){
					var e = p[0];
					e.innerHTML = e.innerHTML.replace(/&nbsp;/g, " ");
					var n = document.createElement(e.tagName);
					var start = e.innerHTML.substring(0,p[1]);
					var end   = e.innerHTML.substring(p[1],e.innerHTML.length);
					e.className ? n.className = e.className : null; 
					n.appendChild(document.createTextNode(start));
					e.innerHTML = end;
					e.parentElement.insertBefore(n,e);
					return n;
				},
				end : function(r,p){
					var e = p[0];
					var n = document.createElement(e.tagName);
					var start = e.innerHTML.substring(0,p[1]);
					var end   = e.innerHTML.substring(p[1],e.innerHTML.length);
					e.className ? n.className = e.className : null; 

					n.innerHTML = end;
					e.innerHTML = start;
					if(e.nextElementSibling){
						e.parentElement.insertBefore(n,e.nextElementSibling);
					}else{
						e.parentElement.appendChild(n);
					}	
					return n;
				}
			},
			modify : function(r,p){
				var element   = p[0];
				var selection = r.selection(r);
				var items     = selection.children;
				var min = 0;
				if(items){
					if(selection.start > 0){
						r.text.split.start(r,[items[0],selection.start]);
						min = items.length > 1 ? 0 : selection.start;
					}

					if(selection.end-min < items[items.length-1].innerText.length){
						r.text.split.end(r,[items[items.length-1],selection.end-min]);
					}
					
					for(var i=0;i<items.length;i++){
						element = element.cloneNode();
						element.innerHTML = items[i].innerHTML;
						items[i].parentElement.replaceChild(element,items[i]);
					}
					if(p[1]){
						element.innerText = p[1];
					}
					r.writable.set.caret.end(r.writable,[element])
					
				}
				return items;
			},
			replace : function(r,p){
				var text = p[0];
				var selection,range;
				
				var s = window.getSelection();
				if(s.rangeCount>0){
					range = s.getRangeAt(0)
					if(range.startOffset !== range.endOffset){
						selection = r.get.selection(r,[s,range]);
					}
				}
				var items = selection ? selection.children : [];
				var min = 0;
				if(items.length > 1){
					
					if(selection.start > 0){
						r.text.split.start(r,[items[0],selection.start]);
						min = items.length > 1 ? 0 : selection.start;
					}
					if(selection.end-min < items[items.length-1].innerText.length){
						r.text.split.end(r,[items[items.length-1],selection.end-min]);
					}
					
					for(var i=1;i<items.length;i++){
						items[i].parentElement.removeChild(items[i]);
					}
					
					var span = document.createElement("span");
					var div  = document.createElement("div");
					div.innerHTML = text;
					span.innerHTML = div.innerText;
					items[0].parentElement.replaceChild(span,items[0])
					
					window.scrollTo(0,items[0].offsetTop + items[0].offsetHeight)
					r.writable.set.caret.end(r.writable,[span])
					
				}else if(items.length === 1){
					var div  = document.createElement("div");
					div.innerHTML = text;
					
					items[0].innerHTML = items[0].innerHTML.replace(range.toString(),div.innerText);
					
					//window.scrollTo(0,items[0].offsetTop + items[0].offsetHeight)
					/*TODO SET POSITION*/
				}else{
					var div  = document.createElement("div");
					div.innerHTML = text;
					var position = window.getSelection().focusOffset;
					
					if(position === 0 && r.focused[0][0].innerText.length < 2){
						r.focused[0][0].innerHTML = text;
						r.text.end(r,[r.focused[0][0]])
					}else{
						r.f = r.writable.collections[2][2]
						r.f.innerHTML = r.f.innerText.substring(0,position) 
						+text+ r.f.innerText.substring(position,r.f.innerText.length);
						r.text.position(r,[r.focused[0][0],position])
					}
					
					
					//window.scrollTo(0,r.f.offsetTop + r.f.offsetHeight)
					/*TODO SET POSITION*/
				}
				return items;
			},
			paste : function(r){
				
				r.writable.event.preventDefault();
				var text = (r.writable.event.originalEvent || r.writable.event).clipboardData.getData('text/plain');
				text = text.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
				
				r.writable.collection[2][2].tagName;
				var element = document.createElement(r.writable.collection[2][2].tagName);
				r.text.modify(r,[element,text]);
				
				/*
				
				
				var node = r.writable.collection[2][2].cloneNode()
      			node.innerHTML = text;
      			r.writable.range.insertNode(node);
				*/
			}
		},	
		selection : function(r,p){
			var selection = window.getSelection();
    		//var range     = selection.getRangeAt(0);
			var range  = r.writable.range;
			var collection = {};
			var se = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
			var ee = range.endContainer.nodeType === 1 ? range.endContainer : range.endContainer.parentElement;
			collection.children = [se];
			
			if(se.parentElement === ee.parentElement){
				while(se !== ee){
					se = se.nextElementSibling;
					collection.children[collection.children.length] = se;
				}				
			}else{
				collection.children[collection.children.length] = ee;
			}

			collection.text   = selection.toString();
			collection.length = collection.text.length;
			collection.start  = range.startOffset;
			collection.end    = range.endOffset;
			collection.box	  = range.getClientRects()[0];
			return collection
		},
		groups : {
			
			"modifier-text" : {
				
				items : {
					bold : [
						"https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-bold.svg",
						-1,
						-1,
						function(r){
							var element = document.createElement("b");
							r.text.modify(r,[element]);
						}
					],
					link : [
						"https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-link.svg",
						-1,
						-1,
						function(r){
							//show dialog
							var params = {title:'Add URL'};
							params.styles = {padding:"24px",width:"360px"}
							params.inputs = [["textarea",{id:'mod-url',rows:4}]]
							params.options = {}
							params.options.done = function(r){
								var element  = document.createElement("a");
								element.href = document.getElementById('mod-url').value;
								element.target = "_blank"
								r.text.modify(r,[element]);
							}
							r.dialog.show(r,[params]);
							
						}
					],
					mark : [
						"https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-mark.svg",
						-1,
						-1,
						function(r){
							var element = document.createElement("mark");
							r.text.modify(r,[element]);
						}
					],
					
				},
				
			},
			"modifier-link" : {
				
				items : {
					
					link : [
						"Visit Link",
						1,
						-1,
						function(r){
							var src = r.writable.collection[2][2].getAttribute("href");
							window.open(src.indexOf("http")>0?src:"http://"+src);
						}
					],
					edit : [
						"https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-link.svg",
						-1,
						-1,
						function(r){
							//show dialog
							var href   = r.writable.collection[2][2].getAttribute("href");
							var params = {title:'Add URL'};
							params.styles = {padding:"24px",width:"360px"}
							params.inputs = [["textarea",{"id":'mod-url',"rows":4},href]]
							params.options = {}
							params.options.done = function(r){
								var col = r.writable.collection[1][0];
								var ele = r.writable.collection[2][2];
								col = r.writable.collections[col.className];
								if(col){
									col.modifier["a"] = ["modifier-link",1]
								}
								
								ele.href = document.getElementById('mod-url').value;
							}
							r.dialog.show(r,[params]);
							
						}
					],
					
				},
				
				
			},
		
			"modifier-resource" : {
				
				items : {
					
					link : [
						"https://rumcore.github.io/writable.ai/assets/icons/svg/white/modifier-link.svg",
						-1,
						-1,
						function(r){
							//show dialog
							var params = {title:'Add URL'};
							params.styles  = {padding:"24px",width:"360px"}
							params.inputs  = [["textarea",{id:'mod-url',rows:4}]]
							params.options = {}
							params.options.done = function(r){
								var col = r.writable.collection[1][0];
								var ele = r.writable.collection[2][2];
								col = r.writable.collections[col.className];
								if(col){
									col.modifier["a"] = ["modifier-link",1]
								}
								
								ele.href = document.getElementById('mod-url').value;
							
							}
							r.dialog.show(r,[params]);
							
						}
					],
					
					
				},
			},
			
		}
		
}
	  
	