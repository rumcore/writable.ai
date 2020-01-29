const writable = {
	
	data : {},
	
	init : function(r){ 
		r.host = "https://rumcore.github.io/writable.ai/v2/";
		
		r.element = document.getElementById('writable');
		r.body    = document.body;
		//r.element.innerHTML =  r.element.innerHTML.replace(/\s+/g, '');
		r.element.innerHTML = r.element.innerHTML.split(/\>[\n\t\s]*\</g).join('><').split(/[\n\t]*/gm).join('')
		
		//r.selectors.init(r);
		r.dialog.init(r);
		
		r.triggers = ['mouseup','mousedown','keyup','keydown'];
		r.element.addEventListener('mouseup',function(e){r.set.action(r,[e,0])});
		r.element.addEventListener('mousedown',function(e){r.set.action(r,[e,1])});
		r.element.addEventListener('keyup',function(e){r.set.action(r,[e,2])});
		r.element.addEventListener('keydown',function(e){r.set.action(r,[e,3])});
		window.addEventListener("dragover",function(e){e=e||event;e.preventDefault();});
		window.addEventListener("drop",function(e){e=e||event;e.preventDefault();});
		
		//var style = document.createElement('style');
		//document.head.appendChild(style);
		
		r.element.setAttribute('contentEditable','true');
		
		//var s_blocks     = document.createElement('script');
		var s_selectors  = document.createElement('script');
		var s_modifiers  = document.createElement('script');
		//s_blocks.type    = "text/javascript";
		s_selectors.type = "text/javascript";
		s_modifiers.type = "text/javascript";
		//s_blocks.addEventListener("load",function(){
			document.getElementsByTagName("head")[0].appendChild(s_selectors);
		//});
		s_selectors.addEventListener("load",function(){
			r.selectors = selectors;
			r.selectors.init(r.selectors,[r,r.dialog,r.collections]);
			document.getElementsByTagName("head")[0].appendChild(s_modifiers);
		});
		s_modifiers.addEventListener("load",function(){
			r.modifiers = modifiers;
			r.modifiers.init(r.modifiers,[r,r.dialog,r.collections]);
			
			r.element.innerHTML += "<div id='writable-end'></div>";
		});		

		//s_blocks.src    = r.host+"blocks.js";
		s_selectors.src = r.host+"selectors.js";
		s_modifiers.src = r.host+"modifiers.js";
		//document.getElementsByTagName("head")[0].appendChild(s_blocks);
		
		for(collection in r.collections){
			var item = r.collections[collection];
			if(item.actions){
				item.actions.init ? item.actions.init(r,[r.element,item]):null;
			}
		}
		
	},
	api : {
		set : {
			image : {upload : null}
		}	
	},
	set : {
		state : {
			active : function(r){
				r.element.setAttribute('contentEditable','true');
				r.element.firstChild ? r.set.caret.start(r,[r.element.firstChild]) : null;
			}
		},
		action : function(r,p){
			
			var range  = window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0) : null;
			
			if(range && range.startContainer){
				var target     = range.startContainer;
				target = target.nodeType !== 1 ? target.parentElement : target;
				var collection = r.get.target.collection(r,[target])
				if(collection){
					r.event  	 = p[0];
					r.trigger	 = p[1];
					r.range      = range;
					r.collection = collection;
					if(r.event.keyCode&&r.set.target.trigger[r.event.keyCode]){
						r.set.target.trigger[r.event.keyCode](r,[collection])
					}
					r.selectors.toggle(r,[collection]);
					r.modifiers.toggle(r.modifiers,[collection]);
				}
			}	
		},
		caret : {
			end : function(r,p){
				var target = p[0],end;
				while(target){
					end = target;
					target = target.lastElementChild;
				}
				var range = document.createRange();
				var sel   = window.getSelection();
				if(end.tagName==='BR' && end.previousSibling ){
					end = end.previousSibling;
				}
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
				//window.scrollTo(0,start.offsetTop)
			},
			position : function(r,p){
				var element = p[0].firstChild
				if(element.tagName === 'BR' && element.previousSibling){
					element = element.previousSibling;
				}
				window.getSelection().collapse(element,p[1]);
			},
			prev : function(r,p){
				var target = p[0];
				while(!target.previousElementSibling){target = target.parentElement;}
				target = target.previousElementSibling;
				if(p[1]===0){
					r.set.caret.start(r,[target]);
				}else{
					r.set.caret.end(r,[target])
				}
			},
			next : function(r,p){
				var target = p[0];
				while(!target.nextElementSibling){target = target.parentElement;}
				target = target.nextElementSibling;
				
				if(target && (target.id==="writable-end")){
					r.event.preventDefault();
					console.log(target.id)
					if(r.collection[1][0].className !== 'paragraph'){
						console.log("in")
						var col = r.set.target.insert(r,['paragraph','default']);
						target.parentElement.insertBefore(col,target);
						r.set.caret.start(r,[col])
					}
				}else{
					if(p[1]===0){
						r.set.caret.start(r,[target]);
					}else{
						r.set.caret.end(r,[target])
					}
				}
			}
		},
		target : {
			trigger : {
				8 : function(r,p){
					
					if(r.trigger===3){
						
						var collection = p[0][0];
						var stack 	   = p[0][1];
						var block      = p[0][2][0];
						var item       = p[0][2][1];
						var element    = p[0][2][2];
						var position = window.getSelection().focusOffset;
						var trigger  = r.get.property(r,[p[0],["triggers","8"]]);
						trigger = trigger ? trigger.toString() : "0";
						
						var el = r.get.target.text([element]).length;
						var bl = r.get.target.text([block]).length;
						var cl = r.get.target.text([stack[0]]).length;	
						if(el===1 && (item.children.length === 1||block.children.length === 1)){
							r.event.preventDefault();
							element.innerHTML = "<BR>";
						}else if(bl === 0 && !item.previousElementSibling){
							r.event.preventDefault();
							if(stack[0].previousElementSibling&&stack[0].previousElementSibling.contentEditable !== "false"){
								r.set.caret.prev(r,[block,1])
								block.parentElement.removeChild(block);
								// **check for empty container
								if(cl === 0){stack[0].parentElement.removeChild(stack[0])}
							}
							
						}else if(position===0){
							switch(trigger){
								case '0':
									r.event.preventDefault();
									r.set.caret.prev(r,[element]);
									break;
								case '1':
									r.event.preventDefault();
									var prev = block.previousElementSibling ? block.previousElementSibling:item.previousElementSibling;
									if(prev){
										var html  = prev.nextElementSibling.innerHTML;
										var count = prev.children.length
										var pl    = r.get.target.text([prev]).length;
										if(pl===0){
											prev.innerHTML = html;
											r.set.caret.start(r,[prev]);
										}else{
											prev.innerHTML += html;
											r.set.caret.end(r,[prev.children[count-1]]);
										}
										prev.nextElementSibling.parentElement.removeChild(prev.nextElementSibling);
									}else{
										r.set.caret.prev(r,[element]);
									}
									break;
								case '2':
								break;	
								case '3':
									if(item.children.length === 1){
										r.event.preventDefault();
										r.set.caret.prev(r,[element,1])
									}
								break;	
							}

						}
						
						
					}

				},	
				9 : function(r,p){r.event.preventDefault();},
				13 : function(r,p){
					
					if(r.trigger===3){
						var collection = p[0][0];
						var stack 	   = p[0][1];
						var block      = p[0][2][0];
						var item       = p[0][2][1];
						var element    = p[0][2][2];
						var position = window.getSelection().focusOffset;
						var trigger  = r.get.property(r,[p[0],["triggers","13"]]);
						trigger = trigger ? trigger.toString() : "0";
						
						switch(trigger){
							case '0':
								r.event.preventDefault();
								r.set.caret.next(r,[stack[stack.length-1],0]);
								break;
							case '1':
								if(r.get.target.text([block]).length===0||r.get.target.text([item]).length===0){
									r.event.preventDefault();
									r.set.caret.next(r,[block,0]);
								}
							break;
							case '2':
								r.event.preventDefault();
								r.set.caret.next(r,[target,0]);
								break;
							case '3':
								r.event.preventDefault();
								if(!item.nextElementSibling){
									r.set.target.block(r,[stack,collection]);
								}else{
									r.set.caret.next(r,[item,0]);
								}
								break;
							case '4':
								r.event.preventDefault();
								r.set.target.block(r,[stack,collection]);
								break;	
							case '5':
								r.event.preventDefault();
								var el = r.get.target.text([element]).length;
								var next = element.nextElementSibling;
								if(el>0){
									r.set.target.element(r,[collection,block,element]);
								}else if(el===0 && next){
									console.log("remove")
									r.set.caret.next(r,[element,1]);
									item.removeChild(element)
								}else{
									item.removeChild(element)
									r.set.caret.next(r,[block,0])
								}
								break;
							
						}
						
					}
				},
				49 : function(r,p){},
			},
			node : function(p){
				var html = p[0];
				var node = document.createElement("div");
				node.innerHTML = html;
				return node.firstElementChild;
			},
			append : function(r,p){
				var stack = p[0];
				var item  = p[1];
				if(stack[3].nextElementSibling){
					stack[2].insertBefore(item,stack[3].nextElementSibling)
				}else{
					stack[2].appendChild(item);
				}
			},
			clone : function(r,p){
				var stack = p[0];
				var block = p[1];
				var clone;
				var item = block.markup.items[stack[3].className];
				if(item){
					clone = r.set.target.node([item]);
				}else{
					clone = r.get.target.clone(r,[stack[3]])
				}
				
				var next  = stack[3].nextElementSibling;
				next?stack[2].insertBefore(clone,next):
				stack[2].appendChild(clone);
				r.set.caret.start(r,[clone]);
			},
			splice : function(r,p){
				var collection = r.collection[1][0];
				var container  = r.collection[1][0];
				var item      = r.collection[1][0];
				var block      = r.collection[2][0];
				
				
					var pre = collection.cloneNode(true);
					pre.firstElementChild.innerHTML = "";

					while(block.previousElementSibling){pre.firstElementChild.appendChild(block.previousElementSibling)}
				
					collection.parentElement.insertBefore(p[0],collection);
					collection.parentElement.insertBefore(pre,p[0]);
					p[1].parentElement.removeChild(p[1]);
					
					if(collection.nextElementSibling.id === "writable-end"){
						collection.parentElement.removeChild(collection);
					}
					r.set.caret.start(r,[p[0]])
				
				
			},
			element : function(r,p){
				
				var collection = p[0];
				var block      = p[1];
				var target     = p[2];
				
				var html = collection.markup.elements[target.className];
				if(html){
					var next    = target.nextElementSibling;
					var element = document.createElement("div");
					element.innerHTML = html;
					element = element.firstElementChild;
					if(next){
						target.parentElement.insertBefore(element,next);
					}else{
						target.parentElement.appendChild(element);
					}
					r.set.caret.end(r,[element])
				}
			},
			block : function(r,p){
				
				var stack = p[0];
				var collection = p[1];
				
				var html = collection.markup.blocks[stack[2].className];
				if(html){
					var next = stack[2].nextElementSibling;
					var block = document.createElement("div");
					block.innerHTML = html;
					block = block.firstElementChild;
					if(next){
						stack[1].insertBefore(block,next);
					}else{
						stack[1].appendChild(block);
					}
					r.set.caret.start(r,[block])
				}
			},
			insert : function(r,p,c){
				var ref    = r.collections[p[0]];
				var markup = ref.markup.styles[p[1]];
				var collection = r.set.collection(r,[ref,markup]);
				r.set.caret.start(r,[collection]);
				return collection
			},
		},		
		collection : function(r,p){
			var ref = p[0];
			var collection = ref.markup.collection[p[1][0]];
			var element    = document.createElement('div');
			element.innerHTML = collection;
			collection = element.firstElementChild;
			collection.innerHTML = ref.markup.containers[p[1][1]];
			collection.firstElementChild.innerHTML = ref.markup.blocks[p[1][2]];
			return collection;
		}
	},
	get : {
		html : function(r,p){
			var div = document.createElement("div");
			div.innerHTML = p[0];
			return div.firstElementChild;
		},
		target : {
			text : function(p){
				return p[0]?p[0].textContent.replace(/[\n\r]+|[\s]{2,}/g,' ').trim():-1;
			},
			collection : function(r,p){
				var target = p[0];
				var items  = [],block;
				var collection = r.collections[target.className];
				
				while(!collection && target){
					items[items.length] = target;
					collection = r.collections[target.className];
					target = target.parentElement;
				}
				items = items.reverse();
				target = items[items.length-1];
				target = target.tagName==='BR'?target.parentElement:target;
				target = [items[2],items[3],items[items.length-1]];
				return collection ? [collection,items,target] : undefined;
			},
			clone : function(r,p){
				var clone = p[0].cloneNode(true);
				var elements = clone.children,target,start;
				for(i=0;i<elements.length;i++){
					target = elements[i];
					start = null;
					while(target){
						start  = target;
						target = target.firstElementChild;
					}
					target=start.tagName==='BR'||start.nodeType!==1?start.parentElement:start;
					target.innerHTML = '<br>';
				}
				return clone;
			}
		},
		property : function(r,p){
			var obj   = p[0][0];
			var items = p[0][1];
			var paths = p[1];
			for(path in paths){obj=obj?obj[paths[path]]:undefined;}
			var count = 0,property;
			if(obj){
				for(item in items){
					count++;
					var i = items[item];
					var classes = i.classList;
					for(var c = 0;c<classes.length;c++){
						property = obj[classes[c]];
						if(property!==undefined){break;}
					}
					if(property === undefined){
						property = obj[i.tagName.toLowerCase()];
					}
					if(property!==undefined){break;}
				}
				return property;
			}else{
				return undefined;
			}
		},
	},
	
	collections : {
		
		paragraph : {
			markup : {
				styles    	: {"default":['paragraph','container','p']},
				collection  : {'paragraph':'<div class="paragraph"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'p':'<p><span><br></span></p>'}
			},
			triggers : {13:{p:1},8:{p:1}},
			selector : {'p':true},
			modifier : {'a':["modifier-link",1],'span':["modifier-text",0]}
		},
		heading : {
			
			markup : {
				styles    	: {"default":['heading','container','h3']},
				collection  : {'heading':'<div class="heading"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'h3':'<h3><span>Sample Heading</span></h3>'}
			},
			selector : {'div':false}
		},
		quote : {
			markup : {
				styles    	: {"default":['quote','container','blockquote']},
				collection  : {'quote':'<div class="quote"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'blockquote':'<blockquote><span>If you don\'t know where your going, any road will get you there.</span><cite>Jane Doe, Mrs Insightful</cite></blockquote>'}
			},
		},		
		
		note : {
			markup : {
				styles    	: {"default":['note','container','note']},
				collection  : {'note':'<div class="note"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'note':'<div class="item"><h5 class="item-heading">Note:</h5><div class="item-txt">This information is important to you.</div></div>'}
			},
		},			

		image : {
			markup : {
				styles    	: {"default":['image','container','upload'],
							   "basic":['image','container','basic']},
				collection  : {'image':'<div class="image" contenteditable="false"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {
								'upload':'<div class="upload" contenteditable="false"><div class="upload-item"><img class="upload-item-img" src="https://rumcore.github.io/writable.ai/v2/icons/svg/black-selector-image.svg"/><span>Drag & Drop image or </span><a class="upload-item-link">click here </a><span>to add image URL.</span></div></div>',
								'basic' : '<div class="basic"><img class="basic-img"/></div>'
							  },
			},
			actions : {
				init : function(r,p){
					var items      = p[0].getElementsByClassName("image");
					var collection = p[1];
					for(var i=0;i<items.length;i++){
						collection.actions.set.uploader(r,[items[i]]);
					}
				},
				set : {
					uploader : function(r,p){
						var collection = p[0];
						var container = collection.firstElementChild;
						container.addEventListener("click",function(p){
							var params    = {title:'Add Image URL'};
							params.styles = {padding:"24px",width:"360px"}
							params.inputs = [["textarea",{id:'img-url',rows:4}]]
							params.options = {}
							params.options.done = function(r){
								var src = document.getElementById("img-url").value;
								var e = document.createElement('div');
								e.innerHTML = r.collections["image"].markup.blocks["basic"];
								var img = e.firstElementChild;
								img.firstElementChild.src = src;
								container.replaceChild(img,container.firstElementChild);
								r.dialog.hide(r);
							}
							r.dialog.show(r,[params]);
						});
						container.addEventListener("dragover",function(p){},false);
						container.addEventListener("drop",function(p){
						r.api.set.image.upload(r,function(p){
							var src    = p[0];
							var srcset = p[1];
							var e = document.createElement('div');
							e.innerHTML = r.collections["image"].markup.blocks["basic"];
							var img = e.firstElementChild;
							img.firstElementChild.src = src;
							img.srcset = srcset;
							container.replaceChild(img,container.firstElementChild);
						});
					},false);
						
					}
				}
			}
		},			
		
		list : {
			markup : {
				styles    	: {
								"default" :['list','container','bullet'],
								"numbered":['list','container','numbered'],
								"alphabetical":['list','container','alphabetical'],
								"icon"	  :['list','container','icon']
							  },
				collection  : {'list':'<div class="list"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks      : {'bullet':'<ul class="unordered"><li class="unordered-item"><span>List Item.</span></li></ul>',
							   'numbered':'<ol class="ordered"><li class="ordered-item"><span>List Item.</span></li></ol>',
							   'alphabetical':'<ol type="A" class="ordered"><li class="ordered-item"><span>List Item.</span></li></ol>',
							   'icon':'<ul class="icon"><li class="icon-item"><span>List Icon Item.</span></li></ul>'
							  },
				
			},
			triggers : {13:{li:1},8:{li:1}},
			selector : false,
			actions : {
				set : {
					icon : function(p){
						var collection = p[0];
						var elements = collection.getElementsByTagName("li");
						for(var i = 0;i<elements.length;i++){
							elements[i].style.backgroundImage = "url('"+p[1]+"')";
						}
					}
				}
				
			},
		},
		expandable : {
			markup : {
				styles    	: {"default" :['expandable','border','item'],
							   "resources" :['expandable','container','resource']},
				collection  : {'expandable':'<div class="expandable"></div>'},
				containers  : {
								'border':'<div class="container border"></div>',
								'container':'<div class="container"></div>'
							  },
				blocks : {
					"item":'<div class="item"><div class="item-toggle show">Sample Title</div><div class="item-content"><div class="paragraph"><div class="container"><p><span>Details</span></p></div></div></div></div>',
					"resource":'<div class="resource"><div class="resource-toggle show">Title</div><div class="resource-list"><a class="resource-list-item" href="">Sample 1</a></div></div>'
				},
				elements : {'resource-list-item':'<a class="resource-list-item" href=""><br></a>'} 
			},
			triggers : {13:{"item-toggle":4,"resource-toggle":4,"resource-list-item":5},
					   8:{"resource-list-item":3}},
			selector : {"content":true}
		},
		table : {
			markup : {
				styles    	: {"default" :['table','container','default'],
							   "heading" :['table','container','heading'],
							   "row" :['table','container','row'],},
				collection  : {'table':'<div class="table"></div>'},
				containers  : {'container':'<div class="container"></div>'},
				blocks : {
					'default':'<div class="row"><div class="row-heading _4"><span>Column 1</span></div><div class="row-heading _4"><span>Column 2</span></div><div class="row-heading _4"><span>Column 3</span></div></div><div class="row"><div class="row-cell _4"><span><br></span></div><div class="row-cell _4"><span><br></span></div><div class="row-cell _4"><span><br></span></div></div>',
					'heading':'<div class="row"><div class="row-heading _4"><span>Column 1</span></div><div class="row-heading _4"><span>Column 2</span></div><div class="row-heading _4"><span>Column 3</span></div></div>',
					'row':'<div class="row"><div class="row-cell _4"><span><br></span></div><div class="row-cell _4"><span><br></span></div><div class="row-cell _4"><span><br></span></div></div>'
				}
			},
			triggers : {13:{"row-cell":3}},
			selector : false
		},
		

	},
	
	
	
	dialog : {
		init : function(r){
			var block = r.get.html(r,[this.block]);
			block.addEventListener("click",function(e){
				if(e.target.id === 'dialog'){r.dialog.hide(r);}
			});
			document.body.appendChild(block);
			this.block = block;
		},
		show : function(r,p){
			var params = p[0];
			r.dialog.selection = r.selection;
			r.dialog.active = true;
			r.dialog.block.style.display = "block";
			
			for(param in params){
				if(r.dialog.items[param]){
					r.dialog.items[param](r,[params[param]])
				}
			}
		},
		hide : function(r){
			r.selection = r.dialog.selection;
			r.dialog.active = false;
			r.dialog.block.style.display = "none";
			r.dialog.block.firstElementChild.innerHTML = "";
		},
		block : '<div id="dialog" class="dialog"><div class="panel"></div><div class="av"></div></div>',
		items : {
			styles : function(r,p){
				var dialog = r.dialog.block.firstElementChild;	
				var styles = p[0];
				for(style in styles){
					dialog.style[style] = styles[style];
				}
			},
			title : function(r,p){
				var title = document.createElement("h5");
				var span  = document.createElement("span");
				title.className = "panel-heading"
				span.innerHTML = p[0];
				title.appendChild(span);
				r.dialog.block.firstElementChild.appendChild(title);
			},
			buttons : function(r,p){
				var item  = document.createElement("button");
				var icon  = document.createElement("img");
				var label = document.createElement("div");
				var items = p[0];
				for(_item in items){
					(function(){
					var i = items[_item]
					item  = item.cloneNode();
					icon  = icon.cloneNode();
					label = label.cloneNode();
					icon.src = i[0];
					label.innerHTML = i[1];
					item.addEventListener("click",function(){
						i[2](r);
					});
					item.appendChild(icon);
					item.appendChild(label);
					r.dialog.block.firstElementChild.appendChild(item);
					})();
				}
				
			},
			inputs : function(r,p){
				var inputs = p[0];
				for(input in inputs){
					var wrapper = document.createElement("div");
					var element = document.createElement(inputs[input][0]);
					var attributes = inputs[input][1];
					wrapper.className = "input";
					for(attribute in attributes){
						element.setAttribute(attribute,attributes[attribute]);
					}
					wrapper.appendChild(element)
					r.dialog.block.firstElementChild.appendChild(wrapper)
				}
			},
			options : function(r,p){
				var options = document.createElement("div");
				options.className = "options";
				var cancel = document.createElement("button");
				var done   = document.createElement("button");
				cancel.innerHTML = "Cancel";
				done.innerHTML = "Done";
				cancel.addEventListener("click",function(){r.dialog.hide(r);});
				done.addEventListener("click",function(){p[0].done(r);r.dialog.hide(r);});
				options.appendChild(cancel);
				options.appendChild(done);
				r.dialog.block.firstElementChild.appendChild(options)
			}
			
		}
		
	}
		
	
	
	
	

}; // end writable






//invoke script
window.addEventListener('load',function(){writable.init(writable);},false);
