
	
const selectors = {
	
		init : function(r,p){
			var block = document.createElement("div");
			block.innerHTML = this.block;
			block = block.firstElementChild;
			
			r.writable = p[0];
			r.dialog = p[1];
			r.collections = p[2];
			
			// load options
			var items = this.items;
			var ep,ei;
			for(item in items){
				(function(){
					var i = items[item];
					ep = document.createElement("div");
					ep.id  = item;
					ep.style.backgroundImage = "url("+items[item][0]+")";
					ep.className = "options-option";
					ep.addEventListener("click",function(){i[3](r);})
					block.firstElementChild.lastElementChild.appendChild(ep);
				})();
			}
			block.firstElementChild.firstElementChild.addEventListener("click",function(r,p){
				var toggle = this;
				if(toggle.dataset.state === '1'){
					toggle.style.backgroundImage = "url(https://rumcore.github.io/writable.ai/v2/icons/svg/black-selector-open.svg)";
					toggle.nextElementSibling.style.display = 'none';
					toggle.dataset.state = '0';
				}else{
					toggle.style.backgroundImage = "url(https://rumcore.github.io/writable.ai/v2/icons/svg/black-selector-close.svg)";
					toggle.nextElementSibling.style.display = 'inline-block';
				
					toggle.dataset.state = '1';
				}
			});
			this.block = block;
			document.body.appendChild(block);
	
		},
		show : function(r,p){
			console.log(p[0])
			this.target = p[0];
			var left = this.target.offsetLeft-72;
			var top  = this.target.offsetTop-2;
			this.active = true;
			this.block.style.display = "block"
			this.block.style.left = left+"px";
			this.block.style.top  = top+"px";
		},
		hide : function(r){
			
			if(this.active){
				this.active = false;
				this.block.style.display = "none";
				var toggle = this.block.firstElementChild.firstElementChild;
				toggle.style.backgroundImage = "url(https://rumcore.github.io/writable.ai/v2/icons/svg/black-selector-add.svg)";
				toggle.nextElementSibling.style.display = 'none';
				toggle.dataset.state = '0';
				
				this.target = null;
			}

		},
		
		toggle : function(r,p){
			var collection = p[0];
			var block   = collection[2][0];
			if(r.trigger === 0 || r.trigger === 2){
				var selector = r.get.property(r,[collection,["selector"]]);
				var len = r.get.target.text([block]).length;
			
				if(selector && len===0){
					this.show(r,[block])
				}else{
					this.hide(r)
				}
			}
		},
	
	
		insert : function(r,p,c){
			var target = r.target;
			var ref    = r.collections[p[0]];
			var markup = ref.markup.styles[p[1]];
			var action = p[2];
			var collection = r.set.collection(r,[ref,markup]);
			r.set.target.splice(r,[collection,target]);
			typeof action==='function'?action([collection]):null; 
			r.set.caret.start(r,[collection]);
			r.hide(r)
			r.dialog.hide(r);
			return collection
		},
		
		block : '<div id="selector" class="selector"><div><div class="toggle"></div><div class="options"></div></div></div>',
		
		insert : function(r,p,c){
			var target = r.target;
			var ref    = r.collections[p[0]];
			var markup = ref.markup.styles[p[1]];
			var action = p[2];
			console.log(target)
			var collection = r.writable.set.collection(r,[ref,markup]);
			console.log(collection)
			r.writable.set.target.splice(r.writable,[collection,target]);
			typeof action==='function'?action([collection]):null; 
			r.writable.set.caret.start(r.writable,[collection]);
			r.hide(r)
			r.dialog.hide(r);
			return collection
		},
		
		items : {
			
			"selector-text" : [
				"https://rumcore.github.io/writable.ai/v2/icons/svg/black-selector-text.svg",
				-1,
				-1,
				function(r){
					var params = {};
					params.styles = {padding:"0px",width:"360px"};
					params.buttons = [
						["https://rumcore.github.io/writable.ai/assets/icons/svg/white/white-selector-heading.svg","Heading",function(){
							r.insert(r,['heading','default']);
						}],["https://rumcore.github.io/writable.ai/assets/icons/svg/white/white-selector-quote.svg","Quote",function(){
							r.insert(r,['quote','default']);
						}],["https://rumcore.github.io/writable.ai/assets/icons/svg/white/white-selector-tip.svg","Note",function(){
							r.insert(r,['note','default']);
						}]
					]
					
					r.dialog.show(r,[params]);
				}
			],
			"selector-image" : [
				"https://rumcore.github.io/writable.ai/v2/icons/svg/black-selector-image.svg",
				-1,
				-1,
				function(r){
					r.insert(r,['image','default',function(p){
						r.collections['image'].actions.set.uploader(r.writable,[p[0]]);
					}]);
				}
			],
			"selector-list" : [
				"https://rumcore.github.io/writable.ai/v2/icons/svg/black-selector-list.svg",
				-1,
				-1,
				function(r){
					var params = {};
					params.styles = {padding:"0px",width:"360px"};
					params.buttons = [
						["https://rumcore.github.io/writable.ai/assets/icons/svg/white/selector-unordered.svg","Bulleted",function(){
							r.insert(r,['list','default']);
						}],
						["https://rumcore.github.io/writable.ai/assets/icons/svg/white/selector-unordered.svg","Ordered",function(){
							r.insert(r,['list','numbered']);
						}],["https://rumcore.github.io/writable.ai/assets/icons/svg/white/selector-unordered.svg","Icons",function(){
							
							var params = {};
							params.styles = {padding:"0px",width:"360px"};
							params.buttons = [
							["https://rumcore.github.io/writable.ai/v2/icons/svg/white-check.svg","Check",function(){r.insert(r,['list','icon',function(p){
								r.collections['list'].actions.set.icon([p[0],'https://rumcore.github.io/writable.ai/v2/icons/svg/dark-check.svg'])}]);
																
							}],
							["https://rumcore.github.io/writable.ai/v2/icons/svg/white-cross.svg","Cross",function(){r.insert(r,['list','icon',function(p){
								r.collections['list'].actions.set.icon([p[0],'https://rumcore.github.io/writable.ai/v2/icons/svg/dark-cross.svg'])}]);
																
							}],	
							
							["https://rumcore.github.io/writable.ai/v2/icons/svg/white-check.svg","Check",function(){r.insert(r,['list','icon',function(p){
								r.collections['list'].actions.set.icon([p[0],'https://rumcore.github.io/writable.ai/v2/icons/svg/dark-check.svg'])}]);
																
							}],
							
								
							]
							
							r.dialog.hide(r);
							r.dialog.show(r,[params]);
						
						}],
						
						["https://rumcore.github.io/writable.ai/v2/icons/svg/white-selector-resources.svg","Resources",function(){
							r.insert(r,['expandable','resources']);
						}],
						
						["https://rumcore.github.io/writable.ai/assets/icons/svg/white/selector-expandable.svg","Expandables",function(){
							r.insert(r,['expandable','default']);
						}],
						["https://rumcore.github.io/writable.ai/assets/icons/svg/white/selector-ordered.svg","Steps",function(){
							r.insert(r,['list','numbered']);
						}],
							
					]
					r.dialog.show(r,[params]);
					
				}
			],
			"selector-table" : [
				"https://rumcore.github.io/writable.ai/v2/icons/svg/black-selector-table.svg",
				-1,
				-1,
				function(r){
					var collection = r.insert(r,['table','default']);
				}
			],
	
			
		}
		
}
	  
	